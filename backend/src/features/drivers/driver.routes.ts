import { Router } from "express";
import { driverController } from "./driver.controller";
import { validateCreateDriver, validateUpdateDriver } from "./driver.validation";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { authorize } from "../../shared/middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get("/", driverController.listDrivers);
router.get("/:id", driverController.getDriverById);
router.get("/user/:userId", driverController.getDriverByUserId);
router.post("/", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), validateCreateDriver, driverController.createDriver);
router.put("/:id", authorize("FLEET_MANAGER", "SAFETY_OFFICER", "DRIVER"), validateUpdateDriver, driverController.updateDriver);
router.delete("/:id", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), driverController.deleteDriver);

export default router;
