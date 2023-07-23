import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ConvoService } from '../convo/convo.service';
import { PineconeService } from 'src/libs/pinecone/pinecone.service';
import { OpenaiService } from 'src/libs/openai/openai.service';
import { AuthGuard } from '../auth/AuthGuard';

@Module({
    providers: [
        AuthGuard,
        ChatGateway,
        ChatService,
        ConvoService,
        PineconeService,
        OpenaiService,
    ],
})
export class ChatModule {}