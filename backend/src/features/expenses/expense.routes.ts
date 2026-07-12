import { Router } from "express";
import { expenseController } from "./expense.controller";
import { validateCreateExpense, validateUpdateExpense } from "./expense.validation";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { authorize } from "../../shared/middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get("/", expenseController.listExpenses);
router.get("/:id", expenseController.getExpenseById);
router.post("/", authorize("FLEET_MANAGER", "FINANCIAL_ANALYST"), validateCreateExpense, expenseController.createExpense);
router.put("/:id", authorize("FLEET_MANAGER", "FINANCIAL_ANALYST"), validateUpdateExpense, expenseController.updateExpense);
router.delete("/:id", authorize("FLEET_MANAGER"), expenseController.deleteExpense);

export default router;
