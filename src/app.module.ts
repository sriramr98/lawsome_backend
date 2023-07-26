import { HttpException, Module } from '@nestjs/common';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from '@ntegral/nestjs-sentry';

import config from './config/config';
import { ConvoModule } from './core/convo/convo.module';
import { Conversation } from './core/convo/entities/Conversation';
import { Chat } from './core/convo/entities/Chats';
import { ChatModule } from './core/chat/chat.module';
import { FirebaseModule } from './core/common/firebase.module';
import { LawModule } from './core/law/law.module';
import { Act } from './core/law/entities/Acts';
import { Law } from './core/law/entities/Laws';
import { HealthModule } from './core/health/health.module';

@Module({
    imports: [
        SentryModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                dsn: configService.get<string>('sentry.dsn'),
                debug: configService.get<string>('env') === 'development',
                environment: configService.get<string>('env'),
            }),
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
                models: [Conversation, Chat, Act, Law],
                dialectOptions: {
                    ssl: {
                        rejectUnauthorized:
                            configService.get<string>('env') === 'production',
                    },
                },
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
            useFactory: () =>
                new SentryInterceptor({
                    filters: [
                        {
                            type: HttpException,
                            filter: (exception: HttpException) =>
                                500 >= exception.getStatus(), // Only report 500 errors
                        },
                    ],
                }),
        },
    ],
    exports: [],
})
export class AppModule {}
