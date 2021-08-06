import { ResponseDto } from "../dtos/response.dto";
import { ResponseStatusEnum } from "../enums/response-status.enum";
import { GeneralMessageCodeEnum } from "../enums/general-message-code.enum";
import { Logger } from "./logger.helper";
import { Response } from "express";

type MongoError = Error & { code: number; codeName: string };

export class ErrorsHelper {
  static controllerErrorHandler(error: any, res: Response) {
    Logger.error(`[ErrorsHelper]: Error in response ${error.toString()}`);

    if (error.code && error.statusCode) {
      res.statusCode = error.statusCode;

      return res.json(
        new ResponseDto<any>(undefined, ResponseStatusEnum.Error, error)
      );
    }

    if (error.code && error.msg) {
      switch (error.code) {
        case GeneralMessageCodeEnum.BadData:
          res.statusCode = 400;
          break;
        case GeneralMessageCodeEnum.Forbidden:
          res.statusCode = 403;
          break;
        case GeneralMessageCodeEnum.NotFound:
          res.statusCode = 404;
          break;
        case GeneralMessageCodeEnum.MethodNotAllowed:
          res.statusCode = 405;
          break;
        default:
          res.statusCode = 500;
          break;
      }

      error.statusCode = res.statusCode;

      return res.json(
        new ResponseDto<any>(undefined, ResponseStatusEnum.Error, error)
      );
    } else {
      res.statusCode = 422; // Bad implementation
      return res.json(
        new ResponseDto<any>(undefined, ResponseStatusEnum.Error, error)
      );
    }
  }
}
