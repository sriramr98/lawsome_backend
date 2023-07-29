import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Chat } from 'src/core/chat/entities/Chats';
import { QuestionContext } from 'src/types/QuestionContext';
import { QA_PROMPT, QUESTION_PROMPT } from './prompts';
import { Observable } from 'rxjs';
import {
    AIMessagePromptTemplate,
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';

@Injectable()
export class OpenaiService implements OnModuleInit {
    private openai: ChatOpenAI;
    private openAiNonStream: ChatOpenAI;

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        if (!this.openai) {
            const config = {
                // azureOpenAIApiKey:
                //     this.configService.get<string>('ai.azureApiKey'),
                // azureOpenAIApiDeploymentName: this.configService.get<string>(
                //     'ai.azureApiDeploymentName',
                // ),
                // azureOpenAIApiVersion:
                //     this.configService.get<string>('ai.azureApiVersion'),
                // azureOpenAIApiInstanceName: this.configService.get<string>(
                //     'ai.azureApiInstanceName',
                // ),
                openAIApiKey: this.configService.get<string>('ai.openaiApiKey'),
                verbose: true,
            };
            this.openai = new ChatOpenAI({
                ...config,
                streaming: true,
                modelName: 'gpt-4-0613',
            });

            this.openAiNonStream = new ChatOpenAI({
                ...config,
                streaming: false,
                modelName: 'gpt-3.5-turbo',
            });
        }
    }

    async prepareQuestion(
        question: string,
        chat_history: Array<Chat>,
    ): Promise<string> {
        const formattedChatHistory =
            this.formatChatHistoryForPrompt(chat_history);

        const questionPrompt =
            HumanMessagePromptTemplate.fromTemplate(`Question: {question}`);

        const prompt = ChatPromptTemplate.fromPromptMessages([
            QUESTION_PROMPT,
            ...formattedChatHistory,
            questionPrompt,
        ]);

        const chain = new LLMChain({
            llm: this.openAiNonStream,
            prompt: prompt,
        });

        return await chain.predict({
            question,
            conversationHistory: formattedChatHistory,
        });
    }

    ask(
        question: string,
        context: Array<QuestionContext>,
        chat_history: Array<Chat>,
    ): Observable<string> {
        const formattedChatHistory =
            this.formatChatHistoryForPrompt(chat_history);

        const currentQuestionPrompt = HumanMessagePromptTemplate.fromTemplate(
            `Sources: \n --- {sources} --- \n Question: {question}`,
        );

        const formattedContext = context
            .map((c) => `Source: ${c.metadata['db_id']} \n ${c.content}`)
            .join('\n----\n');

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            QA_PROMPT,
            ...formattedChatHistory,
            currentQuestionPrompt,
        ]);

        const chain = new LLMChain({
            llm: this.openai,
            prompt: chatPrompt,
        });

        return new Observable((subscriber) => {
            chain.call(
                {
                    sources: formattedContext,
                    question,
                },
                [
                    {
                        handleLLMNewToken: (token) => subscriber.next(token),
                        handleLLMEnd: () => subscriber.complete(),
                        handleLLMError: (error) => subscriber.error(error),
                    },
                ],
            );
        });
    }

    private formatChatHistoryForPrompt(
        chat_history: Array<Chat>,
    ): (HumanMessagePromptTemplate | AIMessagePromptTemplate)[] {
        return chat_history.map((chat) => {
            if (chat.sender === 'user') {
                return HumanMessagePromptTemplate.fromTemplate(chat.message);
            } else {
                return AIMessagePromptTemplate.fromTemplate(chat.message);
            }
        });
    }
}
