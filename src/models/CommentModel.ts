import { DataTypes, Model, Sequelize } from 'sequelize';
import { User } from './UserModel';
import { Post } from './PostModel';

export interface CommentAttributes {
    id?: number;
    userId: number;
    postId: number;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Comment extends Model<CommentAttributes> implements CommentAttributes {
    public id?: number;
    public userId!: number;
    public postId!: number;
    public content!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const CommentFactory = (sequelize: Sequelize) => {
    Comment.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        postId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id'
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: 'comments',
        timestamps: true,
    });

    // Definisikan relasi dengan model lain
    Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

    return Comment;
};
