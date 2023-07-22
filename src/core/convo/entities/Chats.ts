import { DataTypes } from 'sequelize';
import { Model, Table, Column, AllowNull, Index } from 'sequelize-typescript';

@Table({ tableName: 'chat_messages' })
export class Chat extends Model {
    @Index('convo-user')
    @Column
    conversationId: string;

    @Index('convo-user')
    @Column
    userId: string;

    @Column(DataTypes.ENUM('user', 'bot'))
    sender: string;

    @Column(DataTypes.TEXT)
    message: string;
}
