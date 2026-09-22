import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../middleware/baseQueryMiddleware';

// A separate api slice for everything that isn't auth itself. It reuses the
// SAME baseQueryWithReauth, so a 401 here triggers the exact same
// refresh-and-retry flow as it does in authApi — the mutex makes sure a
// login-page request and a dashboard request never both trigger their own
// refresh at the same time.
export const adminDataApi = createApi({
    reducerPath: 'adminDataApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getAdminUsers: builder.query({
            query: () => ({
                url: '/v1/user/get-admin-user',
                method: 'GET',
            }),
        }),
        getDashboard: builder.query({
            query: () => ({
                url: '/v1/admin/get-dashboard',
                method: 'GET',
            }),
        }),
        getRevenueData: builder.query({
            query: () => ({
                url: '/v1/admin/get-revenue-data',
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetAdminUsersQuery,
    useGetDashboardQuery,
    useGetRevenueDataQuery,
} = adminDataApi;