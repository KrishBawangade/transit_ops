import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { authorize } from "../../shared/middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get("/metrics", authorize("FLEET_MANAGER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"), dashboardController.getMetrics);

export default router;
