import { Router } from "express";
import {
  createClass,
  deleteClass,
  getClass,
  getClasses,
  updateClass,
} from "./class.controller";

const classRouter = Router();

classRouter.post("/", createClass);
classRouter.get("/", getClasses);
classRouter.get("/:id", getClass);
classRouter.put("/:id", updateClass);
classRouter.delete("/:id", deleteClass);

export default classRouter;
