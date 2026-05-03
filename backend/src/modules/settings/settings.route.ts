import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { getSettings, updateSettings } from "./settings.controller";
import { updateSettingsSchema } from "./settings.validations";

const settingsRouter = Router();

settingsRouter.get("/", getSettings);
settingsRouter.put("/", validateRequest(updateSettingsSchema), updateSettings);

export default settingsRouter;
