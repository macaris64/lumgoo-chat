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
            allowNull: true,
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

export const isParticipantUser = async (participantId: number): Promise<boolean> => {
  try {
    const user = await User.findByPk(participantId);
    return !!user; // Returns true if user exists, false otherwise
  } catch (error) {
    console.error('Error checking participant type:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
