import { Module } from '@nestjs/common';
import { ConvoController } from './convo.controller';

@Module({
  controllers: [ConvoController]
})
export class ConvoModule {}
