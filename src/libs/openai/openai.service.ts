import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Chat } from 'src/core/convo/entities/Chats';
import { QuestionContext } from 'src/types/QuestionContext';
import { QA_PROMPT } from './prompts';
import { Observable, from } from 'rxjs';

interface TokenCallback {
    onNewToken(token: string): void;
}

@Injectable()
export class OpenaiService implements OnModuleInit {
    private openai: ChatOpenAI;

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        if (!this.openai) {
            const config = {
                azureOpenAIApiKey:
                    this.configService.get<string>('ai.azureApiKey'),
                azureOpenAIApiDeploymentName: this.configService.get<string>(
                    'ai.azureApiDeploymentName',
                ),
                azureOpenAIApiVersion:
                    this.configService.get<string>('ai.azureApiVersion'),
                azureOpenAIApiInstanceName: this.configService.get<string>(
                    'ai.azureApiInstanceName',
                ),
            };
            this.openai = new ChatOpenAI({
                ...config,
                streaming: true,
            });
        }
    }

    ask(
        question: string,
        context: Array<QuestionContext>,
        chat_history: Array<Chat>,
    ): Observable<string> {
        const chain = new LLMChain({
            llm: this.openai,
            prompt: QA_PROMPT,
        });

        const formattedContext = context.map((c) => c.content).join('\n----\n');

        return new Observable((subscriber) => {
            chain.call(
                {
                    question,
                    context: formattedContext,
                    conversationHistory: chat_history,
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
}
