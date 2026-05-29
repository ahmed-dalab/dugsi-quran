import { baseApi } from "@/app/baseApi";
import { createCrudEndpoints, type ItemResponse } from "@/lib/createCrudApi";
import type { PaginatedResponse } from "@/types/pagination";
import type { Teacher } from "../types/teacher.types";

export interface CreateTeacherRequest {
  name: string;
  email: string;
  password: string;
  employeeId?: string;
  phone?: string;
  address?: string;
  gender?: "male" | "female";
  dateOfBirth?: string | null;
  hireDate?: string;
  qualification?: string;
  specialization?: string;
  experience?: string;
  salary?: number;
  employmentType?: "full-time" | "part-time" | "volunteer";
  status?: "active" | "inactive";
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
}

export interface UpdateTeacherRequest {
  name?: string;
  email?: string;
  password?: string;
  employeeId?: string;
  phone?: string;
  address?: string;
  gender?: "male" | "female";
  dateOfBirth?: string | null;
  hireDate?: string;
  qualification?: string;
  specialization?: string;
  experience?: string;
  salary?: number;
  employmentType?: "full-time" | "part-time" | "volunteer";
  status?: "active" | "inactive";
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
}

export type TeacherResponse = ItemResponse<Teacher>;
export type TeachersResponse = PaginatedResponse<Teacher>;

export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const crud = createCrudEndpoints<Teacher, CreateTeacherRequest, UpdateTeacherRequest>(builder, {
      path: "/teachers",
      tag: "Teachers",
    });

    return {
      getTeachers: crud.list,
      getTeacher: crud.getOne,
      createTeacher: crud.create,
      updateTeacher: crud.update,
      deleteTeacher: crud.remove,
    };
  },
  overrideExisting: false,
});

export const {
  useGetTeachersQuery,
  useGetTeacherQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;
