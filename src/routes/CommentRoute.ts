import express from "express";
import {
  createComment,
  getCommentById,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from "../controllers/CommentController";
import { verifyUserAuthorization } from '../middlewares/AuthorizationMiddleware';
import CommentDAO from '../dao/CommentDao';
import sequelize from "../utils/db";

const commentRoutes = express.Router();
const commentDAO = new CommentDAO(sequelize);


commentRoutes.post("/create", verifyUserAuthorization({ actionIdentityKey: 'userId' }), createComment);
commentRoutes.get("/:id", getCommentById);
commentRoutes.get("/post/:postId", getCommentsByPostId);

// For updating a comment, both the action identity (from the comment's userId) and resource ownership checks are applied
commentRoutes.put("/update/:id", verifyUserAuthorization({ resourceDAO: commentDAO, resourceIdParam: 'id' }), updateComment);

// For deleting a comment, only the resource ownership check is applied
commentRoutes.delete("/delete/:id", verifyUserAuthorization({ resourceDAO: commentDAO, resourceIdParam: 'id' }), deleteComment);

export default commentRoutes;
