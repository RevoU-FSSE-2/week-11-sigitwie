import { Router } from "express";
import { register, login, getUserById, getAllUsers, updateUser, deleteUser } from '../controllers/UserController';
import { authenticationMiddleware } from '../middlewares/AuthenticationMiddleware';
import { roleAuthorizationMiddleware } from '../middlewares/AuthorizationMiddleware';


const userRouter = Router();

// Public routes (no authentication required)
userRouter.post('/register', register);
userRouter.post('/login', login);

// Protected routes (authentication required)
userRouter.get('/account/:id', authenticationMiddleware, getUserById);
userRouter.get('/accounts', authenticationMiddleware, roleAuthorizationMiddleware (['admin']), getAllUsers);
userRouter.put('/account/:id', authenticationMiddleware,  updateUser);
userRouter.delete('/account/:id', authenticationMiddleware, deleteUser);

export default userRouter;