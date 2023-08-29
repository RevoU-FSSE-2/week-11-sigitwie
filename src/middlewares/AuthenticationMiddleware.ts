import { Request, Response, NextFunction } from 'express';
import { verifyToken, CustomJwtPayload } from '../utils/AuthService';
import { ExtendedRequest } from '../utils/Extended';

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


// export const roleAuthorizationMiddleware = (allowedRoles: ('user' | 'admin')[]) => {
//     return (req: ExtendedRequest, res: Response, next: NextFunction) => {
//         const authHeader = req.headers['authorization'];

//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).send({ message: 'Token not provided or improperly formatted' });
//         }

//         const token = authHeader.split(' ')[1];

//         try {
//             const decoded = verifyToken(token);

//             req.userId = decoded.userId;
//             req.userName = decoded.userName;
//             req.userRole = decoded.role;

//             if (!allowedRoles.includes(req.userRole)) {
//                 return res.status(403).send({ message: 'Access forbidden: Role not allowed' });
//             }

//             next();
//         } catch (error) {
//             res.status(401).send({ message: 'Invalid token' });
//         }
//     };
// };


// // Hanya admin yang diperbolehkan
// router.get('/admin/dashboard', roleAuthenticationMiddleware(['admin']), adminDashboardHandler);

// // Baik user maupun admin diperbolehkan
// router.get('/users/:userId/profile', roleAuthenticationMiddleware(['user', 'admin']), userProfileHandler);

