import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../middleware/baseQueryMiddleware';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
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
        url: 'v1/admin/logout-admin',
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
    getDashbaord: builder.query({
      query: () => ({
        url: "v1/admin/get-dashboard",
        method: 'GET'
      })

    }),
    getRevenueData: builder.query({
      query: () => ({
        url: "v1/admin/get-revenue-data",
        method: 'GET'
      })
    })
  }),
});

export const { useLoginMutation, Payments, useGetAdminQuery, useGetAdminUsersQuery, useGetDashbaordQuery, useGetRevenueDataQuery, useLogoutMutation } = authApi;