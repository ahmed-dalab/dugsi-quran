import type { RootState } from "@/app/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface LoginRequest {
  email: string;
  password: string;
}

export type UserRole = "admin" | "teacher";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
    logout: builder.mutation<{ status: string; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    me: builder.query<{ status: string; user: AuthUser }, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useMeQuery,
} = authApi;