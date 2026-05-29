import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
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
import {
  assignmentParamsSchema,
  classIdParamsSchema,
  createAssignmentSchema,
  teacherIdParamsSchema,
  updateAssignmentSchema,
} from "./assignment.validations";

const assignmentRouter = Router();

assignmentRouter.post("/", validateRequest(createAssignmentSchema), createAssignment);
assignmentRouter.get("/", getAssignments);
assignmentRouter.get(
  "/teacher/:teacherId",
  validateRequest(teacherIdParamsSchema),
  getAssignmentsByTeacher
);
assignmentRouter.get(
  "/teacher/:teacherId/current",
  validateRequest(teacherIdParamsSchema),
  getCurrentAssignmentForTeacher
);
assignmentRouter.get(
  "/class/:classId",
  validateRequest(classIdParamsSchema),
  getAssignmentsByClass
);
assignmentRouter.get("/:id", validateRequest(assignmentParamsSchema), getAssignment);
assignmentRouter.put("/:id", validateRequest(updateAssignmentSchema), updateAssignment);
assignmentRouter.delete("/:id", validateRequest(assignmentParamsSchema), deleteAssignment);

export default assignmentRouter;
