import express from "express";
import { AdminValidation } from "./admin.validation";
import { AdminController } from "./admin.controller";

const authRouter = express.Router();

authRouter.post(
  "/login",
  AdminValidation.login.bodyValidator,
  AdminController.loginUser
);
authRouter.post(
  "/create",
  AdminValidation.login.bodyValidator,
  AdminController.createUser
);
authRouter.get("/", AdminController.getList);

export default authRouter;
