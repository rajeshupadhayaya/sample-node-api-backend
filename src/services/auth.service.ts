import { LoginBody, LoginResponseDto } from "../dtos/auth.dto";

import { Message } from "../dtos/response.dto";
import { GeneralMessageCodeEnum } from "../enums/general-message-code.enum";
import { AuthHelper } from "../helpers/auth.helper";
import { UserRole } from "../enums/user-role.enum";
import { ModelPermission } from "../enums/permission.enum";
import { compose, RequestHandler } from "compose-middleware";
import { NextFunction, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Logger } from "../helpers/logger.helper";
import { MongooseHelper } from "../helpers/mongoose.helper";
import { AuthRequest } from "../interface/express.interface";
import { ModelName } from "../enums/model-name.enum";
import _ from "lodash";
import { UserHelper } from "../helpers/user.helper";
import { UserStatus } from "../enums/user-status.enum";
// import { MongooseWriteResult } from "../interface/mongoose-options.interface";
import { UserInstance } from "../models/User";
import { LoginToken } from "./../interface/login-token.interface";
import { Admin, AdminInstance } from "../models/Admin";
import { UserType } from "../interface/user.interface";

// var models = require("../models");

export class AuthService {
  // public static async loginUser({
  //   email,
  //   password,
  // }: LoginBody): Promise<LoginResponseDto> {
  //   const user = await models.user.findOne({
  //     where: {
  //       email: email,
  //     },
  //   });

  //   if (!user) {
  //     throw new Message(
  //       GeneralMessageCodeEnum.BadData,
  //       `[AuthService]: Incorrect email id or password.`
  //     );
  //   }

  //   const isPasswordValid = await AuthHelper.verifyPasswordHash(
  //     password,
  //     user.password
  //   );

  //   if (!isPasswordValid) {
  //     throw new Message(
  //       GeneralMessageCodeEnum.BadData,
  //       `[AuthService]: Incorrect email id or password.`
  //     );
  //   }

  //   if (user.status === UserStatus.Disable) {
  //     throw new Message(
  //       GeneralMessageCodeEnum.BadData,
  //       `[AuthService]: User is disabled please contact with support team.`
  //     );
  //   }

  //   if (!user.isEmailIdVerified) {
  //     UserHelper.sendVerificationEmailToUser(user);
  //     throw new Message(
  //       GeneralMessageCodeEnum.BadData,
  //       `[AuthService]: Your email is not verified, please verify you email we have just sent you.`
  //     );
  //   }

  //   const userUpdateWriteResult: MongooseWriteResult =
  //     await models.user.updateOne(
  //       {
  //         lastLogin: new Date().toISOString(),
  //       },
  //       {
  //         where: {
  //           id: user.id,
  //         },
  //       }
  //     );

  //   if (!userUpdateWriteResult.ok) {
  //     throw new Message(
  //       GeneralMessageCodeEnum.InternalServerError,
  //       `[AuthService]: Failed to update the user last login report.`
  //     );
  //   }

  //   return {
  //     token: AuthHelper.generateJWTToken(user, UserType.User),
  //     user: _.omit(user, ["password"]),
  //   };
  // }

  public static async loginAdminUser({
    email,
    password,
  }: LoginBody): Promise<LoginResponseDto> {
    const user = await Admin.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Message(
        GeneralMessageCodeEnum.BadData,
        `[AuthService]: Incorrect email id or password.`
      );
    }

    const isPasswordValid = await AuthHelper.verifyPasswordHash(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Message(
        GeneralMessageCodeEnum.BadData,
        `[AuthService]: Incorrect email id or password.`
      );
    }

    if (user.status === UserStatus.Disable) {
      throw new Message(
        GeneralMessageCodeEnum.BadData,
        `[AuthService]: User is disabled please contact with support team.`
      );
    }

