import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createClass,
  deleteClass,
  getClass,
  getClasses,
  updateClass,
} from "./class.controller";
import {
  classParamsSchema,
  createClassSchema,
  updateClassSchema,
} from "./class.validations";

const classRouter = Router();

classRouter.post("/", validateRequest(createClassSchema), createClass);
classRouter.get("/", getClasses);
classRouter.get("/:id", validateRequest(classParamsSchema), getClass);
classRouter.put("/:id", validateRequest(updateClassSchema), updateClass);
classRouter.delete("/:id", validateRequest(classParamsSchema), deleteClass);

export default classRouter;
