import { apiSlice } from "@/store/rootApi/apiSlice";
import { fallback } from "@/utils/constants/common/fallback";

const expenseAccountsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING EXPENSE ACCOUNTS
    addExpenseAccount: builder.mutation({
      query: (data) => ({
        url: "/expense-accounts/create-expense-accounts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["expense_accounts"],
    }),

    // GETTING ALL EXPENSE ACCOUNTS
    getAllExpenseAccounts: builder.query({
      query: (data) => ({
        url: `/expense-accounts/get-expense-accounts-all?search=${
          data?.search || ""
        }&page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&sortOrder=${data?.sort || "asc"} `,
      }),
      providesTags: ["expense_accounts"],
    }),

    getExpenseReport:builder.query({
      query: (data) => ({
        url: `/expense-accounts/expense-report?fromDate=${data.from}&toDate=${data?.to}&category=${data?.categoryId}&subcategory=${data?.subCategoryId}`,
        method: "GET",
      }),
      providesTags: ["expense_accounts"],
    }),

    // GETTING SINGLE EXPENSE ACCOUNT BY ID
    getSingleExpenseAccount: builder.query({
      query: (id) => ({
        url: `/expense-accounts/get-expense-accounts-single/${id}`,
      }),
      providesTags: ["expense_accounts"],
    }),

    // DELETING EXPENSE ACCOUNT BY ID
    deleteExpenseAccount: builder.mutation({
      query: (id) => ({
        url: `/expense-accounts/delete-expense-accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["expense_accounts"],
    }),
  }),
});

export const {
  useAddExpenseAccountMutation,
  useGetAllExpenseAccountsQuery,
  useGetSingleExpenseAccountQuery,
  useDeleteExpenseAccountMutation,
  useGetExpenseReportQuery
} = expenseAccountsApi;
