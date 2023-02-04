import blogRouter from './api/blogs.js';
import userRouter from './api/users.js';
import queryRouter from './api/query.js';
import commentRouter from './api/comments.js';

import express from "express";

const router = express.Router();

router.use("/blogs", blogRouter);
router.use("/users", userRouter);
router.use("/queries", queryRouter);
router.use("/blogs/:id/comments", commentRouter);


export default router;