import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: "include",

  prepareHeaders: (headers) => {
    // Get access token from localStorage
    const token = localStorage.getItem("accessToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});


export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401 && localStorage.getItem("accessToken")) {
    console.log("401 → refreshing token...");

    const refreshResult = await baseQuery(
      {
        url: "/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    // Extract token safely
    const newAccessToken =
      refreshResult?.data?.access_token ||
      refreshResult?.data?.token ||
      refreshResult?.data?.data?.access_token ||
      null;

    if (newAccessToken) {
      // console.log("New token:", newAccessToken);

      localStorage.setItem("accessToken", newAccessToken);

      // Retry original request
      result = await baseQuery(
        {
          ...args,
          headers: {
            ...(args.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
          },
        },
        api,
        extraOptions
      );
    } else {
      console.warn("Refresh failed → clearing token");
      localStorage.removeItem("access_token");
    }
  }

  return result;
};