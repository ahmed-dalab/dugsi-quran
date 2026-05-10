import { Router } from "express";
import { getReportsOverview } from "./reports.controller";

const reportsRouter = Router();

reportsRouter.get("/overview", getReportsOverview);

export default reportsRouter;
