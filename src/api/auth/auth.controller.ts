import { Request, Response } from "express";
import { Message, ResponseDto } from "../../dtos/response.dto";
import { ResponseStatusEnum } from "../../enums/response-status.enum";
import { GeneralMessageCodeEnum } from "../../enums/general-message-code.enum";
import { ErrorsHelper } from "../../helpers/error.helper";
import { LoginBody, LoginResponseDto } from "../../dtos/auth.dto";
import { AuthService } from "../../services/auth.service";

export class AuthController {
  public static async loginUser(req: Request, res: Response) {
    try {
      const body = req.body as LoginBody;

      const userWithToken = await AuthService.loginUser(body);

      return res.json(
        new ResponseDto<LoginResponseDto>(
          userWithToken,
          ResponseStatusEnum.Ok,
          new Message(GeneralMessageCodeEnum.LoginSuccess)
        )
      );
    } catch (error) {
      return ErrorsHelper.controllerErrorHandler(error, res);
    }
  }
}
