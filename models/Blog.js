import mongoose from "mongoose"; 

const BlogSchema = new mongoose.Schema({
  author: {
    type: String,
    default: "Adrine UWERA",
  },
  datePublished:{
    type: Date,
    value: new Date(),
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  }, 
  
  cover_image :{
    type: String,
    required: true,
  },
  references : {
    type: String,
    required: false
  },
  likes: {
    type: Array,
    default: []
  },
  comments: {
    type: Array,
    default: []
  }

});

const Blog = new mongoose.model("blog", BlogSchema);

export default Blog;
