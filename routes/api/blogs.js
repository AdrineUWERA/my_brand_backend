import express from "express";
import {
  CreateBlog,
  UpdateBlog,
  DeleteBlog,
  GetAllBlogs,
  GetOneBlog,
} from "../../controllers/BlogControllers.js";
import imageUpload from "../../middlewares/image.middlewear.js";

const blogRouter = express.Router();

blogRouter.post("/", imageUpload, CreateBlog);
blogRouter.patch("/:id", imageUpload, UpdateBlog);
blogRouter.delete("/:id", DeleteBlog);
blogRouter.get("/", GetAllBlogs);
blogRouter.get("/:id", GetOneBlog);

export default blogRouter;