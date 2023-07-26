import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ConvoService } from '../convo/convo.service';
import { PineconeService } from 'src/libs/pinecone/pinecone.service';
import { OpenaiService } from 'src/libs/openai/openai.service';
import { AuthGuard } from '../auth/AuthGuard';
import { LawModule } from '../law/law.module';
import { ChatController } from './chat.controller';

@Module({
    providers: [
        AuthGuard,
        ChatGateway,
        ChatService,
        ConvoService,
        PineconeService,
        OpenaiService,
    ],
    imports: [LawModule],
    exports: [ChatService],
    controllers: [ChatController],
})
export class ChatModule {}
