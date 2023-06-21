import Chat from './../entities/Chat'

async function getChatHistory(user_id: string, chat_id: string, limit: number = 10, offset: number = 0) {
    const chat_history = await Chat.findAll(
        { where: { user_id, chat_id }, limit, order: [['createdAt', 'DESC']], offset }
    )
    return chat_history
}

async function addNewChatResponse(user_id: string, chat_id: string, resp: string) {
    const chat = await Chat.create({ user_id, chat_id, sender: 'AI', message: resp })
    return chat
}

export default {
    getChatHistory,
    addNewChatResponse
}