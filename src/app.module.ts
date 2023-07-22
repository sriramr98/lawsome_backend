import { Module } from '@nestjs/common';
import { ConvoModule } from './core/convo/convo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Conversation } from './core/convo/entities/Conversation';
import { Chat } from './core/convo/entities/Chats';

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
                models: [Conversation, Chat],
                dialectOptions: {
                    ssl: {
                        rejectUnauthorized:
                            configService.get<string>('env') === 'production',
                    },
                },
            }),
        }),
        ConvoModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
