import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRegister, validateLogin } from "./auth.validation";

const router = Router();

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

export default router;
