import { UserRole } from "../enums/user-role.enum";
import { UserStatus } from "../enums/user-status.enum";
import {
  Model,
  Table,
  Column,
  HasOne,
  AllowNull,
  Default,
} from "sequelize-typescript";
import { UserPermissions } from "../interface/user.interface";
import { UserDetail } from "./UserDetail";
import { DataType } from "sequelize-typescript";

export interface UserAttributes {
  fname?: string;
  lname?: string;
  email?: string;
  phone_no?: string;
  password?: string;
  status?: string;
  isVerified?: boolean;
  permissions?: UserPermissions;
}

export interface UserInstance extends UserAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

@Table
export class User extends Model<UserInstance, UserAttributes> {
  @AllowNull(false)
  @Column
  email!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @Column
  fname!: string;

  @Column
  lname!: string;

  @Column
  phone_no!: string;

  @AllowNull(false)
  @Column
  status!: UserStatus;

  @AllowNull(false)
  @Column
  user_type!: UserRole;

  @Column lastLogin!: Date;

  @AllowNull(false)
  @Default(false)
  @Column
  isVerified!: Boolean;

  @Column(DataType.TEXT) permissions!: UserPermissions[];
  @HasOne(() => UserDetail) userDetail!: UserDetail;
}
