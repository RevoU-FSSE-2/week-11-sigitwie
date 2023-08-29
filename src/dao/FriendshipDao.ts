import { Sequelize, Op } from 'sequelize';
import { Friendship, FriendshipAttributes } from '../models/FriendshipModel';

class FriendshipDAO {
    private sequelize: Sequelize;

    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize;
    }

    async create(friendshipAttributes: FriendshipAttributes): Promise<Friendship> {
        return await Friendship.create(friendshipAttributes);
    }

    async getById(id: number): Promise<Friendship | null> {
        return await Friendship.findByPk(id);
    }

    async getFriendshipsByUserId(userId: number): Promise<Friendship[]> {
        return await Friendship.findAll({ 
            where: { 
                [Op.or]: [{ userId1: userId }, { userId2: userId }] 
            }
        });
    }

    async updateById(id: number, updates: Partial<FriendshipAttributes>): Promise<number> {
        const [updatedRowsCount] = await Friendship.update(updates, { where: { id } });
        return updatedRowsCount;
    }

    async deleteById(id: number): Promise<void> {
        await Friendship.destroy({ where: { id } });
    }

    async checkFriendshipStatus(userId1: number, userId2: number): Promise<Friendship | null> {
        return await Friendship.findOne({
            where: {
                [Op.or]: [
                    { userId1: userId1, userId2: userId2 },
                    { userId1: userId2, userId2: userId1 }
                ]
            }
        });
    }
}

export default FriendshipDAO;
