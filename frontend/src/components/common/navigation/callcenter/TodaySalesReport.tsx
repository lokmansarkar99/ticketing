import { useGetTodaysSaleAdminReportQuery } from "@/store/api/adminReport/adminReportApi";
import PageTransition from "../../effect/PageTransition";
import PageWrapper from "../../wrapper/PageWrapper";
import TableSkeleton from "../../skeleton/TableSkeleton";
import TodaySaleTabs from "@/pages/dashboard/admin/todaySale/TodaySaleTabs";

const TodaySalesReport = () => {
  const { data: salesData, isLoading: salesLoading } =
    useGetTodaysSaleAdminReportQuery({});
  if (salesLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <div className="flex gap-5">
      <div className="w-[180px]">
        <PageTransition className="border border-gray-400">
          {/* Header Bar */}
          <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
            Todays Sales
          </div>
          {/* Body */}
          <div className="bg-gray-100 px-2 py-2">
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
          <div className="bg-gray-100 px-2 py-2">
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
            Todays Total Sales
          </div>
          {/* Body */}
          <div className="bg-gray-100 px-2 py-2">
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
            Todays Cancel Ticket
          </div>
          {/* Body */}
          <div className="bg-gray-100 px-2 py-2">
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
            Todays Online Ticket
          </div>
          {/* Body */}
          <div className="bg-gray-100 px-2 py-2">
            <p className="text-[12px] font-bold">
              {salesData?.data?.todayOnlineTicketCount !== 0
                ? salesData?.data?.todayOnlineTicketCount
                : 0}
            </p>
          </div>
        </PageTransition>
      </div>
      <PageWrapper>
        {/* table design */}
        <TodaySaleTabs />
      </PageWrapper>
    </div>
  );
};

export default TodaySalesReport;
