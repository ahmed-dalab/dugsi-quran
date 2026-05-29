import { baseApi } from "@/app/baseApi";
import { createCrudEndpoints, type ItemResponse } from "@/lib/createCrudApi";
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

export type StudentResponse = ItemResponse<Student>;
export type StudentsResponse = PaginatedResponse<Student>;

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const crud = createCrudEndpoints<Student, CreateStudentRequest, UpdateStudentRequest>(builder, {
      path: "/students",
      tag: "Students",
    });

    return {
      getStudents: crud.list,
      getStudent: crud.getOne,
      createStudent: crud.create,
      updateStudent: crud.update,
      deleteStudent: crud.remove,
    };
  },
  overrideExisting: false,
});

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
