import DetailsOfReport from "@/pages/dashboard/accountsRole/accountDashboardHome/DetailsOfReport";
import AccountsManagement from "@/pages/dashboard/accountsRole/accountsManagement/AccountsManagement";
import CollectionList from "@/pages/dashboard/accountsRole/collectionManagement/CollectionList";
import ExpenseList from "@/pages/dashboard/accountsRole/expenseManagement/addExpense/ExpenseList";
import AccountsExpenseCategoryList from "@/pages/dashboard/accountsRole/expenseManagement/expenseCategorey/AccountsExpenseCategoryList";
import ExpenseCategoryReport from "@/pages/dashboard/accountsRole/expenseManagement/expenseCategorey/ExpenseCategoryReport";
import ExpenseSubCategoryReport from "@/pages/dashboard/accountsRole/expenseManagement/expenseCategorey/ExpenseSubCategoryReport";
import AccountantExpenseSubCategoreyList from "@/pages/dashboard/accountsRole/expenseManagement/expenseSubCategorey/AccountantExpenseSubCategoreyList";
import TripNoWiseReport from "@/pages/dashboard/accountsRole/expenseManagement/TripNoWiseReport/TripNoWiseReport";
import ProfitandLoseReport from "@/pages/dashboard/accountsRole/ProfitandLossReport/ProfitandLoseReport";
import UserProfile from "@/pages/dashboard/contacts/user/UserProfile";
import React, { ReactNode } from "react";

export interface IRouteProps {
  path: string;
  element: ReactNode;
  loader?: any;
}

export const accountsAllLink: IRouteProps[] = [
  {
    path: "profile",
    element: React.createElement(UserProfile),
  },
  {
    path: "accounts_management",
    element: React.createElement(AccountsManagement),
  },
  {
    path: "expense_category_account",
    element: React.createElement(AccountsExpenseCategoryList),
  },
  {
    path: "expense_sub_category_account",
    element: React.createElement(AccountantExpenseSubCategoreyList),
  },
  {
    path: "expense_account",
    element: React.createElement(ExpenseList),
  },
  {
    path: "expense_category_report",
    element: React.createElement(ExpenseCategoryReport),
  },
  {
    path: "expense_sub_category_report",
    element: React.createElement(ExpenseSubCategoryReport),
  },
  {
    path: "profit_and_loss",
    element: React.createElement(ProfitandLoseReport),
  },
  {
    path: "trip-no-wise-report",
    element: React.createElement(TripNoWiseReport),
  },
  {
    path: "dashboard/report_details_account/:id",
    element: React.createElement(DetailsOfReport),
  },
  {
    path: "collection_management",
    element: React.createElement(CollectionList),
  },
];
