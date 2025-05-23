import { type User } from "@features/users/userSlice";
import { apiSlice } from "@features/api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<string, Partial<User>>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      }),
    login: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => "/auth/profile",
    }),
    logout: builder.mutation<void, void>({
      query: () =>({
        url:"/auth/logout",
        method:"POST"
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetProfileQuery } = authApi;

