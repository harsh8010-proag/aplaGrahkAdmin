import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/baseQueryMiddleware";

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Contacts"],
  endpoints: (builder) => ({
    getAllContacts: builder.query({
      query: () => "/v1/admin/get-all-contact",
      providesTags: (result) =>
        result?.contacts
          ? [...result.contacts.map((c) => ({ type: "Contact", id: c._id })), { type: "Contact", id: "LIST" }]
          : [{ type: "Contact", id: "LIST" }],
    }),
    updateContactStatus: builder.mutation({
      query: ({ contactId, status }) => ({
        url: `/v1/admin/update-statusend-messages-contact/${contactId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { contactId }) => [{ type: "Contact", id: contactId }, { type: "Contact", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllContactsQuery,
  useUpdateContactStatusMutation,
} = contactsApi;
