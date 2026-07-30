import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: "include",
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;

    if (status === 401 || status === 403) {
      console.warn("401/403 Unauthorized -> Clearing admin session & redirecting to login");
      
      // Clear localStorage tokens and data used by the Admin Panel
      localStorage.removeItem("admin_token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("accessToken"); // Just in case from older code

      // Force instant redirect to clear broken UI states
      window.location.href = "/login";
    }
  }

  return result;
};