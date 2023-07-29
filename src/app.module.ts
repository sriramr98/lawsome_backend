import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import config from './config/config';
import { ConvoModule } from './core/convo/convo.module';
import { Conversation } from './core/convo/entities/Conversation';
import { Chat } from './core/chat/entities/Chats';
import { ChatModule } from './core/chat/chat.module';
import { FirebaseModule } from './core/common/firebase.module';
import { LawModule } from './core/law/law.module';
import { Act } from './core/law/entities/Acts';
import { Law } from './core/law/entities/Laws';
import { HealthModule } from './core/health/health.module';
import { Source } from './core/chat/entities/Source';
import { SentryInterceptor } from './libs/SentryInterceptor';
import { Feedback } from './core/chat/entities/Feedback';

@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                transport: {
                    target: 'pino-pretty',
                    options: {
                        singleLine: true,
                    },
                },
            },
        }),
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                dialect: 'mysql',
                host: configService.get<string>('database.host'),
                port: configService.get<number>('database.port'),
                username: configService.get<string>('database.username'),
                password: configService.get<string>('database.password'),
                database: configService.get<string>('database.database'),
                synchronize: configService.get<string>('env') === 'development',
                sync: {
                    alter: configService.get<string>('env') === 'development',
                },
                models: [Conversation, Chat, Act, Law, Source, Feedback],
                dialectOptions: {
                    ssl: {
                        rejectUnauthorized:
                            configService.get<string>('env') === 'production',
                    },
                },
                logging: false,
            }),
        }),
        FirebaseModule,
        ConvoModule,
        ChatModule,
        LawModule,
        HealthModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useFactory: () => new SentryInterceptor(),
        },
    ],
    exports: [],
})
export class AppModule {}
