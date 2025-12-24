// import { Helmet } from "react-helmet-async";
// import CounterDashboardUpperNavigation from "@/components/common/navigation/counter/CounterDashboardUpperNavigation";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { cn } from "@/lib/utils";
// import { useFontShifter } from "@/utils/hooks/useFontShifter";
// import { FC } from "react";
// import { Outlet } from "react-router-dom";
// import UpperCounterDashboardSidebarLargeDevices from "@/components/common/navigation/counter/UpperCounterDashboardSidebarLargeDevices";
// import { DashboardFooter } from "@/components/shared/DashboardFooter";

// interface ICounterDashboardLayoutProps {}

// const CounterDashboardLayout: FC<ICounterDashboardLayoutProps> = () => {
//   return (
//     <TooltipProvider>
//       {/* 👇 This overrides ONLY when this layout is active */}
//       <Helmet>
//         {/* <meta name="viewport" content="width=1280" /> */}
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//       </Helmet>

//       <main className={cn("flex min-h-screen  flex-col", useFontShifter())}>
//         {/* DASHBOARD SIDEBAR FOR LARGE DEVICES */}
//         <UpperCounterDashboardSidebarLargeDevices />
//         {/* <CounterDashboardSidebarLargeDevices /> */}
//         <section className="flex flex-col sm:gap-4 transition-all">
//           {/* DASHBOARD UPPER NAVIGATION */}
//           <CounterDashboardUpperNavigation />
//           {/* DASHBOARD PLAYGROUND */}
//           {/* <section className="bg-muted/30  -mt-[2.5px] mb-1.5 rounded-md p-2 sm:px-6 sm:py-0 md:gap-8 overflow-x-hidden">
//             <Outlet />
//           </section> */}
//           <section className="bg-muted/30 min-w-[1280px] -mt-[2.5px] mb-1.5 rounded-md p-2 sm:px-6 sm:py-0 md:gap-8 overflow-x-auto">
//             <div className="">
//               <Outlet />
//             </div>
//           </section>
//         </section>
//         <DashboardFooter />
//       </main>
//     </TooltipProvider>
//   );
// };

// export default CounterDashboardLayout;


import { Helmet } from "react-helmet-async";
import CounterDashboardUpperNavigation from "@/components/common/navigation/counter/CounterDashboardUpperNavigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import UpperCounterDashboardSidebarLargeDevices from "@/components/common/navigation/counter/UpperCounterDashboardSidebarLargeDevices";
import { DashboardFooter } from "@/components/shared/DashboardFooter";

interface ICounterDashboardLayoutProps {}

const CounterDashboardLayout: FC<ICounterDashboardLayoutProps> = () => {
  

  return (
    <TooltipProvider>
      {/* 👇 This overrides ONLY when this layout is active */}
      <Helmet>
        <meta name="viewport" content="width=1450" />
      </Helmet>

      <main
        className={cn("flex min-h-screen w-full flex-col", useFontShifter())}
      >
        {/* DASHBOARD SIDEBAR FOR LARGE DEVICES */}
        <UpperCounterDashboardSidebarLargeDevices />
        {/* <CounterDashboardSidebarLargeDevices /> */}
        <section
          className="flex flex-col sm:gap-4 transition-all"
        >
          {/* DASHBOARD UPPER NAVIGATION */}
          <CounterDashboardUpperNavigation />
          {/* DASHBOARD PLAYGROUND */}
          <section className="bg-muted/30  -mt-[2.5px] mb-1.5 rounded-md  p-2 sm:px-6 sm:py-0 md:gap-8 overflow-x-hidden overflow-y-auto">
            <Outlet />
          </section>
        </section>
        <DashboardFooter/>
      </main>
    </TooltipProvider>
  );
};

export default CounterDashboardLayout;

