import { Module } from '@nestjs/common';
import { ConvoController } from './convo.controller';
import { Firebase } from '../common/firebase.service';
import { ConvoService } from './convo.service';

@Module({
    controllers: [ConvoController],
    providers: [Firebase, ConvoService],
})
export class ConvoModule {}
