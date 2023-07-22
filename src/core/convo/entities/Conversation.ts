import { Model, Table, Column, AllowNull, Index } from 'sequelize-typescript';

@Table({ tableName: 'conversations' })
export class Conversation extends Model {
    @AllowNull(false)
    @Column
    title: string;

    @Index
    @AllowNull(false)
    @Column
    userId: string;
}
