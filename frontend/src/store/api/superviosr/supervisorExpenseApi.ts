import { apiSlice } from "../../rootApi/apiSlice";

export const supervisorExpenseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSupervisorExpenses: builder.query({
      query: () => "/expense/get-expense-all",
      providesTags: ["SupervisorExpense"],
    }),
    getSingleSupervisorExpense: builder.query({
      query: (id) => `/expense/get-expense-single/${id}`,
      providesTags: (id) => [{ type: "SupervisorExpense", id }],
    }),
    createSupervisorExpense: builder.mutation({
      query: (newExpense) => ({
        url: "/expense/create-expense",
        method: "POST",
        body: newExpense,
      }),
      invalidatesTags: ["SupervisorExpense"],
    }),

    updateSupervisorExpense: builder.mutation({
      query: ({ id, data }) => ({
        url: `/expense/update-expense/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ({ id }) => [{ type: "SupervisorExpense", id }],
    }),
    deleteSupervisorExpense: builder.mutation({
      query: (id) => ({
        url: `/expense/delete-expense/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SupervisorExpense"],
    }),
    getSupervisorDashboardCoachInfo: builder.query({
      query: () => "/coach-config/get-coach-list-today",
    }),
    getSupervisorCoachDetails: builder.query({
      query: (coachId) => `/coach-config/coach-report-supervisor/${coachId}`,
    }),
    getSupervisorUpDownDetails: builder.query({
      query: ({ upDate, downDate, supervisorId }) =>
        `/user/supervisor-dashboard?upDate=${upDate}&downDate=${downDate}&supervisorId=${supervisorId}`,
    }),
    submitSupervisorExpenseReport: builder.mutation({
      query: (data) => ({
        url: "/user/create-supervisor-report-submit",
        method: "POST",
        body: data,
      }),
    }),
    createCounterReportSubmit: builder.mutation({
      query: (data) => ({
        url: "/user/create-counter-report-submit",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSupervisorExpensesQuery,
  useGetSingleSupervisorExpenseQuery,
  useCreateSupervisorExpenseMutation,
  useUpdateSupervisorExpenseMutation,
  useDeleteSupervisorExpenseMutation,
  useGetSupervisorDashboardCoachInfoQuery,
  useGetSupervisorCoachDetailsQuery,
  useLazyGetSupervisorCoachDetailsQuery,
  useGetSupervisorUpDownDetailsQuery,
  useSubmitSupervisorExpenseReportMutation,
  useCreateCounterReportSubmitMutation,
} = supervisorExpenseApi;
