import { Router } from "express";
import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  getTeachers,
  updateTeacher,
} from "./teacher.controller";

const teacherRouter = Router();

teacherRouter.post("/", createTeacher);
teacherRouter.get("/", getTeachers);
teacherRouter.get("/:id", getTeacher);
teacherRouter.put("/:id", updateTeacher);
teacherRouter.delete("/:id", deleteTeacher);

export default teacherRouter;
