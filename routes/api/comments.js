import express from "express";
import {
    CreateComment,
    UpdateComment,
    DeleteComment,
    GetAllComments,
    GetOneComment,
  } from "../../controllers/CommentControllers.js";

const commentRouter = express.Router();

commentRouter.post("/",  CreateComment);
commentRouter.patch("/:id", UpdateComment);
commentRouter.delete("/:id", DeleteComment);
commentRouter.get("/", GetAllComments);
commentRouter.get("/:id", GetOneComment);

export default commentRouter;