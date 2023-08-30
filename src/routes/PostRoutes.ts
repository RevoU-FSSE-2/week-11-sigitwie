import { Router } from "express";
import {
  createPost,
  getPostById,
  getPostsByUserId,
  updatePost,
  deletePost,
  getAllPosts,
} from "../controllers/PostControllers";
import { roleAuthorizationMiddleware, verifyOwnershipOrAdmin } from '../middlewares/AuthorizationMiddleware';
import PostDAO from '../dao/PostDao';
import sequelize from "../utils/db";

const postRouter = Router();
const postDAO = new PostDAO(sequelize);


postRouter.post("/create", createPost);
postRouter.get("/all", roleAuthorizationMiddleware(['admin']), getAllPosts);
postRouter.get("/:id", getPostById);
postRouter.get("/user/:userId", getPostsByUserId);
postRouter.put("/update/:id", verifyOwnershipOrAdmin(postDAO, 'id'), updatePost);
postRouter.delete("/delete/:id", verifyOwnershipOrAdmin(postDAO, 'id'), deletePost);

export default postRouter;
