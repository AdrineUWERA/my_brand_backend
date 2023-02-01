import blogRouter from './api/blogs.js';
import userRouter from './api/users.js';

import express from "express";

const router = express.Router();

router.use("/blogs", blogRouter);
router.use("/users", userRouter);


export default router;