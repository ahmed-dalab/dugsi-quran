import { Router } from "express";
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent,
} from "./student.controller";

const studentRouter = Router();

studentRouter.post("/", createStudent);
studentRouter.get("/", getStudents);
studentRouter.get("/:id", getStudent);
studentRouter.put("/:id", updateStudent);
studentRouter.delete("/:id", deleteStudent);

export default studentRouter;
