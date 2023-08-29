import { Sequelize, Op } from 'sequelize';
import { Post, PostAttributes } from '../models/PostModel';

class PostDAO {
    private sequelize: Sequelize;

    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize;
    }

    async create(postAttributes: PostAttributes): Promise<Post> {
        return await Post.create(postAttributes);
    }

    async getById(id: number): Promise<Post | null> {
        return await Post.findByPk(id);
    }

    async getByUserId(userId: number): Promise<Post[]> {
        return await Post.findAll({ where: { userId } });
    }

    async updateById(id: number, updates: Partial<PostAttributes>): Promise<number> {
        const [updatedRowsCount] = await Post.update(updates, { where: { id } });
        return updatedRowsCount;
    }

    async deleteById(id: number): Promise<void> {
        await Post.destroy({ where: { id } });
    }

    async getAllPosts(): Promise<Post[]> {
        return await Post.findAll();
    }
}

export default PostDAO;
