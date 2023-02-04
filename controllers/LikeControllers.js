import Like from "../models/Like.js";
import LikeService from "../services/like.service.js";

const GetAllLikes = async (req, res) => {
  try {
    const blogId = req.baseUrl.split("/")[2];
    const likes = await Like.find({ blogId: blogId });
    res.status(200).json({
      message: "successful",
      data: likes,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong!",
      error: `Error: ${err}`,
    });
  }
};

const LikeAndUnlike = async (req, res) => {
  try {
    const userID = "63da6a145f4693fa1c7e33c4";
    const blogId = req.baseUrl.split("/")[2];
    const blogliked = await LikeService(blogId, userID);

    res.status(201).json({
      message: "blog liked!",
      data: blogliked,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: `Error: ${err}`,
    });
  }
};

// const Deletelike = async (req, res) => {
//   try {
//     const like = await Like.findById(req.params.id);
//     //checks if the like exists
//     if (like) {
//       //deletes the like
//       const deletedlike = await Like.findByIdAndDelete(req.params.id);
//       res.send(deletedlike);
//     }
//     else{
//       res.status(204).json({ });
//     }
//   } catch (err) {
//     res.status(500).json({
//       message: "Something went wrong",
//       error: `Error: ${err}`
//     });
//   }
// }

export { LikeAndUnlike, GetAllLikes };
