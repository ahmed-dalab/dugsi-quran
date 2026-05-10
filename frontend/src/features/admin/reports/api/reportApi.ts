import { baseApi } from "@/app/baseApi";
import type { ReportsOverviewResponse } from "../types/report.types";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportsOverview: builder.query<ReportsOverviewResponse, void>({
      query: () => ({
        url: "/reports/overview",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetReportsOverviewQuery } = reportApi;
