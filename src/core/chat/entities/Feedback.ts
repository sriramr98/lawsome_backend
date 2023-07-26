import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'feedback' })
export class Feedback extends Model {
    @Column
    chat_id: number;

    @Column(DataTypes.TEXT)
    feedback: string;
}
