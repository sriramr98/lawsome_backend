import { Module } from '@nestjs/common';
import { ConvoController } from './convo.controller';
import { ConvoService } from './convo.service';

@Module({
    controllers: [ConvoController],
    providers: [ConvoService],
})
export class ConvoModule {}
