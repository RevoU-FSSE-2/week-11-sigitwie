import { Router } from "express";
import {
    createFriendRequest,
    updateFriendshipStatus,
    getFriendshipById,
    deleteFriendship,
    getFriendshipsByStatus
} from '../controllers/FriendshipController'

const friendshipsRoutes = Router();

friendshipsRoutes.post('/add', createFriendRequest);
friendshipsRoutes.put('/update/:id/', updateFriendshipStatus);
friendshipsRoutes.get('/:id', getFriendshipById);
friendshipsRoutes.delete('/delete/:id', deleteFriendship);
friendshipsRoutes.get('/bystatus', getFriendshipsByStatus);

export default friendshipsRoutes;
