import {DataTypes, Model, Sequelize} from 'sequelize';

export class Character extends Model {
  public id!: number;
  public name!: string;
  public movie!: string;
}

export function initCharacterModel(sequelize: Sequelize): void {
    Character.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        movie: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    }, {
        tableName: 'characters',
        sequelize, // passing the `sequelize` instance is required
    });
}
