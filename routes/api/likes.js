import express from "express";
import {
  LikeAndUnlike,
  GetAllLikes,
} from "../../controllers/LikeControllers.js";

const likeRouter = express.Router();

likeRouter.post("/", LikeAndUnlike);
// commentRouter.patch("/:id", UpdateComment);
// commentRouter.delete("/:id", DeleteComment);
likeRouter.get("/", GetAllLikes);
// commentRouter.get("/:id", GetOneComment);

export default likeRouter;
