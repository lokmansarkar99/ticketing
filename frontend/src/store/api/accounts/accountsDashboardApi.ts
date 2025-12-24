// api/accountsDashboardApi.js

import { apiSlice } from "../../rootApi/apiSlice";

const accountsDashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Expense Account Dashboard
    getExpenseAccountDashboard: builder.query({
      query: () => ({
        url: "/expense/get-expense-account-dashboard",
        method: "GET",
      }),
      providesTags: ["accounts-dashboard"],
    }),

    // PUT: Authorize Expense
    authorizeExpense: builder.mutation({
      query: ({ expenseId, body }) => ({
        url: `/expense/authorize-expense/${expenseId}`,
        method: "PUT",
        body, // This should include only the body content you want to send
      }),
      invalidatesTags: ["accounts-dashboard"], // Adjust tags if needed
    }),

    // GET: details expense
    getSingleExpenseDetails: builder.query({
      query: (id) => ({
        url: `/expense/get-expense-account-dashboard?id=${id}`,
        method: "GET",
      }),
      providesTags: ["accounts-dashboard"],
    }),
    // GET: Collection Account Dashboard
    getCollectionAccountDashboard: builder.query({
      query: () => ({
        url: "/collection/get-collection-account-dashboard",
        method: "GET",
      }),
      providesTags: ["accounts-dashboard"],
    }),

    // PUT: Authorize Collection
    authorizeCollection: builder.mutation({
      query: ({ collectionId, body }) => ({
        url: `/collection/authorize-collection/${collectionId}`, // URL using collectionId
        method: "PUT",
        body, // This should contain the body as per your Joi validation
      }),
      invalidatesTags: ["accounts-dashboard"], // Adjust tags as needed
    }),

    getAccountDashboardHomeData: builder.query({
      query: () => ({
        url: "/user/get-supervisor-report",
        method: "GET",
      }),
      providesTags: ["accounts-dashboard-home"],
    }),
    getAccountReportDetailsById: builder.query({
      query: (id) => ({
        url: `/user/details-supervisor-report/${id}`,
        method: "GET",
      }),
      providesTags: ["accounts-dashboard-home"],
    }),
    authorizeReportFromAccount: builder.mutation({
      query: ({ reportId, body }) => ({
        url: `/user/authorize-supervisor-report/${reportId}`, // URL using collectionId
        method: "POST",
        body, // This should contain the body as per your Joi validation
      }),
      //invalidatesTags: ["accounts-dashboard"], // Adjust tags as needed
    }),
    getAccountDashboardCounterReportData: builder.query({
      query: () => ({
        url: "/user/get-counter-report-submit",
        method: "GET",
      }),
      providesTags: ["accounts-dashboard-home"],
    }),
    authorizeCounterReport: builder.mutation({
      query: ({ id, body }) => ({
        url: `/user/authorize-counter-report/${id}`, // URL using collectionId
        method: "POST",
        body, // This should contain the body as per your Joi validation
      }),
      invalidatesTags: ["accounts-dashboard-home"], // Adjust tags as needed
    }),
    getAccountDashboardSummaryData: builder.query({
      query: () => ({
        url: "/admin/get-aggregation-accounts",
        method: "GET",
      }),
      providesTags: ["accounts-dashboard-home"],
    }),
  }),
});

export const {
  useGetSingleExpenseDetailsQuery,
  useGetExpenseAccountDashboardQuery,
  useAuthorizeExpenseMutation,
  useGetCollectionAccountDashboardQuery,
  useAuthorizeCollectionMutation,
  useGetAccountDashboardHomeDataQuery,
  useGetAccountReportDetailsByIdQuery,
  useAuthorizeReportFromAccountMutation,
  useGetAccountDashboardCounterReportDataQuery,
  useAuthorizeCounterReportMutation,
  useGetAccountDashboardSummaryDataQuery,
} = accountsDashboardApi;
