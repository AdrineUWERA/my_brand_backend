import Blog from "../models/Blog.js";
import BlogService from "../services/blog.service.js";

const GetAllBlogs = async (req, res) => {
  const blogs = await BlogService.findAll();
  try {
    res.send(blogs);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong!",
      error: `Error: ${err}`,
    });
  }
};

const GetOneBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await BlogService.findbyId(blogId);

    if (!blog) {
      return res.status(404).json({ error: "There is no blog with that id" });
    }
    res.status(200).json({ message: "One blog", data: blog });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`,
    });
  }
};

const CreateBlog = async (req, res) => {
  try {
    const { title, content, category, coverImage, references } = req.body;

    const blog = await BlogService.createBlog({
      title: title,
      content: content,
      category: category,
      coverImage: coverImage,
      references: references,
    });

    const BlogAdded = await blog.save();

    res.status(201).json({
      message: "New Blog added successfully!",
      data: BlogAdded,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`,
    });
  }
};

const UpdateBlog = async (req, res) => {
  try {
    const { title, content, category, coverImage, references } = req.body;
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (blog) {
      if (title) blog.title = title;
      if (content) blog.content = content;
      if (category) blog.category = category;
      if (coverImage) blog.coverImage = coverImage;
      if (references) blog.references = references;

      const updatedBlog = await blog.save();

      res.send(updatedBlog);
    } else {
      return res.status(404).json({ error: "Blog doesn't exist" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`,
    });
  }
};

const DeleteBlog = async (req, res) => {
  try {
    const deletedBlog = await BlogService.deleteOne(req.params.id);
    res.send({ message: "Blog deleted", data: deletedBlog });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`,
    });
  }
};

export { CreateBlog, UpdateBlog, DeleteBlog, GetAllBlogs, GetOneBlog };
