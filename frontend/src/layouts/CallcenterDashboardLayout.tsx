import CallcenterDashboardUpperNavigation from "@/components/common/navigation/callcenter/CallcenterDashboardUpperNavigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import UpperCallcenterDashboardSidebarLargeDevice from "@/components/common/navigation/callcenter/UpperCallcenterDashboardSidebarLargeDevice";

interface ICallcenterDashboardLayoutProps {}

const CallcenterDashboardLayout: FC<ICallcenterDashboardLayoutProps> = () => {
  

  return (
    <TooltipProvider>
      <Helmet>
        <meta name="viewport" content="width=1280" />
      </Helmet>
      <main
        className={cn("flex min-h-screen w-full flex-col", useFontShifter())}
      >
        {/* DASHBOARD SIDEBAR FOR LARGE DEVICES */}
        <UpperCallcenterDashboardSidebarLargeDevice />
        {/* <CallcenterDashboardSidebarLargeDevice /> */}
        <section
          className="flex flex-col sm:gap-4 transition-all"
        >
          {/* DASHBOARD UPPER NAVIGATION */}
          <CallcenterDashboardUpperNavigation />
          {/* DASHBOARD PLAYGROUND */}
          <section className="bg-muted/30  !w-[98.7%]  -mt-[2.5px] mb-1.5 rounded-md min-h-screen p-4 sm:px-6 sm:py-0 md:gap-8 overflow-x-hidden overflow-y-auto">
            <Outlet />
          </section>
        </section>
      </main>
    </TooltipProvider>
  );
};

export default CallcenterDashboardLayout;
