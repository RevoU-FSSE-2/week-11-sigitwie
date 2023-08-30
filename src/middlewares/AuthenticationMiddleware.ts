import { Request, Response, NextFunction } from 'express';
import { verifyToken, CustomJwtPayload } from '../utils/AuthService';
import { ExtendedRequest } from '../utils/types';

export const authenticationMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Token not provided or improperly formatted' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);

        req.userId = decoded.userId;
        req.userName = decoded.userName;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        res.status(401).send({ message: 'Invalid token' });
    }
};

