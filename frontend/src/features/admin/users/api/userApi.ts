import { baseApi } from "@/app/baseApi";
import { toListQueryParams, type ListQueryParams } from "@/lib/pagination";
import type { PaginatedResponse } from "@/types/pagination";
import type { User } from "../types/user.types";

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "admin" | "teacher";
  isActive: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: "admin" | "teacher";
  isActive?: boolean;
}

export interface UserResponse {
  message: string;
  data: User;
}

export type UsersResponse = PaginatedResponse<User>;

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, ListQueryParams | void>({
      query: (params) => ({
        url: "/users/",
        method: "GET",
        params: toListQueryParams(params ?? undefined),
      }),
      providesTags: ["Users"],
    }),
    getUser: builder.query<UserResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    createUser: builder.mutation<UserResponse, CreateUserRequest>({
      query: (body) => ({
        url: "/users/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<
      UserResponse,
      { id: string; body: UpdateUserRequest }
    >({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    toggleUserStatus: builder.mutation<UserResponse, string>({
      query: (id) => ({
        url: `/users/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} = userApi;
