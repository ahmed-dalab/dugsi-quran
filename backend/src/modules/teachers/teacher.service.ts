import type { Request } from "express";
import bcrypt from "bcryptjs";
import type { EmploymentType, TeacherGender, TeacherStatus } from "../../../generated/prisma";
import { env } from "../../config/env";
import { isValidId } from "../../utils/id";
import { getQueryString, parsePaginationQuery } from "../../utils/pagination";
import { mapTeacherRecord, toEmploymentType } from "../../utils/mappers";
import { teacherRepository } from "./teacher.repository";

type EmergencyContactPayload = {
  name?: string;
  phone?: string;
  relationship?: string;
};

type CreateTeacherPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  address?: string | null;
  gender?: TeacherGender;
  dateOfBirth?: Date | null;
  hireDate?: Date;
  qualification?: string | null;
  specialization?: string | null;
  experience?: string | null;
  salary?: number | null;
  employmentType?: "full-time" | "part-time" | "volunteer";
  status: TeacherStatus;
  emergencyContact?: EmergencyContactPayload;
};

type UpdateTeacherPayload = Partial<CreateTeacherPayload>;

export const createTeacherService = async (payload: CreateTeacherPayload) => {
  const {
    name,
    email,
    password,
    employmentType,
    emergencyContact,
    hireDate,
    ...teacherData
  } = payload;
  const hashedPassword = await bcrypt.hash(password, env.HASH_SALT_ROUNDS);

  const teacher = await teacherRepository.createWithUser({
    user: { name, email, password: hashedPassword },
    teacher: {
      phone: teacherData.phone ?? null,
      address: teacherData.address ?? null,
      gender: teacherData.gender,
      dateOfBirth: teacherData.dateOfBirth ?? null,
      hireDate: hireDate ?? new Date(),
      qualification: teacherData.qualification ?? null,
      specialization: teacherData.specialization ?? null,
      experience: teacherData.experience ?? null,
      salary: teacherData.salary ?? null,
      employmentType: (toEmploymentType(employmentType) ?? "full_time") as EmploymentType,
      status: teacherData.status ?? "active",
      emergencyContact,
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

  const { name, email, password, employmentType, emergencyContact, hireDate, ...teacherData } =
    payload;
  const userData: { name?: string; email?: string; password?: string } = {};

  if (name) userData.name = name;
  if (email) userData.email = email;
  if (password) {
    userData.password = await bcrypt.hash(password, env.HASH_SALT_ROUNDS);
  }

  const updatedTeacher = await teacherRepository.updateWithUser(
    id,
    {
      ...(teacherData.phone !== undefined ? { phone: teacherData.phone } : {}),
      ...(teacherData.address !== undefined ? { address: teacherData.address } : {}),
      ...(teacherData.gender !== undefined ? { gender: teacherData.gender } : {}),
      ...(teacherData.dateOfBirth !== undefined ? { dateOfBirth: teacherData.dateOfBirth } : {}),
      ...(hireDate !== undefined ? { hireDate } : {}),
      ...(teacherData.qualification !== undefined
        ? { qualification: teacherData.qualification }
        : {}),
      ...(teacherData.specialization !== undefined
        ? { specialization: teacherData.specialization }
        : {}),
      ...(teacherData.experience !== undefined ? { experience: teacherData.experience } : {}),
      ...(teacherData.salary !== undefined ? { salary: teacherData.salary } : {}),
      ...(teacherData.status !== undefined ? { status: teacherData.status } : {}),
      ...(employmentType
        ? { employmentType: toEmploymentType(employmentType) as EmploymentType }
        : {}),
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
