import express from "express";
import {
  CreateBlog,
  UpdateBlog,
  DeleteBlog,
  GetAllBlogs,
  GetOneBlog,
} from "../../controllers/BlogControllers.js";

const blogRouter = express.Router();

blogRouter.post("/", CreateBlog);
blogRouter.patch("/:id", UpdateBlog);
blogRouter.delete("/:id", DeleteBlog);
blogRouter.get("/", GetAllBlogs);
blogRouter.get("/:id", GetOneBlog);

export default blogRouter;