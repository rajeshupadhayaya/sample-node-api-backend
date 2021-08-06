import { ModelName } from "../enums/model-name.enum";
import { ModelPermission } from "../enums/permission.enum";
import { MapObj } from "../models/partials/map-obj.model";
import { UtilHelper } from "./util.helper";
import { UserRole } from "../enums/user-role.enum";
import { UserPermissions, UserType } from "../interface/user.interface";
// import {User} from "../models/user.model";
// import {TemplatesHelper} from "./templates.helper";
// import {EmailMessage, EmailService} from "../services/email.service";
// import {EmailId, EmailType, StagingEmailId} from "../enums/email.enum";
// import {EnvEnum} from "../enums/env.enum";

export class UserHelper {
  // public static sendVerificationEmailToUser(user: User): void {

  //     const emailData = {
  //         user,
  //         helpers: TemplatesHelper.getTemplateHelperFunctions(),
  //         verificationToken: UtilHelper.encryptStringData(user.email)
  //     };

  //     const emailSubject = EmailService.getSubject(
  //         user.role === UserRole.Student ? EmailType.StudentEmailVerification : EmailType.EducatorEmailVerification,
  //         emailData
  //     );

  //     const emailMessageData: EmailMessage = {
  //         emailSubject,
  //         emailType: user.role === UserRole.Student ? EmailType.StudentEmailVerification : EmailType.EducatorEmailVerification,
  //         emailFrom: EmailId.Service,
  //         emailTo: process.env.ENV_NAME === EnvEnum.PRODUCTION ? user.email : (
  //             user.role === UserRole.Student ? StagingEmailId.Student : StagingEmailId.Educator
  //         ),
  //         data: emailData
  //     };

  //     EmailService.sendEmailWithoutResponse(emailMessageData, 2);
  // }

  public static getDefaultModelPermission(userType: UserType) {
    // TODO: Need to decide which mode is valid for default user
    // if(userType = UserType.Admin){

    // }else{

    // }
    // const modelNames: string[] = UtilHelper.enumsToArray(ModelName);
    // const userPermissions: ModelPermission[] =
    //   UtilHelper.enumsToArray(ModelPermission);

    // const modelPermission: MapObj<ModelPermission[]> = {};

    // modelNames.forEach((modelName) => {
    //   modelPermission[modelName] = userPermissions;
    // });

    // return modelPermission;
    const permissions: UserPermissions[] = [
      {
        module: ModelName.All,
        access: [ModelPermission.All],
      },
    ];
    return permissions;
  }
}
