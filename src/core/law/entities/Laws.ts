import { DataTypes } from 'sequelize';
import {
    Model,
    Table,
    Column,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { Act } from './Acts';

@Table({ tableName: 'laws', timestamps: false })
export class Law extends Model {
    @Column(DataTypes.TEXT)
    title: string;

    @Column(DataTypes.TEXT)
    content: string;

    @Column(DataTypes.INTEGER)
    @ForeignKey(() => Act)
    act_id: number;

    @Column(DataTypes.STRING)
    law_id: string;

    @Column(DataTypes.STRING)
    law_type: string;

    @BelongsTo(() => Act)
    act: Act;
}
