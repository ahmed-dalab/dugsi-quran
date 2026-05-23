import { baseApi } from "@/app/baseApi";
import { toListQueryParams, type ListQueryParams } from "@/lib/pagination";
import type { PaginatedResponse } from "@/types/pagination";
import type { Student } from "../types/student.types";

export interface CreateStudentRequest {
  fullName: string;
  gender: "male" | "female";
  dateOfBirth?: string | null;
  guardianName?: string | null;
  guardianPhone: string;
  classId: string;
  registrationDate: string;
  status: "active" | "inactive";
}

export interface UpdateStudentRequest {
  fullName?: string;
  gender?: "male" | "female";
  dateOfBirth?: string | null;
  guardianName?: string | null;
  guardianPhone?: string;
  classId?: string;
  registrationDate?: string;
  status?: "active" | "inactive";
}

export interface StudentResponse {
  message: string;
  data: Student;
}

export type StudentsResponse = PaginatedResponse<Student>;

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<StudentsResponse, ListQueryParams | void>({
      query: (params) => ({
        url: "/students/",
        method: "GET",
        params: toListQueryParams(params ?? undefined),
      }),
      providesTags: ["Students"],
    }),
    getStudent: builder.query<StudentResponse, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: "GET",
      }),
      providesTags: ["Students"],
    }),
    createStudent: builder.mutation<StudentResponse, CreateStudentRequest>({
      query: (body) => ({
        url: "/students/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Students"],
    }),
    updateStudent: builder.mutation<
      StudentResponse,
      { id: string; body: UpdateStudentRequest }
    >({
      query: ({ id, body }) => ({
        url: `/students/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Students"],
    }),
    deleteStudent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Students"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
