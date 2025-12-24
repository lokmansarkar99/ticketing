import AccountsDashboardSidebarLargeDevices from "@/components/common/navigation/accounts/AccountsDashboardSidebarLargeDevices";
import AccountsDashboardUpperNavigation from "@/components/common/navigation/accounts/AccountsDashboardUpperNavigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/utils/hooks/useAppContext";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface IAccountsDashboardLayoutProps {}

const AccountsDashboardLayout: FC<IAccountsDashboardLayoutProps> = () => {
  const { sidebarOpen } = useAppContext();

  return (
    <TooltipProvider>
      <Helmet>
        <meta name="viewport" content="width=1280" />
      </Helmet>
      <main
        className={cn("flex min-h-screen w-full flex-col", useFontShifter())}
      >
        {/* DASHBOARD SIDEBAR FOR LARGE DEVICES */}
        <AccountsDashboardSidebarLargeDevices />
        <section
          className={cn(
            "flex flex-col sm:gap-4 transition-all",
            sidebarOpen ? "lg:pl-[280px]" : "lg:pl-14"
          )}
        >
          {/* DASHBOARD UPPER NAVIGATION */}
          <AccountsDashboardUpperNavigation />
          {/* DASHBOARD PLAYGROUND */}
          <section className="bg-muted/30 backdrop-blur-sm !w-[98.7%] ml-[13px] -mt-[2.5px] mb-1.5 rounded-md min-h-screen p-4 sm:px-6 sm:py-0 md:gap-8 overflow-x-hidden overflow-y-auto">
            <Outlet />
          </section>
        </section>
      </main>
    </TooltipProvider>
  );
};

export default AccountsDashboardLayout;
