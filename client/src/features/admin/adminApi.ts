import { apiSlice } from "@features/api/apiSlice";
import type { User } from "@features/users/userSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/admin/users",
      
    }),
  }),
});
export const {useGetUsersQuery}= adminApi