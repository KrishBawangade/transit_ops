import { Router } from "express";
import { userController } from "./user.controller";
import { validateCreateUser, validateUpdateUser } from "./user.validation";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { authorize } from "../../shared/middleware/role.middleware";

const router = Router();

// Protect all user routes
router.use(authenticate);

router.get("/", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), userController.listUsers);
router.get("/:id", userController.getUserById);
router.post("/", authorize("FLEET_MANAGER"), validateCreateUser, userController.createUser);
router.put("/:id", authorize("FLEET_MANAGER"), validateUpdateUser, userController.updateUser);
router.delete("/:id", authorize("FLEET_MANAGER"), userController.deleteUser);

export default router;
