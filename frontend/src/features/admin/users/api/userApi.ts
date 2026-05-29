import { baseApi } from "@/app/baseApi";
import { createCrudEndpoints, type ItemResponse } from "@/lib/createCrudApi";
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

export type UserResponse = ItemResponse<User>;
export type UsersResponse = PaginatedResponse<User>;

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const crud = createCrudEndpoints<User, CreateUserRequest, UpdateUserRequest>(builder, {
      path: "/users",
      tag: "Users",
    });

    return {
      getUsers: crud.list,
      getUser: crud.getOne,
      createUser: crud.create,
      updateUser: crud.update,
      deleteUser: crud.remove,
      toggleUserStatus: builder.mutation<UserResponse, string>({
        query: (id) => ({
          url: `/users/${id}/toggle-status`,
          method: "PATCH",
        }),
        invalidatesTags: ["Users"],
      }),
    };
  },
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} = userApi;
