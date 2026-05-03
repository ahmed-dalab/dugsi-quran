import { Router } from "express";
import { createFee, deleteFee, getFee, getFees, updateFee } from "./fee.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createFeeSchema, feeParamsSchema, updateFeeSchema } from "./fee.validations";

const feeRouter = Router();

feeRouter.post("/", validateRequest(createFeeSchema), createFee);
feeRouter.get("/", getFees);
feeRouter.get("/:id", validateRequest(feeParamsSchema), getFee);
feeRouter.put("/:id", validateRequest(updateFeeSchema), updateFee);
feeRouter.delete("/:id", validateRequest(feeParamsSchema), deleteFee);

export default feeRouter;
