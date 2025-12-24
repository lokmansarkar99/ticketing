// import SubAdminDashboardSidebarLargeDevices from "@/components/common/navigation/subAdmin/SubAdminDashboardSidebarLargeDevice";
import SubAdminDashboardUpperNavigation from "@/components/common/navigation/subAdmin/SubAdminDashboardUpperNavigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
// import { useAppContext } from "@/utils/hooks/useAppContext";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import UpperSubAdminDashboardSidebarLargeDevice from "@/components/common/navigation/subAdmin/UpperSubAdminDashboardSidebarLargeDevice";
import { DashboardFooter } from "@/components/shared/DashboardFooter";

interface ISubAdminDashboardLayoutProps {}

const SubAdminDashboardLayout: FC<ISubAdminDashboardLayoutProps> = () => {
  // const { sidebarOpen } = useAppContext();

  return (
    <TooltipProvider>
      <Helmet>
        <meta name="viewport" content="width=1280" />
      </Helmet>
      <main
        className={cn("flex min-h-screen  flex-col", useFontShifter())}
      >
        {/* DASHBOARD SIDEBAR FOR LARGE DEVICES */}
        {/* <SubAdminDashboardSidebarLargeDevices /> */}
        <UpperSubAdminDashboardSidebarLargeDevice />
        <section className="flex flex-col sm:gap-4 transition-all">
          {/* DASHBOARD UPPER NAVIGATION */}
          <SubAdminDashboardUpperNavigation />
          {/* DASHBOARD PLAYGROUND */}
          <section className="bg-muted/30  -mt-[2.5px] mb-1.5 rounded-md p-2 sm:px-6 sm:py-0 md:gap-8 overflow-x-hidden">
            <Outlet />
          </section>
        </section>
        <DashboardFooter />
      </main>
    </TooltipProvider>
  );
};

export default SubAdminDashboardLayout;
