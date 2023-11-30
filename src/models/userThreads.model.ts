// models/userThreads.model.ts

import { DataTypes, Model, Sequelize } from 'sequelize';

export class UserThreads extends Model {
  public UserId!: number;
  public ThreadId!: number;
}

export function initUserThreadsModel(sequelize: Sequelize): void {
  UserThreads.init({
    UserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    ThreadId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      references: { model: 'threads', key: 'id' }
    }
  }, {
    sequelize,
    tableName: 'user_threads',
    timestamps: false,
    underscored: false
  });
}
