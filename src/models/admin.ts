import { Model, Table, Column, AllowNull } from "sequelize-typescript";
import { UserStatus } from "../enums/user-status.enum";
import { UserPermissions } from "../interface/user.interface";
import { DataType } from "sequelize-typescript";

export interface AdminAttributes {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  status: UserStatus;
  permissions?: UserPermissions[];
}

export interface AdminInstance extends AdminAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

@Table
export class Admin extends Model<AdminInstance, AdminAttributes> {
  @AllowNull(false)
  @Column
  email!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @Column name?: string;

  @Column phone?: string;

  @AllowNull(false)
  @Column
  status!: UserStatus;

  @Column(DataType.JSON)
  permissions!: UserPermissions[];
}
