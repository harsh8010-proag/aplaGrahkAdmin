import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../middleware/baseQueryMiddleware';
import { setAccessToken, logout } from '../Authslice';

// Keep the token contract in one place.  The API currently returns
// `accessToken`; accepting the common alternatives here also prevents the UI
// and the route guard from disagreeing about whether a login succeeded.
const getAccessToken = (data) =>
  data?.accessToken ||
  data?.token ||
  data?.access_token ||
  data?.data?.accessToken ||
  data?.data?.token ||
  data?.data?.access_token;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/v1/admin/login-admin',
        method: 'POST',
        body: credentials,
      }),
      // as soon as login succeeds, put the access token into Redux state
      // so prepareHeaders can start attaching it to every request
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const accessToken = getAccessToken(data);
          if (!accessToken) throw new Error('Login response did not include an access token');
          dispatch(setAccessToken(accessToken));
        } catch {
          // login failed — nothing to store, the mutation's own error state handles the UI
        }
      },
      invalidatesTags: ['Admin'],
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/v1/admin/logout-admin',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // clear client state regardless of whether the server call succeeded
          dispatch(logout());
        }
      },
      invalidatesTags: ['Admin'],
    }),

    // called once on app load to silently restore a session from the
    // httpOnly refresh cookie, without the admin re-entering credentials
    bootstrapSession: builder.mutation({
      query: () => ({
        url: '/v1/admin/refresh-token',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const accessToken = getAccessToken(data);
          if (!accessToken) throw new Error('Refresh response did not include an access token');
          dispatch(setAccessToken(accessToken));
        } catch {
          dispatch(logout());
        }
      },
    }),

    getAdmin: builder.query({
      query: () => ({
        url: '/v1/admin/get-profile',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useBootstrapSessionMutation,
  useGetAdminQuery,
} = authApi;
