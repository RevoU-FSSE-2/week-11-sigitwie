import { Router } from "express";
import {
  createPost,
  getPostById,
  getPostsByUserId,
  updatePost,
  deletePost,
  getAllPosts,
} from "../controllers/PostControllers";
import { verifyUserAuthorization } from '../middlewares/AuthorizationMiddleware';
import PostDAO from '../dao/PostDao';
import sequelize from "../utils/db";

const postRouter = Router();
const postDAO = new PostDAO(sequelize);

postRouter.post("/create", verifyUserAuthorization({ actionIdentityKey: 'userId' }), createPost);
postRouter.get("/all", verifyUserAuthorization({}), getAllPosts);
postRouter.get("/:id", getPostById);
postRouter.get("/user/:userId", getPostsByUserId);

// For updating a post, both the action identity (from the post's userId) and resource ownership checks are applied
postRouter.put("/update/:id", verifyUserAuthorization({ actionIdentityKey: 'userId', resourceDAO: postDAO, resourceIdParam: 'id' }), updatePost);

// For deleting a post, only the resource ownership check is applied
postRouter.delete("/delete/:id", verifyUserAuthorization({ resourceDAO: postDAO, resourceIdParam: 'id' }), deletePost);

export default postRouter;
