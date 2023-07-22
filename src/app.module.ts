import { Module } from '@nestjs/common';
import { ConvoModule } from './core/convo/convo.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
        ConvoModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
