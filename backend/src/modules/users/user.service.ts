import type { Request } from "express";
import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import { getQueryString, parsePaginationQuery } from "../../utils/pagination";
import {
  parseBooleanQuery,
  parseEnumFilter,
  USER_ROLES,
} from "../../utils/queryFilters";
import { getByIdOrNull, mapPaginatedResult, mutateOrNull } from "../../utils/serviceHelpers";
import { serializeEntity } from "../../utils/serialize";
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

export const getUsersService = async (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "createdAt", sortOrder: "desc" });
  const result = await userRepository.findPaginated(pagination, {
    role: parseEnumFilter(getQueryString(query, "role"), USER_ROLES),
    isActive: parseBooleanQuery(query, "isActive"),
  });

  return mapPaginatedResult(result, (doc) => sanitizeUser(doc));
};

export const getUserByIdService = (id: string) =>
  getByIdOrNull(id, async (validId) => {
    const user = await userRepository.findById(validId);
    return user ? sanitizeUser(user) : null;
  });

export const updateUserService = (id: string, payload: UpdateUserPayload) =>
  mutateOrNull(id, async (validId) => {
    const user = await userRepository.update(validId, payload);
    return sanitizeUser(user);
  });

export const deleteUserService = (id: string) =>
  mutateOrNull(id, async (validId) => {
    const user = await userRepository.delete(validId);
    return sanitizeUser(user);
  });

export const toggleUserStatusService = (id: string) =>
  getByIdOrNull(id, async (validId) => {
    const existingUser = await userRepository.findById(validId);
    if (!existingUser) {
      return null;
    }

    const user = await userRepository.update(validId, { isActive: !existingUser.isActive });
    return sanitizeUser(user);
  });
