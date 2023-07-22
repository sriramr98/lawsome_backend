import { Module } from '@nestjs/common';
import { ConvoController } from './convo.controller';
import { Firebase } from '../common/firebase.service';

@Module({
    controllers: [ConvoController],
    providers: [Firebase],
})
export class ConvoModule {}
