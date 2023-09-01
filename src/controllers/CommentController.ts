import { Request, Response, NextFunction } from 'express';
import CommentDAO from '../dao/CommentDao'
import sequelize from "../utils/db";
import { ValidationError, ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';


const commentDAO = new CommentDAO(sequelize);

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newComment = await commentDAO.create(req.body);
        res.status(201).json(newComment);
    } catch (error: unknown) {
            if (error instanceof ValidationError) {
                res.status(400).json({ message: 'Validation Error', details: error.errors });
            } else if (error instanceof ForeignKeyConstraintError) {
                res.status(400).json({ message: 'Foreign Key Constraint Error', details: error.message });
            } else if (error instanceof UniqueConstraintError) {
                res.status(400).json({ message: 'Unique Constraint Error', details: error.message });
            } else if (error instanceof Error) {
                res.status(500).json({ message: 'Internal Server Error', details: error.message });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
        
};

export const getCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment = await commentDAO.getById(parseInt(req.params.id, 10));
        if (comment) {
            res.json(comment);
        } else {
            res.status(404).send('Comment not found');
        }
    } catch (error) {
        next(error);
    }
};

export const getCommentsByPostId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comments = await commentDAO.getCommentsByPostId(parseInt(req.params.postId, 10));
        res.json(comments);
    } catch (error) {
        next(error);
    }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedRowsCount = await commentDAO.updateById(parseInt(req.params.id, 10), req.body);
        if (updatedRowsCount > 0) {
            res.status(200).json({ message: 'Comment updated successfully' });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        next(error);
    }
};


export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await commentDAO.deleteById(parseInt(req.params.id, 10));
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        next(error);
    }
};
