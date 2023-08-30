import { Request, Response, NextFunction } from 'express';
import FriendshipDAO from '../dao/FriendshipDao';

export async function createFriendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const friendship = await FriendshipDAO.createFriendRequest(req.body);
      res.status(201).json(friendship);
    } catch (error) {
      next(error);
    }
}

export async function updateFriendshipStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedRowsCount = await FriendshipDAO.updateFriendshipStatus(Number(id), status);

      if (updatedRowsCount[0] > 0) {
        res.status(200).json({ message: 'Friendship status updated successfully.' });
      } else {
        res.status(404).json({ message: 'Friendship not found.' });
      }
    } catch (error) {
      next(error);
    }
}

export async function getFriendshipById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const friendship = await FriendshipDAO.getFriendshipById(Number(id));

      if (friendship) {
        res.status(200).json(friendship);
      } else {
        res.status(404).json({ message: 'Friendship not found.' });
      }
    } catch (error) {
      next(error);
    }
}

export async function deleteFriendship(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await FriendshipDAO.deleteFriendship(Number(id));
      res.status(200).json({ message: 'Friendship deleted successfully.' });
    } catch (error) {
      next(error);
    }
}

export async function getFriendshipsByStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;

      const friendships = await FriendshipDAO.getFriendshipsByStatus(status as any);
      res.status(200).json(friendships);
    } catch (error) {
      next(error);
    }
}
