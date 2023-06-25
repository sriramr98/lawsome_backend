import { OpenAI } from 'langchain/llms/openai'
import { LLMChain } from 'langchain/chains'
import { VectorStore } from 'langchain/vectorstores';
import { Chat } from '../models/chat';
import { CHAT_PROMPT_TEMPLATE, CONTEXT_SUMMARIZER_TEMPLATE, QUESTION_SUMMARIZER_TEMPLATE } from './prompts'

interface AIResponse {
    msg: string
}

export default class ChatService {

    llm: OpenAI
    store: VectorStore

    constructor(llm: OpenAI, store: VectorStore) {
        this.llm = llm;
        this.store = store;
    }

    async chatWithAI(
        question: string,
        chat_history: Chat[]
    ): Promise<AIResponse> {
        const chat_history_str = chat_history.map(chat => `${chat.sender}: ${chat.message}`).join('\n')
        const final_qn = await this._generateQnFromHistory(question, chat_history_str)
        const relevant_docs = await this._searchDocs(final_qn)
        const summarized_docs = await this._summarizeDocs(final_qn, relevant_docs)
        const answer = await this._generateAnswer(final_qn, summarized_docs, chat_history_str)
        return { msg: answer  }
    }

    async _generateQnFromHistory(question: string, chat_history: string): Promise<string> { 
        const gen_chain = new LLMChain({ llm: this.llm, prompt: QUESTION_SUMMARIZER_TEMPLATE, verbose: true })
        return gen_chain.predict({ userPrompt: question, conversationHistory: chat_history })
    }

    async _searchDocs(question: string): Promise<string> {
        const docs = await this.store.similaritySearch(question, 4)
        return docs.map(doc => doc.pageContent).join("\n")
    }

    async _summarizeDocs(question: string, docs: string): Promise<string> {
        const gen_chain = new LLMChain({ llm: this.llm, prompt: CONTEXT_SUMMARIZER_TEMPLATE, verbose: true })
        return gen_chain.predict({ question, docs })
    }

    async _generateAnswer(question: string, summaries: string, chat_history: string): Promise<string> {
        const gen_chain = new LLMChain({ llm: this.llm, prompt: CHAT_PROMPT_TEMPLATE, verbose: true })
        return gen_chain.predict({ question, summaries, conversationHistory: chat_history })
    }

}

// async function chatWithAI(
//     chat_history: Chat[],
//     question: string
// ): Promise<AIResponse> {
//     const chat_history_str = chat_history.map(chat => `${chat.sender}: ${chat.message}`).join('\n')

//     const prompt = `You are a lawyer bot who's amazing at solving people's legal problem. 
//     You are chatting with another lawyer who needs your help in anyway you can.
//     You are also given a chat history between you and the lawyer.
//     Use the context of the chat and any legal information you know to respond to the chat.
//     You do not have to explain legal terms in detail unless asked. You will also ask as many questions as you want to get more clarity on the problem.
    
//     CHAT HISTORY"""
//     ${chat_history_str}
//     """
    
//     QUESTION"""
//     ${question}
//     """
//     `

//     console.log({ prompt })

//     const resp = await model.call(prompt)
//     return { msg: resp }
// }