import { OpenAI } from "langchain/llms";


let openai: OpenAI;

export default function getOpenAI() {
    if (!openai) {
        openai = new OpenAI({ modelName: "gpt-3.5-turbo" })
    }

    return openai
}