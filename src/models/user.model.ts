import {DataTypes, Model, Sequelize} from 'sequelize';

export class User extends Model {
    public id!: number;
    public objectId!: string;
    public username!: string;
}

export function initUserModel(sequelize: Sequelize): void {
    User.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        objectId: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        username: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        // ... other fields ...
    }, {
        tableName: 'users',
        sequelize, // passing the `sequelize` instance is required
    });
}
