import { Express } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
// import config from "./config";
// import mongoose from "mongoose";
import apiRouter from "./api";
import cors from "cors";
// import { Logger } from "./helpers/logger.helper";

export default function (app: Express) {
  app.use(cors());

  app.use(bodyParser.urlencoded({ extended: false, limit: "1gb" }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(morgan("dev"));
  app.use(passport.initialize());

  app.use(
    session({
      secret: process.env.JWT_SECRET_KEY || "",
      saveUninitialized: true,
      resave: false,
      // store: new MongoStore({
      //   mongooseConnection: mongoose.connection,
      // }),
    })
  );

  app.use("/api/v1", apiRouter);

  app.use("*", (req, res) => {
    res.status(404).json({
      message: "Resource not available",
    });
  });

  app.use((err: any, req: any, res: any, next: any) => {
    console.log(err);
    if (res.headersSent) {
      return next(err);
    }
    // Logger.error(err);
    res.status(500).json({
      error: true,
      message: "Unexpected Error Occurred. Please contact our support team.",
    });
  });
}
