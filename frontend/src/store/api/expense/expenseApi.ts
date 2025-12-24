import { apiSlice } from "../../rootApi/apiSlice";

const expenseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD EXPENSE CATEGORY
    addExpense: builder.mutation({
      query: (data) => ({
        url: "/auth/login-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useResetPasswordMutation } = expenseApi;
