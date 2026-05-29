import { baseApi } from "@/app/baseApi";
import { createCrudEndpoints, type ItemResponse } from "@/lib/createCrudApi";
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

export type FeeResponse = ItemResponse<FeePayment>;
export type FeesResponse = PaginatedResponse<FeePayment>;

export const feeApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const crud = createCrudEndpoints<FeePayment, CreateFeeRequest, UpdateFeeRequest>(builder, {
      path: "/fees",
      tag: "Fees",
      extraInvalidates: ["Dashboard"],
    });

    return {
      getFees: crud.list,
      createFee: crud.create,
      updateFee: crud.update,
      deleteFee: crud.remove,
    };
  },
  overrideExisting: false,
});

export const {
  useGetFeesQuery,
  useCreateFeeMutation,
  useUpdateFeeMutation,
  useDeleteFeeMutation,
} = feeApi;
