import { Router } from "express";
import { tripController } from "./trip.controller";
import { validateCreateTrip, validateUpdateTrip, validateTransitionTripStatus } from "./trip.validation";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { authorize } from "../../shared/middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get("/", tripController.listTrips);
router.get("/:id", tripController.getTripById);
router.post("/", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), validateCreateTrip, tripController.createTrip);
router.put("/:id", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), validateUpdateTrip, tripController.updateTrip);
router.patch("/:id/status", authorize("FLEET_MANAGER", "SAFETY_OFFICER", "DRIVER"), validateTransitionTripStatus, tripController.transitionTripStatus);
router.delete("/:id", authorize("FLEET_MANAGER"), tripController.deleteTrip);

export default router;
