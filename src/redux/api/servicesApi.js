import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
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
      }),
      invalidatesTags: ["Services"],
    }),
    updateService: builder.mutation({
      query: ({ id, body }) => ({
        url: `/v1/services/${id}`,
        method: "PUT",
        body: body, // ✅ FormData directly
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
    getServiceById: builder.query({
      query: (id) => ({
        url: `/v1/services/${id}`,
        method: "GET",
      }),
      providesTags: ["Services"],
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
