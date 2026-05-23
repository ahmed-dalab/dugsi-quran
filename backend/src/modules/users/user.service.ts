import type { Request } from "express";
import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import { isValidId } from "../../utils/id";
import { getQueryString, parsePaginationQuery } from "../../utils/pagination";
import { serializeEntity, serializeList } from "../../utils/serialize";
import type { IUser } from "./user.model";
import { userRepository } from "./user.repository";

type CreateUserPayload = IUser;
type UpdateUserPayload = Partial<IUser>;

const sanitizeUser = (user: unknown) => {
  if (!user || typeof user !== "object") {
    return user;
  }

  const { password, ...safeUser } = user as Record<string, unknown>;
  return serializeEntity(safeUser);
};

export const createUserService = async (payload: CreateUserPayload) => {
  const hashedPassword = await bcrypt.hash(payload.password, env.HASH_SALT_ROUNDS);
  const user = await userRepository.create({ ...payload, password: hashedPassword });
  return sanitizeUser(user);
};

const buildUserListFilters = (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "createdAt", sortOrder: "desc" });
  const role = getQueryString(query, "role");
  const filters: { role?: "admin" | "teacher"; isActive?: boolean } = {};

  if (role === "admin" || role === "teacher") {
    filters.role = role;
  }

  if (query.isActive === "true") {
    filters.isActive = true;
  } else if (query.isActive === "false") {
    filters.isActive = false;
  }

  return { pagination, filters };
};

export const getUsersService = async (query: Request["query"]) => {
  const { pagination, filters } = buildUserListFilters(query);
  const result = await userRepository.findPaginated(pagination, filters);

  return {
    data: serializeList(result.docs).map(sanitizeUser),
    pagination: result.pagination,
  };
};

export const getUserByIdService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  const user = await userRepository.findById(id);
  return user ? sanitizeUser(user) : null;
};

export const updateUserService = async (id: string, payload: UpdateUserPayload) => {
  if (!isValidId(id)) {
    return null;
  }

  const user = await userRepository.update(id, payload);
  return sanitizeUser(user);
};

export const deleteUserService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  try {
    const user = await userRepository.delete(id);
    return sanitizeUser(user);
  } catch {
    return null;
  }
};

export const toggleUserStatusService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  const existingUser = await userRepository.findById(id);
  if (!existingUser) {
    return null;
  }

  const user = await userRepository.update(id, { isActive: !existingUser.isActive });
  return sanitizeUser(user);
};
