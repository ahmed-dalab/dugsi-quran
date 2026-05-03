import { baseApi } from "@/app/baseApi";
import type { FeePayment } from "../types/fee.types";

export interface CreateFeeRequest {
  studentId: string;
  classId: string;
  month: number;
  year: number;
  amountDue: number;
  amountPaid: number;
  paymentDate?: string | null;
  note?: string | null;
}

export interface UpdateFeeRequest {
  month?: number;
  year?: number;
  amountDue?: number;
  amountPaid?: number;
  paymentDate?: string | null;
  note?: string | null;
}

export interface FeeResponse {
  message: string;
  data: FeePayment;
}

export interface FeesResponse {
  message: string;
  data: FeePayment[];
}

export const feeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFees: builder.query<FeesResponse, void>({
      query: () => ({
        url: "/fees/",
        method: "GET",
      }),
      providesTags: ["Fees"],
    }),
    createFee: builder.mutation<FeeResponse, CreateFeeRequest>({
      query: (body) => ({
        url: "/fees/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Fees", "Dashboard"],
    }),
    updateFee: builder.mutation<FeeResponse, { id: string; body: UpdateFeeRequest }>({
      query: ({ id, body }) => ({
        url: `/fees/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Fees", "Dashboard"],
    }),
    deleteFee: builder.mutation<void, string>({
      query: (id) => ({
        url: `/fees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Fees", "Dashboard"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFeesQuery,
  useCreateFeeMutation,
  useUpdateFeeMutation,
  useDeleteFeeMutation,
} = feeApi;
