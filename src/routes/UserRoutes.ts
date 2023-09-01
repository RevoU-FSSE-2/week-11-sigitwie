import { Router } from "express";
import { register, login, getUserById, getAllUsers, updateUser, deleteUser } from '../controllers/UserController';
import { authenticationMiddleware } from '../middlewares/AuthenticationMiddleware';
import { roleAuthorizationMiddleware, verifyUserAuthorization } from '../middlewares/AuthorizationMiddleware';
import UserDao from '../dao/UserDao';
import sequelize from "../utils/db";

const userRouter = Router();
const userDao = new UserDao(sequelize);

// Public routes (no authentication required)
userRouter.post('/register', register);
userRouter.post('/login', login);

// Protected routes (authentication required)
userRouter.get('/account/:id', authenticationMiddleware, getUserById);
userRouter.get('/accounts', authenticationMiddleware, roleAuthorizationMiddleware (['admin']), getAllUsers);
userRouter.put('/account/:id', authenticationMiddleware, verifyUserAuthorization({ actionIdentityKey: "userId", resourceDAO: userDao, resourceIdParam: "id"}), updateUser);
userRouter.delete('/account/:id', authenticationMiddleware, verifyUserAuthorization({ resourceDAO: userDao, resourceIdParam: 'id' }), deleteUser);


export default userRouter;