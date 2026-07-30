import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/baseQueryMiddleware";

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Contacts"],
  endpoints: (builder) => ({
    getAllContacts: builder.query({
      query: () => "/v1/admin/get-all-contact",
      providesTags: ["Contacts"],
    }),
    updateContactStatus: builder.mutation({
      query: ({ contactId, status }) => ({
        url: `/v1/admin/update-statusend-messages-contact/${contactId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Contacts"],
    }),
  }),
});

export const {
  useGetAllContactsQuery,
  useUpdateContactStatusMutation,
} = contactsApi;
