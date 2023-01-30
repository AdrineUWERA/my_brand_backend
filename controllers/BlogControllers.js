import Blog from "../models/Blog.js";

const GetAllBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  try{
    res.send(blogs);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong!",
      error: `Error: ${err}`,
    });
  };
}

const GetOneBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (blog) {
      res.status(200).json({ blog });
    } else{
      return res.status(404).json({ error: "There is no blog with that id" });
    }

  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`,
    });
  }
}

const CreateBlog = async (req, res) => {
  try {
    const { title, content, category, cover_image, references } = req.body;
    const blog = await Blog.create({
      title: title,
      content: content,
      category: category,
      cover_image: cover_image,
      references: references,
    });

    const BlogAdded = await blog.save();

    res.status(201).json({
      message: "New Blog added successfully!",
      data: BlogAdded,
    });

    res.send(BlogAdded);

  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`,
    });
  }
};

const UpdateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (blog) { 
      await Blog.findByIdAndUpdate(blogId, req.body);
      const updatedBlog = await Blog.findById(blogId);
      res.send(updatedBlog);
    } else{
      return res.status(404).json({ error: "Blog doesn't exist" });
    }

  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`,
    });
  }
}

const DeleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    //checks if the blog exists
    if (blog) {
      //deletes the blog
      const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
      res.send(deletedBlog); 
    } 
    else{
      res.status(204).json({ });
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`
    });
  }
}

export {
    CreateBlog, UpdateBlog, DeleteBlog, GetAllBlogs, GetOneBlog
}