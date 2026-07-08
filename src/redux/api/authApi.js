import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { baseQueryWithReauth } from '../middleware/baseQueryMiddleware';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/v1/admin/login-admin',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
    }),
    getAdmin: builder.query({
      query: () => ({
        url: '/v1/admin/get-profile',
        method: 'GET',
      }),
    }),
    getAdminUsers: builder.query({
      query: () => ({
        url: '/v1/user/get-admin-user',
        method: 'GET',
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetAdminQuery, useGetAdminUsersQuery } = authApi;