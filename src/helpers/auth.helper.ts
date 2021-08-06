import * as bcrypt from "bcrypt";
import * as _ from "lodash";
import * as JWT from "jsonwebtoken";
import { LoginToken } from "../interface/login-token.interface";
import { UserType } from "../interface/user.interface";

export class AuthHelper {
  public static async verifyPasswordHash(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    // return `true` if password match else it returns `false`.
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, passwordHash, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public static generateJWTToken(userDetail: any, type: UserType) {
    const user = _.pick(userDetail, ["id", "email"]);
    const tokenData = new LoginToken(user, new Date());
    const dataString = JSON.stringify(tokenData);
    const secret =
      type === UserType.Admin
        ? process.env.JWT_ADMIN_SECRET_KEY
        : process.env.JWT_SECRET_KEY;
    return JWT.sign(dataString, `${secret}`);
  }
}
