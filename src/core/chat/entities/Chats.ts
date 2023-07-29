import { DataTypes } from 'sequelize';
import {
    Model,
    Table,
    Column,
    Index,
    HasMany,
    Default,
} from 'sequelize-typescript';
import { Source } from './Source';
import { FeedbackType } from '../models/FeedbackType';

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

    // -1 => No Feedback
    // 0 => Dislike
    // 1 => Like
    @Default(FeedbackType.NO_FEEDBACK)
    @Column(
        DataTypes.ENUM(
            FeedbackType.DISLIKE,
            FeedbackType.LIKE,
            FeedbackType.NO_FEEDBACK,
        ),
    )
    likeStatus: string;

    @HasMany(() => Source)
    sources: Array<Source>;
}
