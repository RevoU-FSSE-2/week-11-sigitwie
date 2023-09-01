import { DataTypes, Model, Sequelize } from 'sequelize';
import { User } from './UserModel';

export interface PostAttributes {
    id?: number;
    userId: number; 
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Post extends Model<PostAttributes> implements PostAttributes {
    public id?: number;
    public userId!: number;
    public content!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const PostFactory = (sequelize: Sequelize) => {
    Post.init({
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
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: 'posts',
        timestamps: true,
    });

    // Define the association
    Post.belongsTo(User, { foreignKey: 'userId' });

    return Post;
};
