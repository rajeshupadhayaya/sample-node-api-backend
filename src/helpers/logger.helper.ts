import * as winston from "winston";
// import { SentryClient } from "../services/sentry-client";

// Gives an error when imported with import statement
const SentryTransporter = require("winston-sentry-log");

export class LoggerHelper {
  public static newInstance(): winston.Logger {
    console.log(`Environment is `, process.env.ENV_NAME);

    const isLocal =
      ["local", "development"].indexOf(process.env.ENV_NAME || "") >= 0;

    const transporters: any[] = [];

    const combinedFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.align(),
      winston.format.prettyPrint(),
      winston.format.json(),
      winston.format.timestamp(),
      winston.format.printf((info) => {
        const { timestamp, level, message, ...args } = info;

        const ts = timestamp.slice(0, 19).replace("T", " ");

        return `${ts} [${level}]: ${message} ${
          Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
        }`;
      })
    );

    const consoleTransport = new winston.transports.Console({
      format: combinedFormat,
    });
    transporters.push(consoleTransport);

    // if (!isLocal) {
    //   const sentryTransporter = new SentryTransporter({
    //     sentryClient: SentryClient.getInstance(),
    //     isClientInitialized: true,
    //   });

    //   transporters.push(sentryTransporter);
    // }

    return winston.createLogger({
      transports: transporters,
    });
  }
}

export const Logger = LoggerHelper.newInstance();
