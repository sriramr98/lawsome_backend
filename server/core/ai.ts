import { Model } from "sequelize";
import { OpenAI } from 'langchain/llms/openai'

interface AIResponse {
    msg: string
}

const model = new OpenAI({ temperature: 0, openAIApiKey: process.env.OPENAI_API_KEY })

async function chatWithAI(
    chat_history: any[],
    question: string
): Promise<AIResponse> {
    const chat_history_str = chat_history.map(chat => `${chat.sender}: ${chat.message}`).join('\n')

    const prompt = `You are a lawyer bot who's amazing at solving people's legal problem. 
    You are chatting with another lawyer who needs your help in anyway you can.
    You are also given a chat history between you and the lawyer.
    Use the context of the chat and any legal information you know to respond to the chat.
    You do not have to explain legal terms in detail unless asked. You will also ask as many questions as you want to get more clarity on the problem.
    
    CHAT HISTORY"""
    ${chat_history_str}
    """
    
    QUESTION"""
    ${question}
    """
    `

    console.log({ prompt })

    const resp = await model.call(prompt)
    return { msg: resp }
}

export default {
    chatWithAI
}