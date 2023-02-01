import express from "express"; 
import {
  CreateComment,
  UpdateComment,
  DeleteComment,
  GetAllComments,
  GetOneComment,
} from "../controllers/CommentControllers.js";
import {
  SignUp,
  getAllusers,
  UserLogin,
  deleteUser,
  updateUser
} from "../controllers/UserControllers.js";

const router = express.Router();

router.post("/users/register", SignUp);
router.get("/users", getAllusers);
router.post("/users/login", UserLogin);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id", updateUser); 

router.post("/comments", CreateComment);
router.patch("/comments/:id", UpdateComment);
router.delete("/comments/:id", DeleteComment);
router.get("/comments", GetAllComments);
router.get("/comments/:id", GetOneComment);

export default router;
