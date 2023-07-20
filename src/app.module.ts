import { Module } from '@nestjs/common';
import { ConvoModule } from './core/convo/convo.module';

@Module({
    imports: [ConvoModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
