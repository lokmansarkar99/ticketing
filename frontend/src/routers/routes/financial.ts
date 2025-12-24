import React from "react";
import { IRouteProps } from "./contacts";
import AccountList from "@/pages/dashboard/financial/account/AccountList";
import PartnerList from "@/pages/dashboard/financial/partner/PartnerList";
import FinancePaidFinanceList from "@/pages/dashboard/financial/finance/FinancePaidFinanceList";

export const financialRoutes: IRouteProps[] = [
  {
    path: "account_list",
    element: React.createElement(AccountList),
  },
  {
    path: "partner_list",
    element: React.createElement(PartnerList),
  },
  {
    path: "finance_list",
    element: React.createElement(FinancePaidFinanceList),
  },
];
