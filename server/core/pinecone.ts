import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PineconeClient } from '@pinecone-database/pinecone'
import config from "../config";


let pinecone: PineconeStore;

export default async function getPineconeStore() {
    if (!pinecone) {

        const client = new PineconeClient();
        await client.init({
            apiKey: config.pinecone.apiKey,
            environment: config.pinecone.environment,
        })

        const index = client.Index(config.pinecone.indexName)

        const embeddings = new OpenAIEmbeddings({ verbose: true })
        pinecone = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index })
    }

    return pinecone
}