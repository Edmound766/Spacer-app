import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export type User = {
  id: string;
  name: string;
  email: string;
  role_name: "admin" | "client";
};

type UserState = {
  user: User | null;
};
const initialState: UserState = { user: null };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export default userSlice.reducer;

export const { setUser, clearUser } = userSlice.actions;

export const userSelector = (state: RootState) => state.user.user;
