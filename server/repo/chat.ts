import sequelize from './../entities/init'
import ChatEntity from './../entities/Chat'
import { Chat } from './../models/chat'

async function getChatHistory(user_id: string, chat_id: string, limit: number = 10, offset: number = 0): Promise<Chat[]> {
    const chat_history = await ChatEntity.findAll(
        { where: { user_id, chat_id }, limit, order: [['createdAt', 'DESC']], offset }
    )
    return chat_history.map(chat => chat.toJSON()) as Chat[]
}

async function addNewChatResponse(user_id: string, chat_id: string, answer: string, question: string) {
    sequelize().transaction(async (t) => {
        await ChatEntity.create({ user_id, chat_id, sender: 'user', message: question }, { transaction: t })
        await ChatEntity.create({ user_id, chat_id, sender: 'AI', message: answer }, { transaction: t })
    })
}

export default {
    getChatHistory,
    addNewChatResponse
}