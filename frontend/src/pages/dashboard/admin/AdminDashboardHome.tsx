import PageTransition from "@/components/common/effect/PageTransition";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useGetTodaysSaleAdminReportQuery } from "@/store/api/adminReport/adminReportApi";
import { FC } from "react";
import TodaySaleTabs from "./todaySale/TodaySaleTabs";
interface IReportSuite {}

const AdminDashboardHome: FC<IReportSuite> = () => {
  const { data: salesData, isLoading: salesLoading } =
    useGetTodaysSaleAdminReportQuery({});

  if (salesLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <div className="flex gap-2">
      <div className="w-[180px] mt-3">
        {/* sales information */}
        <div className="flex flex-col">
          <PageTransition className="border border-gray-400">
            {/* Header Bar */}
            <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
              Todays Sales
            </div>
            {/* Body */}
            <div className="bg-gray-100 dark:bg-background px-2 py-2">
              <p className="text-[12px] font-bold">
                {salesData?.data?.todaySales !== 0
                  ? salesData?.data?.todaySales
                  : 0}
              </p>
            </div>
          </PageTransition>

          <PageTransition className="border border-gray-400">
            {/* Header Bar */}
            <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
              Todays Online Sales
            </div>
            {/* Body */}
            <div className="bg-gray-100 dark:bg-background px-2 py-2">
              <p className="text-[12px] font-bold">
                {salesData?.data?.todayOnlineSales !== 0
                  ? salesData?.data?.todayOnlineSales
                  : 0}
              </p>
            </div>
          </PageTransition>
          <PageTransition className="border border-gray-400">
            {/* Header Bar */}
            <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
              Todays Online Ticket Sales
            </div>
            {/* Body */}
            <div className="bg-gray-100 dark:bg-background px-2 py-2">
              <p className="text-[12px] font-bold">
                {salesData?.data?.todayOnlineTicketCount !== 0
                  ? salesData?.data?.todayOnlineTicketCount
                  : 0}
              </p>
            </div>
          </PageTransition>
          <PageTransition className="border border-gray-400">
            {/* Header Bar */}
            <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
              Earn from Cancellation
            </div>
            {/* Body */}
            <div className="bg-gray-100 dark:bg-background px-2 py-2">
              <p className="text-[12px] font-bold">
                {salesData?.data?.todayTotalTicketCount !== 0
                  ? salesData?.data?.todayTotalTicketCount
                  : 0}
              </p>
            </div>
          </PageTransition>
          <PageTransition className="border border-gray-400">
            {/* Header Bar */}
            <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
              Todays Total Ticket Sales
            </div>
            {/* Body */}
            <div className="bg-gray-100 dark:bg-background px-2 py-2">
              <p className="text-[12px] font-bold">
                {salesData?.data?.todayTotalTicketCount !== 0
                  ? salesData?.data?.todayTotalTicketCount
                  : 0}
              </p>
            </div>
          </PageTransition>

          <PageTransition className="border border-gray-400">
            {/* Header Bar */}
            <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
              Todays Total Ticket Cancel
            </div>
            {/* Body */}
            <div className="bg-gray-100 dark:bg-background px-2 py-2">
              <p className="text-[12px] font-bold">
                {salesData?.data?.todayCancelTicketCount !== 0
                  ? salesData?.data?.todayCancelTicketCount
                  : 0}
              </p>
            </div>
          </PageTransition>
          <PageTransition className="border border-gray-400">
            {/* Header Bar */}
            <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
              Todays Deposit
            </div>
            {/* Body */}
            <div className="bg-gray-100 dark:bg-background px-2 py-2">
              <p className="text-[12px] font-bold">
                {salesData?.data?.todayCancelTicketCount !== 0
                  ? salesData?.data?.todayCancelTicketCount
                  : 0}
              </p>
            </div>
          </PageTransition>
        </div>
      </div>
      <PageWrapper className="-mt-5">
        {/* sales information */}
        <TodaySaleTabs />
      </PageWrapper>
    </div>
  );
};
export default AdminDashboardHome;
