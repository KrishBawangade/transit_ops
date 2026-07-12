import { Router } from "express";
import { reportController } from "./report.controller";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { authorize } from "../../shared/middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get("/fleet", authorize("FLEET_MANAGER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"), reportController.getFleetReport);

export default router;
