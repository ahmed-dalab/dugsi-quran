import { isValidObjectId } from "mongoose";
import type { Request } from "express";
import { IUser, User } from "./user.model";
import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import {
  buildSearchFilter,
  getPaginateOptions,
  getQueryString,
  parsePaginationQuery,
  toPaginatedList,
} from "../../utils/pagination";
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

const buildUserListFilter = (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "createdAt", sortOrder: "desc" });
  const filter: Record<string, unknown> = {
    ...buildSearchFilter(pagination.search, ["name", "email"]),
  };

  const role = getQueryString(query, "role");
  if (role === "admin" || role === "teacher") {
    filter.role = role;
  }

  if (query.isActive === "true") {
    filter.isActive = true;
  } else if (query.isActive === "false") {
    filter.isActive = false;
  }

  return { pagination, filter };
};

export const getUsersService = async (query: Request["query"]) => {
  const { pagination, filter } = buildUserListFilter(query);
  const result = await User.paginate(filter, getPaginateOptions(pagination, { select: "-password" }));

  return toPaginatedList(result, sanitizeUser);
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

export const toggleUserStatusService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const existingUser = await User.findById(id).lean();

  if (!existingUser) {
    return null;
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isActive: !existingUser.isActive },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  if (!user) {
    return null;
  }

  return sanitizeUser(user);
};
