import React from "react";
import { IRouteProps } from "./contacts";
import ExpenseList from "@/pages/dashboard/expense/ExpenseList";
import ExpenseCategoryList from "@/pages/dashboard/expense/ExpenseCategoryList";

export const expensesRoutes: IRouteProps[] = [
  {
    path: "expense_list",
    element: React.createElement(ExpenseList),
  },
  {
    path: "expense_category_list",
    element: React.createElement(ExpenseCategoryList),
  },
];
