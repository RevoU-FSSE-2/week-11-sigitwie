import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
}

const SECRET_KEY = process.env.JWT_SECRET;

export interface CustomJwtPayload extends JwtPayload {
    userId: number;
    userName: string;
    role: 'user' | 'admin';
}

export const generateToken = (userId: number, userName: string, role: 'user' | 'admin') => {
    return jwt.sign({ userId, userName, role }, SECRET_KEY, {
        expiresIn: '1h'
    });
};

export const verifyToken = (token: string): CustomJwtPayload => {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (typeof decoded === 'string' || !decoded.userId) {
        throw new Error("Invalid JWT token");
    }
    return decoded as CustomJwtPayload;
};
