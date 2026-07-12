import { Router } from "express";
import { maintenanceController } from "./maintenance.controller";
import { validateCreateMaintenanceLog, validateUpdateMaintenanceLog } from "./maintenance.validation";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { authorize } from "../../shared/middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get("/", maintenanceController.listMaintenanceLogs);
router.get("/:id", maintenanceController.getMaintenanceLogById);
router.post("/", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), validateCreateMaintenanceLog, maintenanceController.createMaintenanceLog);
router.put("/:id", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), validateUpdateMaintenanceLog, maintenanceController.updateMaintenanceLog);
router.delete("/:id", authorize("FLEET_MANAGER"), maintenanceController.deleteMaintenanceLog);

export default router;
