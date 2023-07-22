import { Injectable, OnModuleInit } from '@nestjs/common';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PineconeClient } from '@pinecone-database/pinecone';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

@Injectable()
export class PineconeService implements OnModuleInit {
    private store: PineconeStore;

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        if (!this.store) {
            const client = new PineconeClient();
            await client.init({
                apiKey: this.configService.get<string>('pinecone.apiKey'),
                environment: this.configService.get<string>('pinecone.env'),
            });

            const index = client.Index(
                this.configService.get<string>('pinecone.index'),
            );
            const embeddingModel = new OpenAIEmbeddings({
                azureOpenAIApiKey:
                    this.configService.get<string>('ai.azureApiKey'),
                azureOpenAIApiDeploymentName: this.configService.get<string>(
                    'ai.azureApiEmbeddingDeploymentName',
                ),
                azureOpenAIApiVersion:
                    this.configService.get<string>('ai.azureApiVersion'),
                azureOpenAIApiInstanceName: this.configService.get<string>(
                    'ai.azureApiInstanceName',
                ),
            });

            this.store = await PineconeStore.fromExistingIndex(embeddingModel, {
                pineconeIndex: index,
            });
        }
    }

    async semanticSearch(query: string, topK: number) {
        return await this.store.similaritySearch(query, topK);
    }
}
