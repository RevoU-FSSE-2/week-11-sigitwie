import { Request, Response, NextFunction } from "express";
import { ExtendedRequest } from "../utils/types";

import PostDAO from "../dao/PostDao";
import sequelize from "../utils/db";

const postDAO = new PostDAO(sequelize);

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await postDAO.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    if (err instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to create post", error: err.message });
    } else {
      res.status(500).json({ message: "Failed to create post" });
    }
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await postDAO.getById(Number(req.params.id));
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    if (err instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to fetch post", error: err.message });
    } else {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  }
};

export const getPostsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = await postDAO.getByUserId(Number(req.params.userId));
    res.json(posts);
  } catch (err) {
    if (err instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to fetch post", error: err.message });
    } else {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedCount = await postDAO.updateById(
      Number(req.params.id),
      req.body
    );
    if (updatedCount > 0) {
      res.status(200).json({ message: "Post updated successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    if (err instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to update post", error: err.message });
    } else {
      res.status(500).json({ message: "Failed to update post" });
    }
  }
};

export const deletePost = async (req: ExtendedRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.id);

    if (typeof req.userId !== "number") {
      return res.status(400).send({ message: "Invalid user ID" });
    }

    await postDAO.deleteById(postId, req.userId, req.userRole === "admin");
    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
};

const handleError = (error: any, res: Response) => {
  console.error(error.message);
  return res
    .status(500)
    .json({ message: "Internal Server Error", error: error.message });
};

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = await postDAO.getAllPosts();
    res.json(posts);
  } catch (err) {
    if (err instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to fetch post", error: err.message });
    } else {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  }
};
