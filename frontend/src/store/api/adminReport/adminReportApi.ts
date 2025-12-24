import { apiSlice } from "@/store/rootApi/apiSlice";

const adminReportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodaysSaleAdminReport: builder.query({
      query: () => ({
        url: `/admin/get-today-sales`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),

    getUserWiseSaleAdminReport: builder.query({
      query: ({ userId, fromDate, toDate, counterId, dateType, orderStatus, busType }) => ({
        url: `/admin/user-wise-sales?userId=${userId}&fromDate=${fromDate}&toDate=${toDate}&counterId=${counterId}&dateType=${dateType}&orderStatus=${orderStatus}&busType=${busType}&size=10&page=1`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
    getUserWiseSaleAdminReportSummery: builder.query({
      query: ({ userId, fromDate, toDate, dateType }) => ({
        url: `/admin/user-wise-sales-summery?userId=${userId}&fromDate=${fromDate}&toDate=${toDate}&dateType=${dateType}`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
    getCounterWiseSaleAdminReport: builder.query({
      query: ({ routeName, fromDate, toDate, dateType }) => ({
        url: `/admin/counter-wise-sales-report?routeName=${routeName}&fromDate=${fromDate}&toDate=${toDate}&dateType=${dateType}`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
    getUserWiseSaleAdminReportByCounter: builder.query({
      query: ({ fromDate, toDate, counterId, dateType, orderStatus }) => ({
        url: `/admin/user-wise-sales-by-counter?fromDate=${fromDate}&toDate=${toDate}&counterId=${counterId}&dateType=${dateType}&orderStatus=${orderStatus}`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
    getCoachWiseSaleAdminReport: builder.query({
      query: ({ fromDate, toDate, dateType, orderStatus, routeName, schedule, coachClass }) => ({
        url: `/admin/coach-wise-sales?routeName=${routeName}&fromDate=${fromDate}&toDate=${toDate}&schedule=${schedule}&dateType=${dateType}&orderStatus=${orderStatus}&coachClass=${coachClass}`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
    getCoachWiseSaleAdminReportSummery: builder.query({
      query: ({ fromDate, toDate, coachClass }) => ({
        url: `/admin/coach-wise-sales-summery?fromDate=${fromDate}&toDate=${toDate}&coachClass=${coachClass}`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),

    getTripReport: builder.query({
      query: ({ registrationNo, fromDate, toDate }) => ({
        url: `/admin/trip-report?registrationNo=${registrationNo}&fromDate=${fromDate}&toDate=${toDate}`,
        method: "GET",
      }),
      providesTags: ["tripReport"],
    }),
    getExpenseSubCategoryReport: builder.query({
      query: ({ registrationNo, fromDate, toDate }) => ({
        url: `/admin/expense-accounts/get-expense-report?registrationNo=${registrationNo}&fromDate=${fromDate}&toDate=${toDate}`,
        method: "GET",
      }),
      providesTags: ["tripReport"],
    }),
    getUserList: builder.query({
      query: ({ size, page }) => ({
        url: `/user/get-user-all?size=${size}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
    getTripDataByDate: builder.query({
      query: ({ fromDate, toDate }) => ({
        url: `/admin/get-trip-number?fromDate=${fromDate}&toDate=${toDate}`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
    fetchTripWiseReport: builder.query({
      query: ({ tripNumber }) => ({
        url: `/admin/trip-wise-report?tripNumber=${tripNumber}`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
    // user change password
    adminChangePassword: builder.mutation({
      query: (data) => ({
        url: `/admin/change-password/${data?.id}`,
        method: "POST",
        body: {
          newPassword: data?.password
        },
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetTodaysSaleAdminReportQuery,
  useGetUserWiseSaleAdminReportQuery,
  useLazyGetUserWiseSaleAdminReportQuery,
  useLazyGetUserWiseSaleAdminReportSummeryQuery,
  useLazyGetCounterWiseSaleAdminReportQuery,
  useLazyGetCoachWiseSaleAdminReportQuery,
  useLazyGetCoachWiseSaleAdminReportSummeryQuery,
  useLazyGetUserWiseSaleAdminReportByCounterQuery,
  useGetUserListQuery,
  useGetTripReportQuery,
  useGetTripDataByDateQuery,
  useFetchTripWiseReportQuery,
  useAdminChangePasswordMutation,
} = adminReportApi;
