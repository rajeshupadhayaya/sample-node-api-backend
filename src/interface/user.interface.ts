import { ModelName } from "../enums/model-name.enum";
import { ModelPermission } from "../enums/permission.enum";
import { UserRole } from "../enums/user-role.enum";

export interface UserFetchListQuery {
  email?: string;
  name?: string;
  phone?: string;
  select?: string[];
}

export interface UserPermissions {
  module: ModelName;
  access: ModelPermission[];
}

export enum UserType {
  User = "User",
  Admin = "Admin",
}
