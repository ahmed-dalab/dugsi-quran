import { isValidObjectId } from "mongoose";
import { IUser, User } from "./user.model";
import bcrypt from "bcryptjs"
import { env } from "../../config/env";
type CreateUserPayload = IUser;
type UpdateUserPayload = Partial<IUser>;

const sanitizeUser = (user: unknown) => {
  const userObject =
    typeof user === "object" &&
    user !== null &&
    "toObject" in user &&
    typeof user.toObject === "function"
      ? (user.toObject() as Record<string, unknown>)
      : (user as Record<string, unknown>);
  const { password, ...safeUser } = userObject;

  return safeUser;
};

export const createUserService = async (payload: CreateUserPayload) => {
  const hashedPassword = await bcrypt.hash(payload.password, env.HASH_SALT_ROUNDS);
  const user = await User.create({ ...payload, password: hashedPassword });

  return sanitizeUser(user);
};

export const getUsersService = async () => {
  const users = await User.find().lean();

  return users.map((user) => sanitizeUser(user));
};

export const getUserByIdService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const user = await User.findById(id).lean();

  if (!user) {
    return null;
  }

  return sanitizeUser(user);
};

export const updateUserService = async (id: string, payload: UpdateUserPayload) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const user = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!user) {
    return null;
  }

  return sanitizeUser(user);
};

export const deleteUserService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const user = await User.findByIdAndDelete(id).lean();

  if (!user) {
    return null;
  }

  return sanitizeUser(user);
};
