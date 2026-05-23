import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
import userRouter from "../modules/users/user.route";
import classRouter from "../modules/classes/class.route";
import studentRouter from "../modules/students/student.route";
import teacherRouter from "../modules/teachers/teacher.route";
import assignmentRouter from "../modules/assignments/assignment.route";
import dashboardRouter from "../modules/dashboard/dashboard.route";
import attendanceRouter from "../modules/attendance/attendance.route";
import feeRouter from "../modules/fees/fee.route";
import settingsRouter from "../modules/settings/settings.route";
import reportsRouter from "../modules/reports/reports.route";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", authenticate, authorize("admin"), userRouter);
v1Router.use("/classes", authenticate, authorize("admin"), classRouter);
v1Router.use("/students", authenticate, authorize("admin"), studentRouter);
v1Router.use("/teachers", authenticate, authorize("admin"), teacherRouter);
v1Router.use("/assignments", authenticate, authorize("admin"), assignmentRouter);
v1Router.use("/dashboard", authenticate, authorize("admin"), dashboardRouter);
v1Router.use("/attendance", authenticate, authorize("admin"), attendanceRouter);
v1Router.use("/fees", authenticate, authorize("admin"), feeRouter);
v1Router.use("/settings", authenticate, authorize("admin"), settingsRouter);
v1Router.use("/reports", authenticate, authorize("admin"), reportsRouter);

export default v1Router;
