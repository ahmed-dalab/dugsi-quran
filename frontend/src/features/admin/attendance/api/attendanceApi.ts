import { baseApi } from "@/app/baseApi";
import { toListQueryParams, type ListQueryParams } from "@/lib/pagination";
import type { PaginatedResponse } from "@/types/pagination";
import type { Attendance, AttendanceStatus } from "../types/attendance.types";

export interface AttendanceInputRecord {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface TakeAttendanceRequest {
  classId: string;
  date: string;
  records: AttendanceInputRecord[];
}

export interface AttendanceResponse {
  message: string;
  data: Attendance;
}

export type AttendanceHistoryResponse = PaginatedResponse<Attendance>;

export type AttendanceHistoryParams = ListQueryParams & {
  classId?: string;
};

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    takeAttendance: builder.mutation<AttendanceResponse, TakeAttendanceRequest>({
      query: (body) => ({
        url: "/attendance/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),
    getAttendanceList: builder.query<AttendanceHistoryResponse, ListQueryParams | void>({
      query: (params) => ({
        url: "/attendance/",
        method: "GET",
        params: toListQueryParams(params ?? undefined),
      }),
      providesTags: ["Attendance"],
    }),
    getAttendanceByClassAndDate: builder.query<
      AttendanceResponse,
      { classId: string; date: string }
    >({
      query: ({ classId, date }) => ({
        url: `/attendance/class/${classId}`,
        method: "GET",
        params: { date },
      }),
      providesTags: ["Attendance"],
    }),
    getAttendanceHistoryByClass: builder.query<AttendanceHistoryResponse, AttendanceHistoryParams>({
      query: ({ classId, ...params }) => ({
        url: `/attendance/class/${classId}/history`,
        method: "GET",
        params: toListQueryParams(params),
      }),
      providesTags: ["Attendance"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useTakeAttendanceMutation,
  useGetAttendanceListQuery,
  useGetAttendanceByClassAndDateQuery,
  useLazyGetAttendanceByClassAndDateQuery,
  useGetAttendanceHistoryByClassQuery,
} = attendanceApi;
