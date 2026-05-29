import { baseApi } from "@/app/baseApi";
import { toListQueryParams, type ListQueryParams } from "@/lib/pagination";
import { createCrudEndpoints, type ItemResponse } from "@/lib/createCrudApi";
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

export type AssignmentResponse = ItemResponse<TeacherClassAssignment>;
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
  endpoints: (builder) => {
    const crud = createCrudEndpoints<
      TeacherClassAssignment,
      CreateAssignmentRequest,
      UpdateAssignmentRequest
    >(builder, {
      path: "/assignments",
      tag: "Assignments",
      extraInvalidates: ["Teachers"],
    });

    return {
      getAssignments: crud.list,
      getAssignment: crud.getOne,
      createAssignment: crud.create,
      updateAssignment: crud.update,
      deleteAssignment: crud.remove,
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
    };
  },
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
