// api/accountsDashboardApi.js

import { apiSlice } from "../../rootApi/apiSlice";

const expenseDashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createExpenseCategorey: builder.mutation({
      query: ({ body }) => ({
        url: `/expense-category-accounts/create-expense-category-accounts`,
        method: "POST",
        body, // This should include only the body content you want to send
      }),
      invalidatesTags: ["accounts-expense"], // Adjust tags if needed
    }),
    // GET: Expense Account Dashboard
    getExpenseCategoreyAccountList: builder.query({
      query: () => ({
        url: "/expense-category-accounts/get-expense-category-accounts-all",
        method: "GET",
      }),
      providesTags: ["accounts-expense"],
    }),

    // PUT: Authorize Expense
    updateExpenseCategorey: builder.mutation({
      query: ({ id, body }) => ({
        url: `/expense-category-accounts/update-expense-category-accounts/${id}`,
        method: "PUT",
        body, // This should include only the body content you want to send
      }),
      invalidatesTags: ["accounts-expense"], // Adjust tags if needed
    }),

    // GET: details expense
    getSingleExpenseCategorey: builder.query({
      query: (id) => ({
        url: `/expense-category-accounts/get-expense-category-accounts-single?id=${id}`,
        method: "GET",
      }),
      providesTags: ["accounts-expense"],
    }),
    deleteExpenseCategoreyOfAccountant: builder.mutation({
      query: (id) => ({
        url: `/expense-category-accounts/delete-expense-category-accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["accounts-expense"],
    }),
  }),
});

export const {
  useGetExpenseCategoreyAccountListQuery,
  useGetSingleExpenseCategoreyQuery,
  useUpdateExpenseCategoreyMutation,
  useDeleteExpenseCategoreyOfAccountantMutation,
  useCreateExpenseCategoreyMutation,
} = expenseDashboardApi;
