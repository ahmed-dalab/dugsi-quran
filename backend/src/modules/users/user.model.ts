import { USER_ROLE } from "./user.constant";

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}
