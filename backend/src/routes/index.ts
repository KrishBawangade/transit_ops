import { Router } from "express";
import authRouter from "../features/auth/auth.routes";
import userRouter from "../features/users/user.routes";
import driverRouter from "../features/drivers/driver.routes";
import vehicleRouter from "../features/vehicles/vehicle.routes";
import tripRouter from "../features/trips/trip.routes";
import maintenanceRouter from "../features/maintenance/maintenance.routes";
import fuelRouter from "../features/fuel/fuel.routes";
import expenseRouter from "../features/expenses/expense.routes";
import dashboardRouter from "../features/dashboard/dashboard.routes";
import reportRouter from "../features/reports/report.routes";

const globalRouter = Router();

globalRouter.use("/auth", authRouter);
globalRouter.use("/users", userRouter);
globalRouter.use("/drivers", driverRouter);
globalRouter.use("/vehicles", vehicleRouter);
globalRouter.use("/trips", tripRouter);
globalRouter.use("/maintenance", maintenanceRouter);
globalRouter.use("/fuel", fuelRouter);
globalRouter.use("/expenses", expenseRouter);
globalRouter.use("/dashboard", dashboardRouter);
globalRouter.use("/reports", reportRouter);

export default globalRouter;
