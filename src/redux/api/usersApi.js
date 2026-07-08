import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/v1/admin/get-all-user",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `v1/admin/get-user/${id}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    userBlock: builder.mutation({
      query: (id) => ({
        url: `/v1/admin/user-block/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
    userDelete: builder.mutation({
      query: (id) => ({
        url: `v1/admin/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUserBlockMutation,
  useUserDeleteMutation,
} = usersApi;
