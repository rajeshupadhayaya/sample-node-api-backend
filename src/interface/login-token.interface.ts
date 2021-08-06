import { UserInstance } from "../models/User";

export class LoginToken {
  constructor(
    public user: Pick<UserInstance, "id" | "email">,
    public timestamp: Date
  ) {}
}
