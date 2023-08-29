import { Sequelize } from 'sequelize';
import { Comment, CommentAttributes } from '../models/CommentModel';
import { User } from '../models/UserModel';

class CommentDAO {
    private sequelize: Sequelize;

    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize;
    }

    async create(commentAttributes: CommentAttributes): Promise<Comment> {
        return await Comment.create(commentAttributes);
    }

    async getById(id: number): Promise<Comment | null> {
        return await Comment.findByPk(id);
    }

    async getCommentsByPostId(postId: number): Promise<Comment[]> {
        return await Comment.findAll({
            where: { postId },
            include: [{ model: User, as: 'user' }] //  informasi user yang mengomentari
        });
    }

    async updateById(id: number, updates: Partial<CommentAttributes>): Promise<number> {
        const [updatedRowsCount] = await Comment.update(updates, { where: { id } });
        return updatedRowsCount;
    }

    async deleteById(id: number): Promise<void> {
        await Comment.destroy({ where: { id } });
    }

}

export default CommentDAO;
