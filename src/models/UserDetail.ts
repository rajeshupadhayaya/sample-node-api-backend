import {
  Model,
  Table,
  Column,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";
import { AllowNull } from "sequelize-typescript";

export interface UserDetailAttributes {
  businessName?: string;
  businessPhone?: string;
  logo?: string;
  documents?: {
    name: string;
    url: string;
  };
  addressLine1?: string;
  addressLine2?: string;
  pan?: string;
  pincode?: number;
  city?: string;
  country?: string;
}

export interface UserDetailInstance extends UserDetailAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

@Table
export class UserDetail extends Model<
  UserDetailInstance,
  UserDetailAttributes
> {
  @AllowNull(false)
  @Column
  businessName!: string;

  @AllowNull(false)
  @Column
  businessPhone!: string;

  @Column
  logo!: string;

  @Column
  documents!: string;

  @AllowNull(false)
  @Column
  addressLine1!: string;

  @AllowNull(false)
  @Column
  addressLine2!: string;

  @Column pan!: Date;

  @AllowNull(false)
  @Column
  pincode!: string;

  @AllowNull(false)
  @Column
  city!: string;

  @AllowNull(false)
  @Column
  country!: string;

  @ForeignKey(() => User)
  @Column
  userId!: number;
  @BelongsTo(() => User)
  user!: User;
}
