import Like from "../models/Like.js";

const GetAllLikes = async (req, res) => {
  const likes = await Like.find({});
  try{
    res.send(likes);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong!",
      error: `Error: ${err}`,
    });
  };
}


const Createlike = async (req, res) => {
  try {
    // const userID = "ADU1"
    // const blogId = "uwuwi"
    const { like } = req.body;
    const newlike = await Like.create({
        blogId: blogId,
    });

    const likeAdded = await newlike.save();

    res.status(201).json({
      message: "New like added successfully!",
      data: likeAdded,
    });

    res.send(likeAdded);

  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`,
    });
  }
};

const Deletelike = async (req, res) => {
  try {
    const like = await Like.findById(req.params.id);
    //checks if the like exists
    if (like) {
      //deletes the like
      const deletedlike = await Like.findByIdAndDelete(req.params.id);
      res.send(deletedlike); 
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
    Createlike, Deletelike, GetAllLikes
}