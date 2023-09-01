import { Request, Response, NextFunction } from 'express';
import { ExtendedRequest } from '../utils/types';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/AuthService';
import PostDAO from '../dao/PostDao';
import sequelize from '../utils/db';


const postDAO = new PostDAO(sequelize);

export const roleAuthorizationMiddleware = (allowedRoles: ('user' | 'admin')[]) => {
    return (req: ExtendedRequest, res: Response, next: NextFunction) => {
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

            if (!allowedRoles.includes(req.userRole)) {
                return res.status(403).send({ message: 'Access forbidden: Role not allowed' });
            }

            next();
        } catch (error) {
            res.status(401).send({ message: 'Invalid token' });
        }
    };
};

interface ResourceDAO {
    getById(id: number): Promise<any>;
    isOwner(resourceId: number, userId: number): Promise<boolean>;
}

interface UserAuthorizationOptions {
    actionIdentityKey?: string;
    resourceDAO?: ResourceDAO;
    resourceIdParam?: string;
  }
  
  export const verifyUserAuthorization = ({
    actionIdentityKey,
    resourceDAO,
    resourceIdParam
  }: UserAuthorizationOptions) => {
    return async (req: ExtendedRequest, res: Response, next: NextFunction) => {
      // If action identity is provided, verify it
      if (actionIdentityKey) {
        const loggedInUserId = req.userId;
        const actionUserId = req.body[actionIdentityKey];
        if (loggedInUserId !== actionUserId) {
          return res.status(403).send({ message: `You are not authorized to perform this action as another user.` });
        }
      }
  
      // If resource verification is needed, verify resource ownership or admin
      if (resourceDAO && resourceIdParam) {
        const resourceId = parseInt(req.params[resourceIdParam]);
        const loggedInUserId = req.userId;
  
        // Ensure loggedInUserId is defined and is a number
        if (typeof loggedInUserId === 'undefined' || isNaN(loggedInUserId)) {
          return res.status(401).send({ message: "User not authenticated or invalid userId" });
        }
  
        // Ensure resource exists
        const resource = await resourceDAO.getById(resourceId);
        if (!resource) {
          return res.status(404).send({ message: "Resource not found" });
        }
  
        // Check if user is allowed to access
        const isUserOwner = await resourceDAO.isOwner(resourceId, loggedInUserId);
        if (!isUserOwner && req.userRole !== "admin") {
          return res.status(403).send({ message: "You do not have permission" });
        }
      }
  
      next();
    };
  };
  
  
