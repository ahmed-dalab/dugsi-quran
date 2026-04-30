import { Router } from "express";
import {
  createAssignment,
  deleteAssignment,
  getAssignment,
  getAssignments,
  getAssignmentsByClass,
  getAssignmentsByTeacher,
  getCurrentAssignmentForTeacher,
  updateAssignment,
} from "./assignment.controller";

const assignmentRouter = Router();

// Basic CRUD routes
assignmentRouter.post("/", createAssignment);
assignmentRouter.get("/", getAssignments);
assignmentRouter.get("/:id", getAssignment);
assignmentRouter.put("/:id", updateAssignment);
assignmentRouter.delete("/:id", deleteAssignment);

// Additional routes for specific queries
assignmentRouter.get("/teacher/:teacherId", getAssignmentsByTeacher);
assignmentRouter.get("/teacher/:teacherId/current", getCurrentAssignmentForTeacher);
assignmentRouter.get("/class/:classId", getAssignmentsByClass);

export default assignmentRouter;
