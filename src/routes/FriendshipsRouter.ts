import { Router } from "express";
import {
    createFriendRequest,
    updateFriendshipStatus,
    getFriendshipById,
    deleteFriendship,
    getFriendshipsByStatus
} from '../controllers/FriendshipController';
import { verifyUserAuthorization } from '../middlewares/AuthorizationMiddleware';
import FriendshipDAO from "../dao/FriendshipDao";

const friendshipsRoutes = Router();


friendshipsRoutes.get('/status', getFriendshipsByStatus);

// For creating a friend request, just verifying the requesterId with logged in userId
friendshipsRoutes.post('/add', verifyUserAuthorization({ actionIdentityKey: 'requesterId' }), createFriendRequest);

// For updating a friendship status, verifying the requester or requestee's ownership
friendshipsRoutes.put('/update/:id/', verifyUserAuthorization({ actionIdentityKey: 'requesteeId', resourceDAO: FriendshipDAO, resourceIdParam: 'id' }), updateFriendshipStatus);

// For getting details of a friendship, verifying the requester or requestee's ownership
friendshipsRoutes.get('/:id', verifyUserAuthorization({ resourceDAO: FriendshipDAO, resourceIdParam: 'id' }), getFriendshipById);

// For deleting a friendship, verifying the requester or requestee's ownership
friendshipsRoutes.delete('/delete/:id', verifyUserAuthorization({ resourceDAO: FriendshipDAO, resourceIdParam: 'id' }), deleteFriendship);

export default friendshipsRoutes;
