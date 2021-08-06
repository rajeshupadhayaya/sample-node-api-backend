// import { IPopulateOption } from "../interface/populate-option.interface";
import { v4 as uuidv4 } from "uuid";
// import fs from "promise-fs";
import { MapObj } from "../models/partials/map-obj.model";
import { ModelPermission } from "../enums/permission.enum";
import { ModelName } from "../enums/model-name.enum";
import crypto from "crypto";
import { toLower } from "lodash";

export class UtilHelper {
  static IV_LENGTH = 16; // For AES, this is always 16
  static ENCRYPTION_KEY = `${process.env.DATA_ENCRYPTION_KEY}`; // Must be 256 bytes (32 characters)

  public static encryptStringData(text: string): string {
    const iv = crypto.randomBytes(UtilHelper.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      new Buffer(UtilHelper.ENCRYPTION_KEY),
      iv
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  public static decryptStringData(text: string): string {
    const textParts: any = text.split(":");
    const iv = new Buffer(textParts.shift(), "hex");
    const encryptedText = new Buffer(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      new Buffer(UtilHelper.ENCRYPTION_KEY),
      iv
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  public static getAbsoluteImageUrl(relativeUrl: string): string {
    return `${process.env.AWS_BUCKET_IMAGE_URL}/${relativeUrl}`;
  }

  public static getAllModelPermissions(): MapObj<ModelPermission[]> {
    const modelNames: string[] = UtilHelper.enumsToArray(ModelName);
    const userPermissions: ModelPermission[] =
      UtilHelper.enumsToArray(ModelPermission);

    const modelPermission: MapObj<ModelPermission[]> = {};

    modelNames.forEach((modelName) => {
      modelPermission[modelName] = userPermissions;
    });

    return modelPermission;
  }

  // public static deleteFile(filePath: string): void {
  //     setTimeout(() => {
  //         if (fs.existsSync(filePath)) {
  //             fs.unlink(filePath).then(() => { });
  //         }
  //     }, 0);
  // }

  public static generateUniqueId(): string {
    return uuidv4();
  }

  public static enumsToArray(enumVal: any) {
    const arr: any[] = [];
    for (const n in enumVal) {
      if (enumVal.hasOwnProperty(n)) {
        arr.push(enumVal[n]);
      }
    }
    return arr;
  }

  public static getNameMetadata(name: string): string {
    return toLower(name.replace(/\s+/g, ""));
  }
}
