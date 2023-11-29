import {DataTypes, Model, Sequelize} from 'sequelize';

export class Thread extends Model {
    public id!: number;
    public name!: string;
}

export function initThreadModel(sequelize: Sequelize): void {
    Thread.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    }, {
        tableName: 'threads',
        sequelize, // passing the `sequelize` instance is required
    });
}
