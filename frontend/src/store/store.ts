import { configureStore } from "@reduxjs/toolkit";
import counterSearchFilterReducer from "./api/counter/counterSearchFilterSlice";
import coachConfigModalReducer from "./api/user/coachConfigModalSlice";
import userReducer from "./api/user/userSlice";
import { apiSlice } from "./rootApi/apiSlice";
import callcenterSearchFilterReducer from "./api/callcenter/callcenterSearchFilterSlice";

export const store: any = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,

    user: userReducer,
    counterSearchFilter: counterSearchFilterReducer,
    callcenterSearchFilter: callcenterSearchFilterReducer,
    coachConfigModal: coachConfigModalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