    return {
      token: AuthHelper.generateJWTToken(user, UserType.Admin),
      user: _.omit(user, ["password"]),
    };
  }

  // public static decodeToken(token: string): LoginToken | undefined {
  //   let decoded: LoginToken | undefined = undefined;

  //   if (!token || !token.includes("Bearer")) {
  //     return decoded;
  //   }

  //   token = token.replace("Bearer ", "");

  //   try {
  //     decoded = jwt.verify(
  //       token,
  //       `${process.env.JWT_SECRET_KEY}`
  //     ) as LoginToken;
  //   } catch (err) {
  //     Logger.warn("[AuthService]: Could not decode the JWT token.", {
  //       error: err,
  //     });
  //   }

  //   return decoded;
  // }

  public static async generatePasswordHash(password: string): Promise<string> {
    const iteration = 10;
    return new Promise((resolve, reject) => {
      // generating salt ref: https://www.abeautifulsite.net/hashing-passwords-with-nodejs-and-bcrypt
      bcrypt.hash(password, iteration, function (err, hash) {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  // public static applyAuthentication(
  //   roles: UserRole[],
  //   modelName: ModelName,
  //   permissions?: ModelPermission[]
  // ): RequestHandler<any, any, any> {
  //   return compose(
  //     this.injectCurrentUser,
  //     this.validateUser(roles, modelName, permissions)
  //   );
  // }

  // private static injectCurrentUser(
  //   req: AuthRequest,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   const loginToken: LoginToken | undefined = req.headers?.authorization
  //     ? AuthService.decodeToken(req.headers?.authorization)
  //     : undefined;

  //   if (!loginToken) {
  //     Logger.warn(
  //       `[AuthService]: Auth enabled but token not present on api url: ${req.url}`
  //     );
  //   }
  //   models.user
  //     .findOne({
  //       where: {
  //         id: loginToken!.user!.id!,
  //       },
  //     })
  //     .then((user: UserInstance) => {
  //       if (!user) {
  //         throw new Message(
  //           GeneralMessageCodeEnum.Forbidden,
  //           `[AuthService]: User not found with id ${loginToken?.user!.id}`
  //         );
  //       }

  //       req.user = _.omit(user, ["password"]);
  //       next();
  //     });
  // }

  // private static validateUser(
  //   roles: UserRole[],
  //   modelName: ModelName,
  //   permissions?: ModelPermission[]
  // ) {
  //   return (req: AuthRequest, res: Response, next: NextFunction) => {
  //     const user = req.user;
  //     const userModelNameAllowed: ModelName[] = Object.keys(
  //       user.modelPermissions
  //     ) as ModelName[];

  //     if (user.isSuperAdmin) {
  //       return next();
  //     }

  //     if (!userModelNameAllowed.length) {
  //       throw new Message(
  //         GeneralMessageCodeEnum.MethodNotAllowed,
  //         `[AuthService]: User ${user.email} should have at-least one module permission`,
  //         405
  //       );
  //     }

  //     if (roles.length && !roles.includes(user.role)) {
  //       throw new Message(
  //         GeneralMessageCodeEnum.MethodNotAllowed,
  //         `[AuthService]: User ${user.email} role not allowed for url: ${req.url}`,
  //         405
  //       );
  //     }

  //     if (!userModelNameAllowed.includes(modelName)) {
  //       throw new Message(
  //         GeneralMessageCodeEnum.MethodNotAllowed,
  //         `[AuthService]: User ${user.email} model ${modelName} not allowed.`
  //       );
  //     }

  //     const userModulePermission: ModelPermission[] | undefined =
  //       user.modelPermissions[modelName];

  //     if (
  //       permissions &&
  //       permissions.length &&
  //       userModulePermission &&
  //       userModulePermission.length
  //     ) {
  //       for (const permission of permissions) {
  //         if (userModulePermission.includes(permission)) {
  //           return next();
  //         }
  //       }

  //       throw new Message(
  //         GeneralMessageCodeEnum.MethodNotAllowed,
  //         `[AuthService]: User ${user.email} model ${modelName} allowed but permission not allowed.`
  //       );
  //     }
  //   };
  // }
}
