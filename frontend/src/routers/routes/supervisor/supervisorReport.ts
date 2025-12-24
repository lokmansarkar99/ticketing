import UserProfile from "@/pages/dashboard/contacts/user/UserProfile";
import AcceptCochBySupervisorOrHelperDriver from "@/pages/dashboard/supervisor/AcceptCochBySupervisorOrHelperDriver";
import CoachDetailsForSupervisor from "@/pages/dashboard/supervisor/CoachDetailsForSupervisor";
import ExpenseCategoryList from "@/pages/dashboard/supervisor/expense/ExpenseCategoreyList";
import SupervisorExpenseList from "@/pages/dashboard/supervisor/expense/SupervisorExpenseList";
import SupervisorManagement from "@/pages/dashboard/supervisor/SupervisorManagement";
import SupervisorReport from "@/pages/dashboard/supervisor/SupervisorReport";
import React, { ReactNode } from "react";

export interface IRouteProps {
  path: string;
  element: ReactNode;
  loader?: any;
}

export const supervisorManagement: IRouteProps[] = [
  {
    path: "profile",
    element: React.createElement(UserProfile),
  },
  {
    path: "supervisor-management",
    element: React.createElement(SupervisorManagement),
  },

  {
    path: "expense-management",
    element: React.createElement(SupervisorExpenseList),
  },
  {
    path: "expense-categorey",
    element: React.createElement(ExpenseCategoryList),
  },
];
export const supervisorCoachDetails: IRouteProps[] = [
  {
    path: "coach-details/:coachId",
    element: React.createElement(CoachDetailsForSupervisor),
  },
];
export const supervisorReportDetails: IRouteProps[] = [
  {
    path: "supervisor-report",
    element: React.createElement(SupervisorReport),
  },
];
export const acceptCoachLinks: IRouteProps[] = [
  {
    path: "coach-update",
    element: React.createElement(AcceptCochBySupervisorOrHelperDriver),
  },
];
