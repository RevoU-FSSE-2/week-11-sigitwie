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

    async isOwner(postId: number, userId: number): Promise<boolean> {
        const post = await this.getById(postId);
        return post?.userId === userId;
    }

    async deleteById(id: number, userId: number, isAdmin: boolean = false): Promise<number> {
        if (isAdmin) {
            return await Post.destroy({ where: { id } });
        } else {
            return await Post.destroy({ where: { id, userId } });
        }
    }

    async getAllPosts(): Promise<Post[]> {
        try {
            return await Post.findAll();
        } catch (error: any) {
            throw new Error(`Failed to fetch posts: ${error.message}`);
        }
    }
    
}

export default PostDAO;
