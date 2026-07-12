import { Router } from "express";
import { fuelController } from "./fuel.controller";
import { validateCreateFuelLog, validateUpdateFuelLog } from "./fuel.validation";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { authorize } from "../../shared/middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get("/", fuelController.listFuelLogs);
router.get("/:id", fuelController.getFuelLogById);
router.post("/", authorize("FLEET_MANAGER", "DRIVER"), validateCreateFuelLog, fuelController.createFuelLog);
router.put("/:id", authorize("FLEET_MANAGER", "DRIVER"), validateUpdateFuelLog, fuelController.updateFuelLog);
router.delete("/:id", authorize("FLEET_MANAGER"), fuelController.deleteFuelLog);

export default router;
