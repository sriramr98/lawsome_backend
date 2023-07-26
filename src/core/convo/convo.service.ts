import { Injectable } from '@nestjs/common';
import { Conversation } from './entities/Conversation';

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

    async createConversation(title: string, userId: string) {
        return await Conversation.create({
            title,
            userId,
        });
    }
}
