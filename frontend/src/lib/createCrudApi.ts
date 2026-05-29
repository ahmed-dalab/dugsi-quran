import type { EndpointBuilder } from "@reduxjs/toolkit/query";
import { toListQueryParams, type ListQueryParams } from "@/lib/pagination";
import type { PaginatedResponse } from "@/types/pagination";

export type ItemResponse<T> = {
  message: string;
  data: T;
};

type CrudApiConfig = {
  path: string;
  tag: string;
  extraInvalidates?: string[];
};

export function createCrudEndpoints<TEntity, TCreate, TUpdate>(
  builder: EndpointBuilder<any, any, any>,
  config: CrudApiConfig
) {
  const { path, tag, extraInvalidates = [] } = config;
  const invalidateTags = [tag, ...extraInvalidates];

  return {
    list: builder.query<PaginatedResponse<TEntity>, ListQueryParams | void>({
      query: (params) => ({
        url: `${path}/`,
        method: "GET",
        params: toListQueryParams(params ?? undefined),
      }),
      providesTags: [tag],
    }),
    getOne: builder.query<ItemResponse<TEntity>, string>({
      query: (id) => ({
        url: `${path}/${id}`,
        method: "GET",
      }),
      providesTags: [tag],
    }),
    create: builder.mutation<ItemResponse<TEntity>, TCreate>({
      query: (body) => ({
        url: `${path}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: invalidateTags,
    }),
    update: builder.mutation<ItemResponse<TEntity>, { id: string; body: TUpdate }>({
      query: ({ id, body }) => ({
        url: `${path}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: invalidateTags,
    }),
    remove: builder.mutation<void, string>({
      query: (id) => ({
        url: `${path}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: invalidateTags,
    }),
  };
}
