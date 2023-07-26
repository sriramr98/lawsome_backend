import { Injectable } from '@nestjs/common';
import { Conversation } from './entities/Conversation';
import { Chat } from './entities/Chats';

@Injectable()
export class ConvoService {
    getConversations(userId: string): Promise<Array<Conversation>> {
        return Conversation.findAll({
            where: {
                userId,
            },
            attributes: ['id', 'title', 'createdAt', 'updatedAt'],
        });
    }

    getChatHistoryOfConversation(
        convoId: string,
        userId: string,
    ): Promise<Array<Chat>> {
        return Chat.findAll({
            where: {
                conversationId: convoId,
                userId,
            },
            attributes: ['id', 'message', 'sender', 'createdAt'],
        });
    }

    async createConversation(title: string, userId: string) {
        return await Conversation.create({
            title,
            userId,
        });
    }
}
