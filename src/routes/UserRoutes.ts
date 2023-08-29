import express from 'express';
import { register, login, getUserById, getAllUsers, updateUser, deleteUser } from '../controllers/UserController';
import { authenticationMiddleware } from '../middlewares/AuthenticationMiddleware';
import { roleAuthorizationMiddleware } from '../middlewares/AuthorizationMiddleware';


const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/account/:id', authenticationMiddleware, getUserById);
router.get('/accounts', authenticationMiddleware, roleAuthorizationMiddleware (['admin']), getAllUsers);
router.put('/account/:id', authenticationMiddleware,  updateUser);
router.delete('/account/:id', authenticationMiddleware, deleteUser);

export default router;
