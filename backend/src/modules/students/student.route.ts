import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent,
} from "./student.controller";
import {
  createStudentSchema,
  studentParamsSchema,
  updateStudentSchema,
} from "./student.validations";

const studentRouter = Router();

studentRouter.post("/", validateRequest(createStudentSchema), createStudent);
studentRouter.get("/", getStudents);
studentRouter.get("/:id", validateRequest(studentParamsSchema), getStudent);
studentRouter.put("/:id", validateRequest(updateStudentSchema), updateStudent);
studentRouter.delete("/:id", validateRequest(studentParamsSchema), deleteStudent);

export default studentRouter;
