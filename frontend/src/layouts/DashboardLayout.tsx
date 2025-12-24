
// import DashboardUpperNavigation from "@/components/common/navigation/DashboardUpperNavigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import UpdateCoachConfigNavigationForm from "@/pages/dashboard/vehiclesSchedule/coach/configuration/UpdateCoachConfigNavigationForm";
import { closeModal } from "@/store/api/user/coachConfigModalSlice";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CallcenterDashboardUpperNavigation from "@/components/common/navigation/callcenter/CallcenterDashboardUpperNavigation";
import AdminDashboardSidebarLargeDevices from "@/components/common/navigation/AdminDashboardSidebarLargeDevices";
import { DashboardFooter } from "@/components/shared/DashboardFooter";

interface IDashboardLayoutProps { }

const DashboardLayout: FC<IDashboardLayoutProps> = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isModalOpen = useSelector(
    (state: any) => state.coachConfigModal.isModalOpen
  );
  const modalVariants = {
    hidden: { opacity: 0, y: -100 }, // Slide from above
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Animate in
    exit: { opacity: 0, y: -100, transition: { duration: 0.5 } }, // Animate out
  };
  return (
    <TooltipProvider>
      <Helmet>
        <meta name="viewport" content="width=1280" />
      </Helmet>
      <main
        className={cn("flex w-full flex-col", useFontShifter())}
      >
        {/* DASHBOARD SIDEBAR FOR LARGE DEVICES */}
        <AdminDashboardSidebarLargeDevices />
        <section
          className={cn(
            "flex flex-col sm:gap-4 transition-all"
          )}
        >
          {/* DASHBOARD UPPER NAVIGATION */}
          {
            location?.pathname === "/admin/ticket" && <CallcenterDashboardUpperNavigation />
          }
          {/* {
            location?.pathname !== "/admin/ticket" && <DashboardUpperNavigation />
          } */}

          {/* DASHBOARD PLAYGROUND */}
          <section className="bg-muted/30 backdrop-blur-sm -mt-[2.5px] mb-1.5 rounded-md p-4 sm:px-6 sm:py-0 md:gap-8 overflow-x-hidden overflow-y-auto">
            <Outlet />
          </section>
        </section>
        {/* {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-7xl px-10 py-6 mx-auto bg-background rounded-lg shadow-lg">
             
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => dispatch(closeModal())}
                aria-label="Close Modal"
              >
                &times;
              </button>
              <div className="lg:px-10 py-6 lg:h-[70vh] h-[550px] overflow-y-auto">
                <UpdateCoachConfigNavigationForm />
              </div>{" "}
            </div>
          </div>
        )} */}

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              {isModalOpen && (
                <div className="max-h-[90vh] overflow-auto relative lg:!w-11/12 w-11/12 py-11 px-5 bg-background border border-primary/50 border-dashed rounded-lg backdrop-blur-[2px]">
                  <button
                    onClick={() => dispatch(closeModal())}
                    className="absolute top-4 right-4 text-red-500 font-bold"
                  >
                    Close
                  </button>
                  <UpdateCoachConfigNavigationForm />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <DashboardFooter/>
      </main>
    </TooltipProvider>
  );
};

export default DashboardLayout;
