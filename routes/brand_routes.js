import express from "express";
import { CreateBlog, UpdateBlog, DeleteBlog, GetAllBlogs, GetOneBlog } from "../controllers/BlogControllers.js";
import {CreateComment, UpdateComment, DeleteComment, GetAllComments, GetOneComment} from "../controllers/CommentControllers.js";

const router = express.Router();

router.post("/blogs", CreateBlog);
router.patch("/blogs/:id", UpdateBlog);
router.delete("/blogs/:id", DeleteBlog);
router.get("/blogs", GetAllBlogs);
router.get("/blogs/:id", GetOneBlog);


router.post("/comments", CreateComment);
router.patch("/comments/:id", UpdateComment);
router.delete("/comments/:id", DeleteComment);
router.get("/comments", GetAllComments);
router.get("/comments/:id", GetOneComment);


export default router;