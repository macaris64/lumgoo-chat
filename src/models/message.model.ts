import { DataTypes, Model, Sequelize } from 'sequelize';

export class Message extends Model {
  public id!: number;
  public content!: string;
  public threadId!: number;
  public senderId!: number;
  // other attributes...
}

export function initMessageModel(sequelize: Sequelize): void {
  Message.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: new DataTypes.TEXT,
      allowNull: false,
    },
    threadId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'threads',
        key: 'id',
      },
    },
    senderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    // other fields...
  }, {
    tableName: 'messages',
    sequelize,
  });
}
