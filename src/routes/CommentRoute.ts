import express from "express";
import {
  createComment,
  getCommentById,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from "../controllers/CommentController";
import { verifyOwnershipOrAdmin, verifyUserIdentity } from '../middlewares/AuthorizationMiddleware';
import  CommentDAO  from '../dao/CommentDao';
import sequelize from "../utils/db";

const commentRoutes = express.Router();
const commentDAO = new CommentDAO(sequelize);


commentRoutes.post("/create", verifyUserIdentity, createComment);
commentRoutes.get("/:id", getCommentById);
commentRoutes.get("/post/:postId", getCommentsByPostId);
commentRoutes.put("/update/:id", verifyOwnershipOrAdmin(commentDAO, 'id'), updateComment);
commentRoutes.delete("/delete/:id", verifyOwnershipOrAdmin(commentDAO, 'id'), deleteComment);

export default commentRoutes;
