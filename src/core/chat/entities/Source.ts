import {
    Model,
    Table,
    Column,
    AllowNull,
    Index,
    ForeignKey,
    BelongsTo,
    HasOne,
} from 'sequelize-typescript';
import { Chat } from './Chats';
import { Law } from 'src/core/law/entities/Laws';

@Table({ tableName: 'sources' })
export class Source extends Model {
    @AllowNull(false)
    @Column
    @Index
    @ForeignKey(() => Chat)
    chat_id: number;

    @AllowNull(false)
    @Column
    @ForeignKey(() => Law)
    law_id: number;

    @BelongsTo(() => Chat)
    chat: Chat;

    @BelongsTo(() => Law)
    law: Law;
}
