import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const applicationsApi = createApi({
  reducerPath: "applicationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  tagTypes: ["Applications"],
  endpoints: (builder) => ({
    getAplications: builder.query({
      query: () => "/v1/admin/get-applications",
      providesTags: ["Applications"],
    }),
    getApplicationById: builder.query({
      query: (id) => `/v1/admin/get-applications/${id}`,
      providesTags: ["Applications"],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/v1/admin/apllication-status/${id}`, // note: 'apllication' spelling backend jaisa hi rakha hai
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Applications"],
    }),
    updateApplicationDocStatus: builder.mutation({
      query: ({ id, DocName, status }) => ({
        url: `/v1/admin/application-doc-status/${id}`,
        method: "PATCH",
        body: {
          DocName,
          status,
        },
      }),
      invalidatesTags: ["Applications"],
    }),
    updateApplicationPaymentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/v1/admin/apllication-paymentstatus/${id}`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const {
  useGetAplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationStatusMutation,
  useUpdateApplicationDocStatusMutation,
  useUpdateApplicationPaymentStatusMutation
} = applicationsApi;
