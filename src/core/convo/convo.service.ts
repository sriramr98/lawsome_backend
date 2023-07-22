import { Injectable } from '@nestjs/common';
import { Conversation } from './entities/Conversation';
import { Chat } from './entities/Chats';
import { CreateConvoDto } from './dto/CreateConvo.dto';

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
        conversationId: string,
        userId: string,
    ): Promise<Array<Chat>> {
        return Chat.findAll({
            where: {
                conversationId,
                userId,
            },
            attributes: ['id', 'message', 'sender', 'createdAt'],
        });
    }

    async createConversation(title: string, userId: string) {
        await Conversation.create({
            title,
            userId,
        });
    }
}
