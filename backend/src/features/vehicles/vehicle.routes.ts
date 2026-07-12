import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { validateCreateVehicle, validateUpdateVehicle } from "./vehicle.validation";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { authorize } from "../../shared/middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get("/", vehicleController.listVehicles);
router.get("/:id", vehicleController.getVehicleById);
router.post("/", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), validateCreateVehicle, vehicleController.createVehicle);
router.put("/:id", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), validateUpdateVehicle, vehicleController.updateVehicle);
router.delete("/:id", authorize("FLEET_MANAGER"), vehicleController.deleteVehicle);

export default router;
