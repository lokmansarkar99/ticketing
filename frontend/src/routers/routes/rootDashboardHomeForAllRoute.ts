import CallCenterDashboardHome from "@/components/common/navigation/callcenter/CallcenterDashboardHome";
import MigrateSeat from "@/components/common/navigation/callcenter/MigrateSeat";
import TodaySalesReport from "@/components/common/navigation/callcenter/TodaySalesReport";
import AccountDashboardHome from "@/pages/dashboard/accountsRole/accountDashboardHome/AccountDashboardHome";
import AdminDashboardHome from "@/pages/dashboard/admin/AdminDashboardHome";
import CancelTicketRequestList from "@/pages/dashboard/admin/cancelRequest/CancelTicketRequestList";
import FindCancelRequest from "@/pages/dashboard/admin/cancelRequest/FindCancelRequest";
import AddFuelPayment from "@/pages/dashboard/admin/fuel/AddFuelPayment";
import UserProfile from "@/pages/dashboard/contacts/user/UserProfile";
import CounterSalesReport from "@/pages/dashboard/counterRole/counter-wise-report/CounterSalesReport";
import CounterWiseReport from "@/pages/dashboard/counterRole/counter-wise-report/CounterWiseReport";
import CounterDashboardHome from "@/pages/dashboard/counterRole/counterHome/CounterDashboardHome";
import FundCredit from "@/pages/dashboard/counterRole/fundCredit/FundCreditList";
import SupervisorDashboardHome from "@/pages/dashboard/supervisor/SupervisorDashboardHome";
import CoachActiveInActiveList from "@/pages/dashboard/vehiclesSchedule/coach/configuration/CoachActiveInActiveList";
import ConfigurationList from "@/pages/dashboard/vehiclesSchedule/coach/configuration/ConfigurationList";
import UpdateCoachConfigNavigationForm from "@/pages/dashboard/vehiclesSchedule/coach/configuration/UpdateCoachConfigNavigationForm";
import React, { ReactNode } from "react";

export interface IRouteProps {
  path: string;
  element: ReactNode;
  loader?: any;
}

export const rootDasboardHomeRoutesAll: IRouteProps[] = [
  {
    path: "dashboard",
    element: React.createElement(AdminDashboardHome),
  },
  {
    path: "today_cancel_request",
    element: React.createElement(CancelTicketRequestList),
  },
  {
    path: "due_payment",
    element: React.createElement(AddFuelPayment),
  },
  {
    path:"find_cancel_request",
    element:React.createElement(FindCancelRequest)
  },
  {
    path:"update_coach_config",
    element:React.createElement(UpdateCoachConfigNavigationForm)
  },
    {
    path: "coach_active_inactive",
    element: React.createElement(CoachActiveInActiveList),
  },
  {
    path: "counter-fund",
    element: React.createElement(FundCredit),
  },
  {
    path: "board",
    element: React.createElement(FundCredit),
  },
    {
    path: "migrate-seat",
    element: React.createElement(MigrateSeat),
  },
];
export const rootCounterDasboardHomeRoutesAll: IRouteProps[] = [
  {
    path: "dashboard",
    element: React.createElement(AdminDashboardHome),
  },
  {
    path: "search-ticket",
    element: React.createElement(CounterDashboardHome),
  },
  {
    path: "coach-wise-report",
    element: React.createElement(CounterWiseReport),
  },
  {
    path: "sales-report",
    element: React.createElement(CounterSalesReport),
  },
  {
    path: "counter-fund",
    element: React.createElement(FundCredit),
  },
  {
    path: "profile",
    element: React.createElement(UserProfile),
  },
];
export const rootCallcenterDasboardHomeRoutesAll: IRouteProps[] = [
  {
    path: "dashboard",
    element: React.createElement(CallCenterDashboardHome),
  },
  {
    path: "coach-wise-report",
    element: React.createElement(CounterWiseReport),
  },
  {
    path: "todays-sales-report",
    element: React.createElement(TodaySalesReport),
  },
  {
    path: "migrate-seat",
    element: React.createElement(MigrateSeat),
  },
  {
    path: "profile",
    element: React.createElement(UserProfile),
  },
];
export const rootSubAdminDasboardHomeRoutesAll: IRouteProps[] = [
  {
    path: "dashboard",
    element: React.createElement(AdminDashboardHome),
  },
  {
    path: "coach_configs",
    element: React.createElement(ConfigurationList),
  },
  {
    path: "update_coach_configs",
    element: React.createElement(UpdateCoachConfigNavigationForm),
  },
  {
    path: "profile",
    element: React.createElement(UserProfile),
  },
];
export const rootSupervisorDashboardHome: IRouteProps[] = [
  {
    path: "dashboard",
    element: React.createElement(SupervisorDashboardHome),
  },
  {
    path: "profile",
    element: React.createElement(UserProfile),
  },
];
export const rootAccountsDashboardHome: IRouteProps[] = [
  {
    path: "dashboard",
    element: React.createElement(AccountDashboardHome),
  },
  {
    path: "profile",
    element: React.createElement(UserProfile),
  },
];
