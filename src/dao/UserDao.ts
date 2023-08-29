import { User, UserAttributes } from '../models/UserModel'; // Path mungkin perlu diubah sesuai lokasi UserModel Anda
import { Op, Sequelize } from 'sequelize';

class UserDAO {
    private sequelize: Sequelize;

    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize;
    }

    async create(userAttributes: UserAttributes): Promise<User> {
        return await User.create(userAttributes);
    }

    async getById(id: number): Promise<User | null> {
        return await User.findByPk(id);
    }

    async getByEmail(email: string): Promise<User | null> {
        return await User.findOne({ where: { email } });
    }

    async getByUsername(username: string): Promise<User | null> {
        return await User.findOne({ where: { username } });
    }
    
    async updateById(id: number, updates: Partial<UserAttributes>): Promise<number> {
        const [updatedRowsCount] = await User.update(updates, { where: { id } });
        return updatedRowsCount;
    }

    async deleteById(id: number): Promise<void> {
        await User.destroy({ where: { id } });
    }

    async getAllUsers(): Promise<User[]> {
        return await User.findAll();
    }


}

export default UserDAO;
