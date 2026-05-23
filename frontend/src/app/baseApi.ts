import type { RootState } from "@/app/store";
import { env } from "@/config/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: env.apiUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Users", "Classes", "Students", "Teachers", "Assignments", "Dashboard", "Attendance", "Fees", "Settings", "Reports"],
  endpoints: () => ({}),
});
