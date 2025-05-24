import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include",
    prepareHeaders: (headers,api) => {
      function getCsrfToken() {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
          if (cookie.startsWith("csrf_access_token=")) {
            return decodeURIComponent(cookie.split("=")[1]);
          }
        }
        return null;
      }

      const token = getCsrfToken();
      console.log(api);
      
      if (!token){
        console.warn("CSRF token not found for a modifying req")
      }
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("X-CSRF-TOKEN", token);
      }
      return headers;
    },
  }),
  tagTypes: ["Space","User"],
  endpoints: () => ({}),
});
