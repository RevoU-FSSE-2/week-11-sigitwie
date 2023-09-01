import { DataTypes, Model, Sequelize } from 'sequelize';
import { User } from './UserModel';

export interface FriendshipAttributes {
    id?: number;
    requesterId: number;
    requesteeId: number;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';
    createdAt?: Date;
    updatedAt?: Date;
}

export class Friendship extends Model<FriendshipAttributes> implements FriendshipAttributes {
    public id?: number;
    public requesterId!: number;
    public requesteeId!: number;
    public status!: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const FriendshipFactory = (sequelize: Sequelize) => {
    Friendship.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        requesterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        requesteeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED'),
            allowNull: false,
            defaultValue: 'PENDING',
        }
    }, {
        sequelize,
        tableName: 'friendships',
        timestamps: true,
    });

    // Relationships:

    // Relationship for requesterId
    Friendship.belongsTo(User, { as: 'Requester', foreignKey: 'requesterId' });
    User.hasMany(Friendship, { as: 'SentRequests', foreignKey: 'requesterId' });

    // Relationship for requesteeId
    Friendship.belongsTo(User, { as: 'Requestee', foreignKey: 'requesteeId' });
    User.hasMany(Friendship, { as: 'ReceivedRequests', foreignKey: 'requesteeId' });

    return Friendship;
};