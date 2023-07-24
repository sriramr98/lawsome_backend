import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OpenaiService } from 'src/libs/openai/openai.service';
import { PineconeService } from 'src/libs/pinecone/pinecone.service';
import { ConvoService } from '../convo/convo.service';

@Injectable()
export class ChatService {
    constructor(
        private openaiService: OpenaiService,
        private pineconeService: PineconeService,
        private convoService: ConvoService,
    ) {}

    async chat(
        conversationId: string,
        userId: string,
        question: string,
    ): Promise<Observable<string>> {
        const chat_history =
            await this.convoService.getChatHistoryOfConversation(
                conversationId,
                userId,
            );
            console.log("chat history",chat_history)
        const context = await this.pineconeService.semanticSearch(question, 3);

        const structContext = context.map((c) => ({
            content: c.pageContent,
            metadata: c.metadata,
        }));

        return this.openaiService.ask(question, structContext, chat_history);
    }
}
