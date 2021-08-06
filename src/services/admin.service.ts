import { AuthService } from "./auth.service";
import { Message } from "../dtos/response.dto";
import { GeneralMessageCodeEnum } from "../enums/general-message-code.enum";
import { UserStatus } from "../enums/user-status.enum";
import { UserHelper } from "../helpers/user.helper";
import { MongooseHelper } from "../helpers/mongoose.helper";
import { UserRole } from "../enums/user-role.enum";
import { ObjectId } from "mongodb";
import { UtilHelper } from "../helpers/util.helper";
import _ from "lodash";
import { PaginatedModel } from "../models/partials/paginated.model";
// import { CommonQuery } from "../interface/populate-option.interface";
import { TemplatesHelper } from "../helpers/templates.helper";
import { EmailId, EmailType, StagingEmailId } from "../enums/email.enum";
// import { EmailMessage, EmailService } from "./email.service";
import { EnvEnum } from "../enums/env.enum";
import { UserFetchListQuery, UserType } from "../interface/user.interface";
import { Admin } from "../models/Admin";
import { CreateBody } from "../dtos/auth.dto";

const Sequelize = require("sequelize");

const Op = Sequelize.Op;

export const defaultUserSelectedFields: string[] = [
  "name",
  "email",
  "permissions",
  "phone",
  "status",
];

export class AdminService {
  public static async resetPassword(
    verificationToken: string,
    newPassword: string
  ): Promise<void> {
    const email = UtilHelper.decryptStringData(verificationToken);

    const updateUserWriteResult: any = await Admin.update(
      {
        password: await AuthService.generatePasswordHash(newPassword),
      },
      {
        where: {
          email: email,
        },
      }
    );

    if (!updateUserWriteResult.ok) {
      throw new Message(
        GeneralMessageCodeEnum.BadData,
        `[UserService]: Reset password of email ${email} operation failed. `
      );
    }
  }

  // public static async patchUser(
  //   partialUser: Partial<User>
  // ): Promise<Partial<User>> {
  //   const user = await UserModel.findOne({
  //     _id: MongooseHelper.toObjectId(partialUser._id as string),
  //   }).lean();

  //   if (!user) {
  //     throw new Message(
  //       GeneralMessageCodeEnum.BadData,
  //       `[UserService]: Failed to fetch the user id ${partialUser._id}`
  //     );
  //   }

  //   if (user.role === UserRole.Educator && partialUser.educator) {
  //     throw new Message(
  //       GeneralMessageCodeEnum.BadData,
  //       `[UserService]: We dont allow to change the educator profile with other`
  //     );
  //   }

  //   if (user.role === UserRole.Student && partialUser.student) {
  //     throw new Message(
  //       GeneralMessageCodeEnum.BadData,
  //       `[UserService]: We dont allow to change the student profile with other.`
  //     );
  //   }

  //   if (!Object.keys(_.omit(user, ["_id"])).length) {
  //     throw new Message(
  //       GeneralMessageCodeEnum.BadData,
  //       `[UserService]: User patch should have at least one argument`
  //     );
  //   }

  //   const userUpdates: Partial<User> = {
  //     ...partialUser,
  //   };

  //   if (partialUser.password) {
  //     userUpdates.password = await AuthService.generatePasswordHash(
  //       user.password
  //     );
  //   }

  //   const userUpdateWriteResult: MongooseWriteResult =
  //     await UserModel.updateOne(
  //       {
  //         _id: user._id,
  //       },
  //       {
  //         $set: userUpdates,
  //       }
  //     );

  //   if (!userUpdateWriteResult.ok) {
  //     throw new Message(
  //       GeneralMessageCodeEnum.InternalServerError,
  //       `[UserService]: Failed to update the user ${user._id}`
  //     );
  //   }

  //   return _.omit(
  //     {
  //       ...user,
  //       ...userUpdates,
  //     },
  //     ["password", "createdAt"]
  //   );
  // }

  public static async getUserList(
    query: UserFetchListQuery
  ): Promise<PaginatedModel<Partial<Admin>[]>> {
    const userCount = await Admin.count();

    let findCondition: any = {};

    if (query.name) {
      findCondition.name = {
        [Op.iRegexp]: query.name,
      };
    }

    if (query.email) {
      findCondition.email = {
        [Op.iRegexp]: query.email,
      };
    }

    if (query.phone) {
      findCondition.phone = {
        [Op.iRegexp]: query.phone,
      };
    }

    const select = query.select || defaultUserSelectedFields;

    const users = await Admin.findAll({
      where: findCondition,
      attributes: select,
    });

    return new PaginatedModel(users, userCount);
  }

  public static async getUser(userId: string): Promise<Partial<Admin>> {
    const user = await Admin.findOne({
      where: {
        id: userId,
        status: UserStatus.Enable,
      },
    });

    if (!user) {
      throw new Message(
        GeneralMessageCodeEnum.BadData,
        `[UserService]: Failed to fetch the admin data ${userId}`
      );
    }

    return _.omit(user, ["password", "createdAt"]);
  }

  public static async createUser(user: CreateBody): Promise<Admin> {
    const userCount = await Admin.count({ where: { email: user.email } });

    if (userCount) {
      throw new Message(
        GeneralMessageCodeEnum.BadData,
        `[UserService]: Admin with emailId: ${user.email} is already exists.`
      );
    }

    const admin: Admin = await Admin.create({
      ...user,
      password: await AuthService.generatePasswordHash(user.password),
      status: UserStatus.Enable,
      permissions: UserHelper.getDefaultModelPermission(UserType.Admin),
    });

    return admin;
  }
}
