import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { setAccessToken, logout } from '../redux/Authslice';

// Prevents a burst of parallel requests that all 401 at once from each
// triggering their own /refresh call — only the first one refreshes,
// the rest wait for it to finish and then retry with the new token.
const mutex = new Mutex();

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // send the httpOnly refresh cookie on every request
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);
  const requestUrl = typeof args === 'string' ? args : args.url;
  // Never refresh in response to a failed login/refresh/logout request.
  // In particular, a failed bootstrap refresh must not issue a second refresh
  // request against a rotating refresh token.
  const isAuthRequest = [
    '/v1/admin/login-admin',
    '/v1/admin/refresh-token',
    '/v1/admin/logout-admin',
  ].includes(requestUrl);

  if (result.error?.status === 401 && !isAuthRequest) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        // Re-check: another request may have already refreshed while
        // we were waiting to acquire the lock.
        const refreshResult = await rawBaseQuery(
          { url: '/v1/admin/refresh-token', method: 'POST' },
          api,
          extraOptions
        );

        const accessToken =
          refreshResult.data?.accessToken ||
          refreshResult.data?.token ||
          refreshResult.data?.access_token;

        if (accessToken) {
          api.dispatch(setAccessToken(accessToken));
          // retry the original request with the new token
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      // Someone else is already refreshing — wait, then retry once with
      // whatever token ends up in the store.
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);

      // The request that held the lock may have failed to refresh and logged
      // out. Do not leave a protected screen mounted with a stale session.
      if (!api.getState().auth.accessToken && result.error?.status === 401) {
        api.dispatch(logout());
      }
    }
  }
  return result;
};
