import { DataTypes, Model, Sequelize } from 'sequelize';

export interface UserAttributes {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
    public id?: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public role!: 'user' | 'admin';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const UserFactory = (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user'
        }
    }, {
        sequelize,
        tableName: 'users',
        timestamps: true,
    });

    return User;
};
