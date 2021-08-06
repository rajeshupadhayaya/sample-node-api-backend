import { Request, Response } from "express";
import { Message, ResponseDto } from "../../dtos/response.dto";
import { GeneralMessageCodeEnum } from "../../enums/general-message-code.enum";
import { ResponseStatusEnum } from "../../enums/response-status.enum";
import { CreateBody, LoginBody, LoginResponseDto } from "../../dtos/auth.dto";
import { AuthService } from "../../services/auth.service";
import { ErrorsHelper } from "../../helpers/error.helper";
import { AdminService } from "../../services/admin.service";

export class AdminController {
  public static async loginUser(req: Request, res: Response) {
    try {
      const body = req.body as LoginBody;

      const userWithToken = await AuthService.loginAdminUser(body);

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

  public static async createUser(req: Request, res: Response) {
    try {
      const body = req.body as CreateBody;

      const user = await AdminService.createUser(body);

      return res.json(
        new ResponseDto(
          user,
          ResponseStatusEnum.Ok,
          new Message(GeneralMessageCodeEnum.AdminUserCreateSuccess)
        )
      );
    } catch (error) {
      return ErrorsHelper.controllerErrorHandler(error, res);
    }
  }
  public static async getList(req: Request, res: Response) {
    try {
      const userList = await AdminService.getUserList({});

      return res.json(
        new ResponseDto(
          userList,
          ResponseStatusEnum.Ok,
          new Message(GeneralMessageCodeEnum.AdminUserListSuccess)
        )
      );
    } catch (error) {
      return ErrorsHelper.controllerErrorHandler(error, res);
    }
  }
}
