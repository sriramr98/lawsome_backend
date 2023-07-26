import { Module } from '@nestjs/common';
import { ConvoController } from './convo.controller';
import { ConvoService } from './convo.service';
import { ChatModule } from '../chat/chat.module';

@Module({
    controllers: [ConvoController],
    providers: [ConvoService],
    imports: [ChatModule],
})
export class ConvoModule {}
