import AccountsDashboardLayout from "@/layouts/AccountsDashboardLayout";
import CounterDashboardLayout from "@/layouts/CounterDashboardLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import PublicLayout from "@/layouts/PublicLayout";
import SupervisorDashboardLayout from "@/layouts/SupervisorDashboardLayout";
import ErrorPage from "@/pages/ErrorPage";
import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { accountsAllLink } from "./routes/accounts/accounts";
import { adminReportingSuite } from "./routes/adminReportSuite";
import { contactsRoutes } from "./routes/contacts";
import { expensesRoutes } from "./routes/expense";
import { financialRoutes } from "./routes/financial";
import { publicRoutes } from "./routes/public";
import {
  rootAccountsDashboardHome,
  rootCallcenterDasboardHomeRoutesAll,
  rootCounterDasboardHomeRoutesAll,
  rootDasboardHomeRoutesAll,
  rootSubAdminDasboardHomeRoutesAll,
  rootSupervisorDashboardHome,
} from "./routes/rootDashboardHomeForAllRoute";
import { settingsRoutes } from "./routes/settingsRoutes";
import {
  acceptCoachLinks,
  supervisorCoachDetails,
  supervisorManagement,
  supervisorReportDetails,
} from "./routes/supervisor/supervisorReport";
import { vehiclesSchedule } from "./routes/vehiclesSchedule";
import AccountsRoutes from "./routeWrapper/Accounts";
import AdminRoutes from "./routeWrapper/AdminRoutes";
import CounterRoutes from "./routeWrapper/CounterRoutes";
import SupervisorRoutes from "./routeWrapper/SupervisorRoutes";
import { reportRoutes } from "./routes/report";
import SubAdminDashboardLayout from "@/layouts/SubAdminDashboardLayout";
import SubAdminRoutes from "./routeWrapper/SubAdminRoutes";
import CallcenterDashboardLayout from "@/layouts/CallcenterDashboardLayout";
import CallcenterRoutes from "./routeWrapper/CallcenterRoutes";
import CallCenterDashboardHome from "@/components/common/navigation/callcenter/CallcenterDashboardHome";

const routers = createBrowserRouter([
  {
    path: "/admin",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback="fallback----------">
        <AdminRoutes>
          <DashboardLayout />
        </AdminRoutes>
      </Suspense>
    ),
    children: [
      ...rootDasboardHomeRoutesAll,
      ...contactsRoutes,
      ...financialRoutes,
      ...expensesRoutes,
      ...vehiclesSchedule,
      ...adminReportingSuite,
      ...reportRoutes,
      ...settingsRoutes,
      {
        path: "ticket",
        // element: <CounterDashboardHome />,
        element: <CallCenterDashboardHome />,
      },
    ],
  },
  {
    path: "/counter",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback="fallback----------">
        <CounterRoutes>
          <CounterDashboardLayout />
        </CounterRoutes>
      </Suspense>
    ),
    children: [...rootCounterDasboardHomeRoutesAll, ...reportRoutes],
  },
  {
    path: "/callcenter",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback="fallback----------">
        <CallcenterRoutes>
          <CallcenterDashboardLayout />
        </CallcenterRoutes>
      </Suspense>
    ),
    children: [...rootCallcenterDasboardHomeRoutesAll, ...reportRoutes],
  },
  {
    path: "/subadmin",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback="fallback----------">
        <SubAdminRoutes>
          <SubAdminDashboardLayout />
        </SubAdminRoutes>
      </Suspense>
    ),
    children: [...rootSubAdminDasboardHomeRoutesAll],
  },
  {
    path: "/accounts",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback="fallback----------">
        <AccountsRoutes>
          <AccountsDashboardLayout />
        </AccountsRoutes>
      </Suspense>
    ),
    children: [...rootAccountsDashboardHome, ...accountsAllLink],
  },
  {
    path: "/guide",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback="fallback----------">
        <SupervisorRoutes>
          <SupervisorDashboardLayout />
        </SupervisorRoutes>
      </Suspense>
    ),
    children: [
      ...rootSupervisorDashboardHome,
      ...supervisorManagement,
      ...supervisorReportDetails,
      ...supervisorCoachDetails,
      ...acceptCoachLinks,
    ],
  },
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback="fallback --------------">
        <PublicLayout />
      </Suspense>
    ),
    children: [...publicRoutes],
  },
]);

export default routers;
