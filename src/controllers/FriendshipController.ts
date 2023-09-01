import { Request, Response, NextFunction } from "express";
import FriendshipDAO from "../dao/FriendshipDao";
import { ExtendedRequest } from "../utils/types";
import {
  ValidationError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
} from "sequelize";
import UserDAO from "../dao/UserDao";
import sequelize from "../utils/db";
import { FriendshipStatus } from "../dao/FriendshipDao";

const userDaoInstance = new UserDAO(sequelize);

export async function createFriendRequest(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { requesterId, requesteeId } = req.body;

    // Check if both requester and requestee exist in the database
    const requesterExists: boolean = await userDaoInstance.userExists(
      requesterId
    );
    const requesteeExists: boolean = await userDaoInstance.userExists(
      requesteeId
    );

    if (!requesterExists || !requesteeExists) {
      return res.status(400).json({
        message:
          "One or both of the provided user IDs do not exist in the database.",
      });
    }

    // Check if a friend request or friendship already exists between the two users
    const exists = await FriendshipDAO.friendshipExistsBetween(
      requesterId,
      requesteeId
    );
    if (exists) {
      return res.status(400).json({
        message:
          "A friendship or friend request already exists between the users.",
      });
    }

    const friendship = await FriendshipDAO.createFriendRequest(req.body);
    res.status(201).json(friendship);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      res
        .status(400)
        .json({ message: "Validation Error", details: error.errors });
    } else if (error instanceof ForeignKeyConstraintError) {
      res.status(400).json({
        message: "Foreign Key Constraint Error",
        details: error.message,
      });
    } else if (error instanceof UniqueConstraintError) {
      res
        .status(400)
        .json({ message: "Duplicate Friend Request", details: error.message });
    } else if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", details: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export async function updateFriendshipStatus(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses: Array<
      "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED"
    > = ["PENDING", "ACCEPTED", "DECLINED", "BLOCKED"];
    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({
          message:
            "Invalid status value. Allowed values are: 'PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED'.",
        });
    }

    const updatedRowsCount = await FriendshipDAO.updateFriendshipStatus(
      Number(id),
      status
    );

    if (updatedRowsCount[0] > 0) {
      res
        .status(200)
        .json({ message: "Friendship status updated successfully." });
    } else {
      res.status(500).json({ message: "Failed to update friendship status." });
    }
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      res
        .status(400)
        .json({ message: "Validation Error", details: error.errors });
    } else if (error instanceof ForeignKeyConstraintError) {
      res.status(400).json({
        message: "Foreign Key Constraint Error",
        details: error.message,
      });
    } else if (error instanceof UniqueConstraintError) {
      res
        .status(400)
        .json({ message: "Unique Constraint Error", details: error.message });
    } else if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", details: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export async function getFriendshipById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const friendship = await FriendshipDAO.getById(Number(id));

    if (friendship) {
      res.status(200).json(friendship);
    } else {
      res.status(404).json({ message: "Friendship not found." });
    }
  } catch (error) {
    next(error);
  }
}

export async function deleteFriendship(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    await FriendshipDAO.deleteFriendship(Number(id));
    res.status(200).json({ message: "Friendship deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export async function getFriendshipsByStatus(
  req: Request & { userId?: number; userRole?: string },
  res: Response,
  next: NextFunction
) {
  try {
    const { status } = req.query;

    if (
      !status ||
      !["PENDING", "ACCEPTED", "DECLINED", "BLOCKED"].includes(
        status.toString().toUpperCase()
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid status value. Must be one of: 'PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED'.",
      });
    }

    let friendships;

    if (req.userRole === "admin") {
      friendships = await FriendshipDAO.getUserFriendshipsByStatus(
        req.userId!,
        status as FriendshipStatus
      );
    } else if (req.userId) {
      friendships = await FriendshipDAO.getUserFriendshipsByStatus(
        req.userId,
        status as FriendshipStatus
      );
    } else {
      return res.status(403).json({
        message: "You do not have permission to view these friendships.",
      });
    }

    res.status(200).json(friendships);
  } catch (error) {
    next(error);
  }
}
