import { baseApi } from "@/app/baseApi";
import type { ClassItem } from "../types/class.types";

export interface CreateClassRequest {
  name: string;
  levelOrder: number;
  monthlyFee: number;
  teacherId?: string | null;
  isActive: boolean;
}

export interface UpdateClassRequest {
  name?: string;
  levelOrder?: number;
  monthlyFee?: number;
  teacherId?: string | null;
  isActive?: boolean;
}

export interface ClassResponse {
  message: string;
  data: ClassItem;
}

export interface ClassesResponse {
  message: string;
  data: ClassItem[];
}

export const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<ClassesResponse, void>({
      query: () => ({
        url: "/classes/",
        method: "GET",
      }),
      providesTags: ["Classes"],
    }),
    getClass: builder.query<ClassResponse, string>({
      query: (id) => ({
        url: `/classes/${id}`,
        method: "GET",
      }),
      providesTags: ["Classes"],
    }),
    createClass: builder.mutation<ClassResponse, CreateClassRequest>({
      query: (body) => ({
        url: "/classes/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Classes"],
    }),
    updateClass: builder.mutation<
      ClassResponse,
      { id: string; body: UpdateClassRequest }
    >({
      query: ({ id, body }) => ({
        url: `/classes/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Classes"],
    }),
    deleteClass: builder.mutation<void, string>({
      query: (id) => ({
        url: `/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Classes"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classApi;
