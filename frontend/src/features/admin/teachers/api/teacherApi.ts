import { baseApi } from "@/app/baseApi";
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

export interface TeacherResponse {
  message: string;
  data: Teacher;
}

export interface TeachersResponse {
  message: string;
  data: Teacher[];
}

export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<TeachersResponse, void>({
      query: () => ({
        url: "/teachers/",
        method: "GET",
      }),
      providesTags: ["Teachers"],
    }),
    getTeacher: builder.query<TeacherResponse, string>({
      query: (id) => ({
        url: `/teachers/${id}`,
        method: "GET",
      }),
      providesTags: ["Teachers"],
    }),
    createTeacher: builder.mutation<TeacherResponse, CreateTeacherRequest>({
      query: (body) => ({
        url: "/teachers/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Teachers"],
    }),
    updateTeacher: builder.mutation<
      TeacherResponse,
      { id: string; body: UpdateTeacherRequest }
    >({
      query: ({ id, body }) => ({
        url: `/teachers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Teachers"],
    }),
    deleteTeacher: builder.mutation<void, string>({
      query: (id) => ({
        url: `/teachers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teachers"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTeachersQuery,
  useGetTeacherQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;
