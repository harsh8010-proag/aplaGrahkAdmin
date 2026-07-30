import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/baseQueryMiddleware";

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["DocumentTypes"],
  endpoints: (builder) => ({
    createDocumentType: builder.mutation({
      query: (data) => ({
        url: "/v1/document-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DocumentTypes"],
    }),
    getAllDocumentType: builder.query({
      query: () => ({
        url: "/v1/document-types",
        method: "GET",
      }),
      providesTags: ["DocumentTypes"],
    }),
    updateDocumentType: builder.mutation({
      query: ({ id, data }) => ({
        url: `/v1/document-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["DocumentTypes"],
    }),
    toggleDocumentTypeStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/v1/document-types/${id}/toggle`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["DocumentTypes"],
    }),
    deleteDocumentType: builder.mutation({
      query: (id) => ({
        url: `/v1/document-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DocumentTypes"],
    }),
  }),
});

export const {
  useCreateDocumentTypeMutation,
  useGetAllDocumentTypeQuery,
  useUpdateDocumentTypeMutation,
  useToggleDocumentTypeStatusMutation,
  useDeleteDocumentTypeMutation,
} = documentApi;
