import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { shareWithCookies } from "@/utils/helpers/shareWithCookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = appConfiguration.baseUrl;
const customBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders(headers) {
    headers.set(
      "Authorization",
      `Bearer ${shareWithCookies("get", `${appConfiguration.appCode}token`)}`
    );
    return headers;
  },
});
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
  tagTypes: [
    "user",
    "driver",
    "accounts-dashboard",
    "SupervisorExpense",
    "supervisor_expense_category",
    "supervisor",
    "admin_report",
    "fuelCompany",
    "counter_sales_booking",
    "authentication",
    "expense_category",
    "file",
    "counter",
    "station",
    "schedule",
    "route",
    "coach",
    "coach_configuration",
    "update_coach_configuration",
    "account",
    "partner",
    "fare",
    "seat",
    "booking",
    "permission",
    "permissiontype",
    "role",
    "vehicle",
    "helper",
    "reserve",
    "slider",
    "cms",
    "accounts-expense",
    "accounts-expense-subcategory",
    "expense_accounts",
    "accounts-dashboard-home",
    "partial",
    "duePayment",
    "tripReport",
    "about",
    "discount",
    "coupon",
    "fund",
    "seat-plan",
    "sisterConcern",
    "coreValue",
    "userStatistics",
    "pages",
    "offer",
    "faq",
    "blogPost",
    "blog-category"
  ],
});
