import express from "express";
import {
  CreateBlog,
  UpdateBlog,
  DeleteBlog,
  GetAllBlogs,
  GetOneBlog,
} from "../../controllers/BlogControllers.js"; 
import upload from "../../middlewares/multer.middlewear.js"
import imageUpload from "../../middlewares/image.middlewear.js"

const blogRouter = express.Router();

blogRouter.post("/", upload.single('coverImage'), CreateBlog);
blogRouter.patch("/:id", upload.single('coverImage'), UpdateBlog);
blogRouter.delete("/:id", DeleteBlog);
blogRouter.get("/", GetAllBlogs);
blogRouter.get("/:id", GetOneBlog);

export default blogRouter;