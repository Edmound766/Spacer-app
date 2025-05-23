import { configureStore} from "@reduxjs/toolkit";
import { apiSlice } from "@/features/api/apiSlice";
import userReducer from "@features/users/userSlice";


export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]:apiSlice.reducer,
        user:userReducer
    },
    middleware:getDefaultMiddleWare=>getDefaultMiddleWare().concat(apiSlice.middleware)
})


export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
