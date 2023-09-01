import { Request } from 'express';
import jwt from 'jsonwebtoken';


export interface ExtendedRequest extends Request {
    userId?: number;
    userName?: string;
    userRole?: 'user' | 'admin';
    user?: UserPayload;
}

export interface UserTokenData extends jwt.JwtPayload {
    userId: number;
    userName: string;
    role: 'user' | 'admin';
}