import { baseApi } from "@/app/baseApi";
import { toListQueryParams, type ListQueryParams } from "@/lib/pagination";
import type { PaginatedResponse } from "@/types/pagination";
import type { TeacherClassAssignment } from "../types/assignment.types";

export interface CreateAssignmentRequest {
  teacherId: string;
  classId: string;
  notes?: string;
}

export interface UpdateAssignmentRequest {
  status?: "active" | "inactive" | "ended";
  endDate?: string | null;
  notes?: string;
}

export interface AssignmentResponse {
  message: string;
  data: TeacherClassAssignment;
}

export type AssignmentsResponse = PaginatedResponse<TeacherClassAssignment>;

export type AssignmentsListParams = ListQueryParams & {
  status?: string;
};

export type AssignmentsByTeacherParams = ListQueryParams & {
  teacherId: string;
};

export type AssignmentsByClassParams = ListQueryParams & {
  classId: string;
};

export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query<AssignmentsResponse, AssignmentsListParams | void>({
      query: (params) => ({
        url: "/assignments/",
        method: "GET",
        params: toListQueryParams(params ?? undefined),
      }),
      providesTags: ["Assignments"],
    }),
    getAssignment: builder.query<AssignmentResponse, string>({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: "GET",
      }),
      providesTags: ["Assignments"],
    }),
    getAssignmentsByTeacher: builder.query<AssignmentsResponse, AssignmentsByTeacherParams>({
      query: ({ teacherId, ...params }) => ({
        url: `/assignments/teacher/${teacherId}`,
        method: "GET",
        params: toListQueryParams(params),
      }),
      providesTags: ["Assignments"],
    }),
    getCurrentAssignmentForTeacher: builder.query<AssignmentResponse, string>({
      query: (teacherId) => ({
        url: `/assignments/teacher/${teacherId}/current`,
        method: "GET",
      }),
      providesTags: ["Assignments"],
    }),
    getAssignmentsByClass: builder.query<AssignmentsResponse, AssignmentsByClassParams>({
      query: ({ classId, ...params }) => ({
        url: `/assignments/class/${classId}`,
        method: "GET",
        params: toListQueryParams(params),
      }),
      providesTags: ["Assignments"],
    }),
    createAssignment: builder.mutation<AssignmentResponse, CreateAssignmentRequest>({
      query: (body) => ({
        url: "/assignments/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Assignments", "Teachers"],
    }),
    updateAssignment: builder.mutation<
      AssignmentResponse,
      { id: string; body: UpdateAssignmentRequest }
    >({
      query: ({ id, body }) => ({
        url: `/assignments/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Assignments", "Teachers"],
    }),
    deleteAssignment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assignments", "Teachers"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentQuery,
  useGetAssignmentsByTeacherQuery,
  useGetCurrentAssignmentForTeacherQuery,
  useGetAssignmentsByClassQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentApi;
