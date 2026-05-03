import { baseApi } from "@/app/baseApi";
import type { Settings } from "../types/settings.types";

export interface SettingsResponse {
  message: string;
  data: Settings;
}

export interface UpdateSettingsRequest {
  schoolName?: string;
  schoolEmail?: string | null;
  schoolPhone?: string | null;
  schoolAddress?: string | null;
  timezone?: string;
  currency?: string;
  attendanceEditWindowDays?: number;
  activeAcademicYear?: string;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<SettingsResponse, void>({
      query: () => ({
        url: "/settings/",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation<SettingsResponse, UpdateSettingsRequest>({
      query: (body) => ({
        url: "/settings/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
