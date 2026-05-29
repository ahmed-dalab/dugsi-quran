import { baseApi } from "@/app/baseApi";
import { createCrudEndpoints, type ItemResponse } from "@/lib/createCrudApi";
import type { PaginatedResponse } from "@/types/pagination";
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

export type ClassResponse = ItemResponse<ClassItem>;
export type ClassesResponse = PaginatedResponse<ClassItem>;

export const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const crud = createCrudEndpoints<ClassItem, CreateClassRequest, UpdateClassRequest>(builder, {
      path: "/classes",
      tag: "Classes",
    });

    return {
      getClasses: crud.list,
      getClass: crud.getOne,
      createClass: crud.create,
      updateClass: crud.update,
      deleteClass: crud.remove,
    };
  },
  overrideExisting: false,
});

export const {
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classApi;
