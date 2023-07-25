import { DataTypes } from 'sequelize';
import { Model, Table, Column, HasMany } from 'sequelize-typescript';
import { Law } from './Laws';

@Table({ tableName: 'acts', timestamps: false })
export class Act extends Model {
    @Column(DataTypes.TEXT)
    title: string;

    @HasMany(() => Law)
    laws: Law[];
}
