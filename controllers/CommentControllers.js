import Comment from "../models/Comment.js";

const GetAllComments = async (req, res) => {
  const comments = await Comment.find({});
  try{
    res.send(comments);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong!",
      error: `Error: ${err}`,
    });
  };
}

const GetOneComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    if (comment) {
      res.status(200).json({ comment });
    } else{
      return res.status(404).json({ error: "There is no comment with that id" });
    }

  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`,
    });
  }
}

const CreateComment = async (req, res) => {
  try {
    // const userID = "ADU1"
    // const blogId = "uwuwi"
    const { comment } = req.body;
    const newcomment = await Comment.create({
        comment: comment,
    });

    const commentAdded = await newcomment.save();

    res.status(201).json({
      message: "New comment added successfully!",
      data: commentAdded,
    });

    res.send(commentAdded);

  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`,
    });
  }
};

const UpdateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);

    if (comment) { 
      await Comment.findByIdAndUpdate(commentId, req.body);
      const updatedcomment = await Comment.findById(commentId);
      res.send(updatedcomment);
    } else{
      return res.status(404).json({ error: "comment doesn't exist" });
    }

  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`,
    });
  }
}

const DeleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    //checks if the comment exists
    if (comment) {
      //deletes the comment
      const deletedcomment = await Comment.findByIdAndDelete(req.params.id);
      res.send(deletedcomment); 
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
    CreateComment, UpdateComment, DeleteComment, GetAllComments, GetOneComment
}