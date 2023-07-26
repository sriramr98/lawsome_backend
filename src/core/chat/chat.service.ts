import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OpenaiService } from 'src/libs/openai/openai.service';
import { PineconeService } from 'src/libs/pinecone/pinecone.service';
import { ConvoService } from '../convo/convo.service';
import { LawService } from '../law/law.service';
import { Law } from '../law/entities/Laws';
import { Sequelize } from 'sequelize-typescript';
import { Chat } from './entities/Chats';
import { Act } from '../law/entities/Acts';
import { Source } from './entities/Source';
import { Feedback } from './entities/Feedback';
import { FeedbackType } from './models/FeedbackType';

@Injectable()
export class ChatService {
    constructor(
        private openaiService: OpenaiService,
        private pineconeService: PineconeService,
        private lawService: LawService,
        private sequelize: Sequelize,
    ) {}

    async chat(
        conversationId: string,
        userId: string,
        question: string,
    ): Promise<Observable<string>> {
        const chat_history = await this.getChatHistoryOfConversation(
            conversationId,
            userId,
        );

        let searchQuery = await this.openaiService.prepareQuestion(
            question,
            chat_history,
        );

        if (searchQuery.startsWith('Search Query:')) {
            // Remove Search Query: from the string
            searchQuery = searchQuery.split('Search Query:')[1].trim();
        }

        console.log({ searchQuery });
        const context = await this.pineconeService.semanticSearch(
            searchQuery,
            3,
        );

        const structContext = context.map((c) => ({
            content: c.pageContent,
            metadata: c.metadata,
        }));

        return this.openaiService.ask(question, structContext, chat_history);
    }

    async extractSources(answer: string): Promise<Array<Law>> {
        const regex = /\[(.*?)\]/g;
        const matches = [];
        let match;
        while ((match = regex.exec(answer))) {
            matches.push(match[1]);
        }

        const sources = await this.lawService.getLawsAndActs(matches);
        return sources;
    }

    async addQAToConversation(
        question: string,
        answer: string,
        userId: string,
        conversationId: string,
        sources: Array<Law>,
    ) {
        await this.sequelize.transaction(async (t) => {
            await Chat.create(
                {
                    conversationId,
                    userId,
                    message: question,
                    sender: 'user',
                },
                { transaction: t },
            );
            const resp = await Chat.create(
                {
                    conversationId,
                    userId,
                    message: answer,
                    sender: 'bot',
                },
                { transaction: t },
            );

            for (let source of sources) {
                await Source.create(
                    {
                        chat_id: resp.id,
                        law_id: source.id,
                    },
                    { transaction: t },
                );
            }
        });
    }

    async getChatHistoryOfConversation(
        convoId: string,
        userId: string,
        limit: number = 10,
        offset: number = 0,
        includeSources: boolean = true,
    ): Promise<Array<Chat>> {
        return Chat.findAll({
            where: {
                conversationId: convoId,
                userId,
            },
            attributes: ['id', 'message', 'sender', 'likeStatus', 'createdAt'],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: includeSources
                ? [{ model: Source, include: [{ model: Law, include: [Act] }] }]
                : [],
        });
    }

    async addFeedback(
        chatId: number,
        userId: string,
        isLiked: boolean,
        feedback?: string,
    ): Promise<void> {
        await this.sequelize.transaction(async (t) => {
            const likeStatus = isLiked
                ? FeedbackType.LIKE
                : FeedbackType.DISLIKE;

            await Chat.update(
                { likeStatus },
                {
                    where: {
                        id: chatId,
                        userId,
                    },
                    transaction: t,
                },
            );

            if (feedback) {
                await Feedback.create(
                    {
                        chat_id: chatId,
                        feedback,
                    },
                    { transaction: t },
                );
            }
        });
    }
}
