// api/accountsDashboardApi.js

import { apiSlice } from "../../rootApi/apiSlice";

const expenseSubCategoreyDashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createExpenseSubCategorey: builder.mutation({
      query: ({ body }) => ({
        url: `/expense-subcategory-accounts/create-expense-subcategory-accounts`,
        method: "POST",
        body, // This should include only the body content you want to send
      }),
      invalidatesTags: ["accounts-expense-subcategory"], // Adjust tags if needed
    }),
    // GET: Expense Account Dashboard
    getExpenseSubCategoreyAccountList: builder.query({
      query: () => ({
        url: "/expense-subcategory-accounts/get-expense-subcategory-accounts-all",
        method: "GET",
      }),
      providesTags: ["accounts-expense-subcategory"],
    }),

    // PUT: Authorize Expense
    updateExpenseSubCategorey: builder.mutation({
      query: ({ id, body }) => ({
        url: `/expense-subcategory-accounts/update-expense-subcategory-accounts/${id}`,
        method: "PUT",
        body, // This should include only the body content you want to send
      }),
      invalidatesTags: ["accounts-expense-subcategory"], // Adjust tags if needed
    }),

    // GET: details expense
    getSingleExpenseSubCategorey: builder.query({
      query: (id) => ({
        url: `/expense-subcategory-accounts/get-expense-subcategory-accounts-single?id=${id}`,
        method: "GET",
      }),
      providesTags: ["accounts-expense-subcategory"],
    }),
    deleteExpenseSubCategoreyOfAccountant: builder.mutation({
      query: (id) => ({
        url: `/expense-subcategory-accounts/delete-expense-subcategory-accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["accounts-expense-subcategory"],
    }),
  }),
});

export const {
  useGetExpenseSubCategoreyAccountListQuery,
  useGetSingleExpenseSubCategoreyQuery,
  useUpdateExpenseSubCategoreyMutation,
  useDeleteExpenseSubCategoreyOfAccountantMutation,
  useCreateExpenseSubCategoreyMutation,
} = expenseSubCategoreyDashboardApi;
