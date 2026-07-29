import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import wsService from "../../utils/websocketService";

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
        const unsubscribe = wsService.addListener(
          "NEW_APPLICATION",
          (data) => {
            console.log("📩 [WS] NEW_APPLICATION received:", data);
            // Invalidate the Applications tag so RTK Query re-fetches the list
            dispatch(applicationsApi.util.invalidateTags(["Applications"]));
          }
        );

        // Clean up when the cache entry is removed (no subscribers left)
        await cacheEntryRemoved;
        unsubscribe();
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
