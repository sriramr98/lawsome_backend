import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OpenaiService } from 'src/libs/openai/openai.service';
import { PineconeService } from 'src/libs/pinecone/pinecone.service';
import { ConvoService } from '../convo/convo.service';
import { LawService } from '../law/law.service';
import { Law } from '../law/entities/Laws';

@Injectable()
export class ChatService {
    constructor(
        private openaiService: OpenaiService,
        private pineconeService: PineconeService,
        private convoService: ConvoService,
        private lawService: LawService,
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
        const context = await this.pineconeService.semanticSearch(question, 3);

        const structContext = context.map((c) => ({
            content: c.pageContent,
            metadata: c.metadata,
        }));

        return this.openaiService.ask(question, structContext, chat_history);
    }

    async extractSources(answer: string): Promise<Array<Law>> {
        const regex = /\[(.*?)\]/g;
        const matches = [];
        let match;
        while ((match = regex.exec(answer))) {
            matches.push(match[1]);
        }

        const sources = await this.lawService.getLawsAndActs(matches);
        return sources;
    }
}
