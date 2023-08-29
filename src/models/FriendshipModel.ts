import { DataTypes, Model, Sequelize } from 'sequelize';
import { User } from './UserModel';

export interface FriendshipAttributes {
    id?: number;
    userId1: number;
    userId2: number;
    friendshipDate?: Date;
    status: 'pending' | 'friends' | 'rejected' | 'blocked';
}

export class Friendship extends Model<FriendshipAttributes> implements FriendshipAttributes {
    public id?: number;
    public userId1!: number;
    public userId2!: number;
    public friendshipDate!: Date;
    public status!: 'pending' | 'friends' | 'rejected' | 'blocked';
}

export const FriendshipFactory = (sequelize: Sequelize) => {
    Friendship.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId1: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        userId2: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        friendshipDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },        
        status: {
            type: DataTypes.ENUM('pending', 'friends', 'rejected', 'blocked'),
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'friendships',
        timestamps: true,
    });

    // Definisikan relasi dengan model User
    Friendship.belongsTo(User, { foreignKey: 'userId1', as: 'user1' });
    Friendship.belongsTo(User, { foreignKey: 'userId2', as: 'user2' });

    return Friendship;
};
