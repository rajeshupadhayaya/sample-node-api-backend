import { Router } from "express";
import adminRouter from "./admin";

const apiRouter = Router();

apiRouter.use("/admin", adminRouter);

export default apiRouter;
