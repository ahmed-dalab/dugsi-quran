import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  getTeachers,
  updateTeacher,
} from "./teacher.controller";
import {
  createTeacherSchema,
  teacherParamsSchema,
  updateTeacherSchema,
} from "./teacher.validations";

const teacherRouter = Router();

teacherRouter.post("/", validateRequest(createTeacherSchema), createTeacher);
teacherRouter.get("/", getTeachers);
teacherRouter.get("/:id", validateRequest(teacherParamsSchema), getTeacher);
teacherRouter.put("/:id", validateRequest(updateTeacherSchema), updateTeacher);
teacherRouter.delete("/:id", validateRequest(teacherParamsSchema), deleteTeacher);

export default teacherRouter;
