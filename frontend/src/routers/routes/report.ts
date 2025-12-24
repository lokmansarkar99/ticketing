
import React from "react";
import { IRouteProps } from "./contacts";
import UserWiseSales from "@/pages/dashboard/admin/reports/UserWiseSales";
import UserWiseSalesSummary from "@/pages/dashboard/admin/reports/UserWiseSalesSummary";
import AllCounterUserWiseSales from "@/pages/dashboard/admin/reports/AllCounterUserWiseSales";
import CoachWiseSales from "@/pages/dashboard/admin/reports/CoachWiseSales";
import CoachWiseSummary from "@/pages/dashboard/admin/reports/CoachWiseSummary";
import DayWiseSales from "@/pages/dashboard/admin/reports/DayWiseSales";
import DayWiseSalesSummary from "@/pages/dashboard/admin/reports/DayWiseSalesSummary";
import TicketWiseSales from "@/pages/dashboard/admin/reports/TicketWiseSales";
import RouteWiseSales from "@/pages/dashboard/admin/reports/RouteWiseSales";
import CounterWiseSales from "@/pages/dashboard/admin/reports/CounterWiseSales";
import AllCounterWiseSales from "@/pages/dashboard/admin/reports/AllCounterWiseSales";
import DiscountList from "@/pages/dashboard/admin/discount/DiscountList";

export const reportRoutes: IRouteProps[] = [
    {
      path: "user_wise_sales",
      element: React.createElement(UserWiseSales),
    },
    {
      path: "user_wise_sales_summary",
      element: React.createElement(UserWiseSalesSummary),
    },
    {
      path: "all_counter_user_wise_sales",
      element: React.createElement(AllCounterUserWiseSales),
    },
    {
      path: "coach_wise_sales",
      element: React.createElement(CoachWiseSales),
    },
    {
      path: "coach_wise_summary",
      element: React.createElement(CoachWiseSummary),
    },
    {
      path: "day_wise_sales",
      element: React.createElement(DayWiseSales),
    },
    {
      path: "day_wise_sales_summary",
      element: React.createElement(DayWiseSalesSummary),
    },
    {
      path: "ticket_wise_sales",
      element: React.createElement(TicketWiseSales),
    },
    {
      path: "route_wise_sales",
      element: React.createElement(RouteWiseSales),
    },
    {
      path: "counter_wise_sales",
      element: React.createElement(CounterWiseSales),
    },
    {
      path: "all_counter_wise_sales",
      element: React.createElement(AllCounterWiseSales),
    },
    {
      path: "discount",
      element: React.createElement(DiscountList),
    },
  ];
  