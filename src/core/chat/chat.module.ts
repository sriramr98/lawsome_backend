import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ConvoService } from '../convo/convo.service';
import { PineconeService } from 'src/libs/pinecone/pinecone.service';
import { OpenaiService } from 'src/libs/openai/openai.service';

@Module({
    providers: [
        ChatGateway,
        ChatService,
        ConvoService,
        PineconeService,
        OpenaiService,
    ],
})
export class ChatModule {}
