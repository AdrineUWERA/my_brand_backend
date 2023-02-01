import {
  GetAllQueries,
  CreateQuery,
} from "../../controllers/QueryController.js";

import express from "express";

const queryRouter = express.Router();

queryRouter.post("/", CreateQuery);
queryRouter.get("/", GetAllQueries);

export default queryRouter;
