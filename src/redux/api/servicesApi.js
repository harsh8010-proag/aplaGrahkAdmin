import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/baseQueryMiddleware";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Services"],
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/v1/services",
      providesTags: ["Services"],
    }),
    getServiceById: builder.query({
      query: (id) => `/v1/services/${id}`,
      providesTags: ["Services"],
    }),
    createService: builder.mutation({
      query: (newService) => ({
        url: "/v1/services",
        method: "POST",
        body: newService,
        // Don't set Content-Type header - browser will set it with boundary for FormData
      }),
      invalidatesTags: ["Services"],
    }),
    updateService: builder.mutation({
      query: ({ id, body }) => ({
        url: `/v1/services/${id}`,
        method: "PUT",
        body: body,
        // Don't set Content-Type header - browser will set it automatically
      }),
      invalidatesTags: ["Services"],
    }),
    toggleServiceStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/v1/services/${id}/toggle`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["Services"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/v1/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),
  }),
});
export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useToggleServiceStatusMutation,
  useDeleteServiceMutation,
  // useGetServiceByIdQuery
} = servicesApi;
