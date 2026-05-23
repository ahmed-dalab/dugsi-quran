import type { Request } from "express";
import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import { isValidId } from "../../utils/id";
import { getQueryString, parsePaginationQuery } from "../../utils/pagination";
import { mapTeacherRecord, toEmploymentType } from "../../utils/mappers";
import type { ITeacher } from "./teacher.model";
import { teacherRepository } from "./teacher.repository";

type CreateTeacherPayload = Omit<ITeacher, "userId"> & {
  name: string;
  email: string;
  password: string;
};

type UpdateTeacherPayload = Partial<Omit<ITeacher, "userId">> & {
  name?: string;
  email?: string;
  password?: string;
};

export const createTeacherService = async (payload: CreateTeacherPayload) => {
  const { name, email, password, ...teacherData } = payload;
  const hashedPassword = await bcrypt.hash(password, env.HASH_SALT_ROUNDS);

  const teacher = await teacherRepository.createWithUser({
    user: { name, email, password: hashedPassword },
    teacher: {
      ...teacherData,
      employmentType: toEmploymentType(teacherData.employmentType) ?? "full_time",
      status: teacherData.status ?? "active",
    },
  });

  return mapTeacherRecord({ ...teacher, user: teacher.user });
};

export const getTeachersService = async (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "createdAt", sortOrder: "desc" });
  const status = getQueryString(query, "status");
  const employmentType = getQueryString(query, "employmentType");

  const result = await teacherRepository.findPaginated(pagination, {
    status: status === "active" || status === "inactive" ? status : undefined,
    employmentType: toEmploymentType(employmentType),
  });

  return {
    data: result.docs.map((teacher) => mapTeacherRecord({ ...teacher, user: teacher.user })),
    pagination: result.pagination,
  };
};

export const getTeacherByIdService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  const teacher = await teacherRepository.findById(id);
  return teacher ? mapTeacherRecord({ ...teacher, user: teacher.user }) : null;
};

export const updateTeacherService = async (id: string, payload: UpdateTeacherPayload) => {
  if (!isValidId(id)) {
    return null;
  }

  const { name, email, password, employmentType, emergencyContact, ...teacherData } = payload;
  const userData: { name?: string; email?: string; password?: string } = {};

  if (name) userData.name = name;
  if (email) userData.email = email;
  if (password) {
    userData.password = await bcrypt.hash(password, env.HASH_SALT_ROUNDS);
  }

  const updatedTeacher = await teacherRepository.updateWithUser(
    id,
    {
      ...teacherData,
      ...(employmentType ? { employmentType: toEmploymentType(employmentType) } : {}),
      emergencyContact,
    },
    Object.keys(userData).length > 0 ? userData : undefined
  );

  return updatedTeacher ? mapTeacherRecord({ ...updatedTeacher, user: updatedTeacher.user }) : null;
};

export const deleteTeacherService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  const deletedTeacher = await teacherRepository.deleteWithUser(id);
  return deletedTeacher ? mapTeacherRecord({ ...deletedTeacher, user: deletedTeacher.user }) : null;
};
