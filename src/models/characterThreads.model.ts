// models/characterThreads.model.ts

import { DataTypes, Model, Sequelize } from 'sequelize';

export class CharacterThreads extends Model {
  public CharacterId!: number;
  public ThreadId!: number;
}

export function initCharacterThreadsModel(sequelize: Sequelize): void {
  CharacterThreads.init({
    CharacterId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: { model: 'characters', key: 'id' }
    },
    ThreadId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: { model: 'threads', key: 'id' }
    }
  }, {
    sequelize,
    tableName: 'character_threads',
    timestamps: false // Assuming no need for createdAt or updatedAt
  });
}

