import FuelCompanyList from "@/pages/dashboard/admin/fuel/FuelCompanyList";
import AddCoachAssignPage from "@/pages/dashboard/admin/reportSuite/AddCoachAssignPage";
import CoachAssignToCounterMaster from "@/pages/dashboard/admin/reportSuite/CoachAssignToCounterMasterList";
import DaybookReport from "@/pages/dashboard/admin/reportSuite/DaybookReport";
import ExpenseReport from "@/pages/dashboard/admin/reportSuite/ExpenseReport";
import InvestorReport from "@/pages/dashboard/admin/reportSuite/InvestorReport";
import PaymentReport from "@/pages/dashboard/admin/reportSuite/PaymentReport";
import ReportSuite from "@/pages/dashboard/admin/reportSuite/ReportSuite";
import UserWiseSalesReportAdmin from "@/pages/dashboard/admin/reportSuite/UserWiseSalesReportAdmin";
import React, { ReactNode } from "react";

export interface IRouteProps {
  path: string;
  element: ReactNode;
  loader?: any;
}

export const adminReportingSuite: IRouteProps[] = [
  {
    path: "reporting_suite",
    element: React.createElement(ReportSuite),
  },
  {
    path: "user_wise_report",
    element: React.createElement(UserWiseSalesReportAdmin),
  },
  {
    path: "fuel-management",
    element: React.createElement(FuelCompanyList),
  },
  {
    path: "payment_report",
    element: React.createElement(PaymentReport),
  },
  {
    path: "expense_report",
    element: React.createElement(ExpenseReport),
  },
  {
    path: "coach_assign_to_counter_master",
    element: React.createElement(CoachAssignToCounterMaster),
  },
  {
    path: "add_coach_assign",
    element: React.createElement(AddCoachAssignPage),
  },
  {
    path: "daybook_report",
    element: React.createElement(DaybookReport),
  },
  {
    path: "investor_report",
    element: React.createElement(InvestorReport),
  },
];
