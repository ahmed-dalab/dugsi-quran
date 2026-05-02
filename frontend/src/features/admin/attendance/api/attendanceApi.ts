import { baseApi } from "@/app/baseApi";
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

export interface AttendanceHistoryResponse {
  message: string;
  data: Attendance[];
}

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
    getAttendanceHistoryByClass: builder.query<AttendanceHistoryResponse, string>({
      query: (classId) => ({
        url: `/attendance/class/${classId}/history`,
        method: "GET",
      }),
      providesTags: ["Attendance"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useTakeAttendanceMutation,
  useGetAttendanceByClassAndDateQuery,
  useLazyGetAttendanceByClassAndDateQuery,
  useGetAttendanceHistoryByClassQuery,
} = attendanceApi;
