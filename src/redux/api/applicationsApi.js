import { createApi } from "@reduxjs/toolkit/query/react";
import wsService from "../../utils/websocketService";
import { baseQueryWithReauth } from "../../middleware/baseQueryMiddleware";

export const applicationsApi = createApi({
  reducerPath: "applicationsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Applications"],
  endpoints: (builder) => ({
    getAplications: builder.query({
      query: () => "/v1/admin/get-applications",
      providesTags: ["Applications"],

      // ── Real-time: refetch automatically when the backend broadcasts
      // a NEW_APPLICATION event over WebSocket.
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        // Wait for the initial REST call to succeed before attaching the WS
        await cacheDataLoaded;

        // Ensure the WS is connected (no-op if already open)
        wsService.connect();

        // Subscribe to new-application events
        const invalidateApplications = (type, data) => {
          console.log(`📩 [WS] ${type} received:`, data);
          dispatch(applicationsApi.util.invalidateTags(["Applications"]));
        };

        const unsubscribers = [
          wsService.addListener("NEW_APPLICATION", (data) =>
            invalidateApplications("NEW_APPLICATION", data),
          ),
          wsService.addListener("APPLICATION_STATUS_UPDATED", (data) =>
            invalidateApplications("APPLICATION_STATUS_UPDATED", data),
          ),
          wsService.addListener("APPLICATION_DOCUMENT_STATUS_UPDATED", (data) =>
            invalidateApplications("APPLICATION_DOCUMENT_STATUS_UPDATED", data),
          ),
          wsService.addListener("SERVICE_UPDATED", (data) =>
            invalidateApplications("SERVICE_UPDATED", data),
          ),
        ];

        // Clean up when the cache entry is removed (no subscribers left)
        await cacheEntryRemoved;
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      },
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
      invalidatesTags: ["Applications"],
    }),
  }),
});

export const {
  useGetAplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationStatusMutation,
  useUpdateApplicationDocStatusMutation,
  useUpdateApplicationPaymentStatusMutation,
} = applicationsApi;
