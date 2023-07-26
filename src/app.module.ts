import { Module } from '@nestjs/common';
import { ConvoModule } from './core/convo/convo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Conversation } from './core/convo/entities/Conversation';
import { Chat } from './core/chat/entities/Chats';
import { ChatModule } from './core/chat/chat.module';
import { FirebaseModule } from './core/common/firebase.module';
import { LawModule } from './core/law/law.module';
import { Act } from './core/law/entities/Acts';
import { Law } from './core/law/entities/Laws';
import { HealthModule } from './core/health/health.module';
import { Source } from './core/chat/entities/Source';

@Module({
    imports: [
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
                models: [Conversation, Chat, Act, Law, Source],
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
    providers: [],
    exports: [],
})
export class AppModule {}
