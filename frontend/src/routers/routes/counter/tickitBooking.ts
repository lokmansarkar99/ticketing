import OfflineSalesTab from "@/pages/dashboard/counterRole/sales/OfflineSalesTab";
import SalesTabAll from "@/pages/dashboard/counterRole/sales/SalesTabAll";
import React, { ReactNode } from "react";

export interface IRouteProps {
  path: string;
  element: ReactNode;
  loader?: any;
}

export const tickitSalesRoutes: IRouteProps[] = [
  {
    path: "todays-sale",
    element: React.createElement(SalesTabAll),
  },
  {
    path: "offline-sales",
    element: React.createElement(OfflineSalesTab),
  },
];
