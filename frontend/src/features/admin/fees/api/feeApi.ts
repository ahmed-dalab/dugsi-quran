import { baseApi } from "@/app/baseApi";
import { toListQueryParams, type ListQueryParams } from "@/lib/pagination";
import type { PaginatedResponse } from "@/types/pagination";
import type { FeePayment } from "../types/fee.types";

export interface CreateFeeRequest {
  studentId: string;
  amountPaid: number;
  paymentDate?: string | null;
  note?: string | null;
}

export interface UpdateFeeRequest {
  amountPaid?: number;
  paymentDate?: string | null;
  note?: string | null;
}

export interface FeeResponse {
  message: string;
  data: FeePayment;
}

export type FeesResponse = PaginatedResponse<FeePayment>;

export const feeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFees: builder.query<FeesResponse, ListQueryParams | void>({
      query: (params) => ({
        url: "/fees/",
        method: "GET",
        params: toListQueryParams(params ?? undefined),
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
