import { UserPermissions } from "../interface/user.interface";
import { Admin } from "../models/Admin";
import { User } from "../models/User";

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateBody {
  email: string;
  password: string;
  permission: UserPermissions;
}

export interface LoginResponseDto {
  token: string;
  user: Partial<User | Admin>;
}
