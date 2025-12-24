import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useGetTodaysSaleAdminReportQuery } from "@/store/api/adminReport/adminReportApi";
import TodaySalesHistory from "./TodaySalesHistory";
import CancelHistory from "./CancelHistory";
import OnlineHistory from "./OnlineHistory";
import OnlineHistoryCancel from "./OnlineHistoryCancel";
import TodayMigrateHistory from "./TodayMigrateHistory";

const TodaySaleTabs = () => {
  const { data: salesData, isLoading: salesLoading } =
    useGetTodaysSaleAdminReportQuery({});
  if (salesLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <Tabs defaultValue="todaySalesHistory" className="">
      <TabsContent value="todaySalesHistory" className="m-0">
        <TodaySalesHistory salesData={salesData?.data} />
      </TabsContent>
      {/* ACCEPT */}
      <TabsContent value="cancelHistory">
        <CancelHistory salesData={salesData?.data} />
      </TabsContent>
      {/* CANCEL */}
      <TabsContent value="onlineHistory">
        <OnlineHistory salesData={salesData?.data} />
      </TabsContent>
      <TabsContent value="onlineHistoryCancel">
        <OnlineHistoryCancel salesData={salesData?.data} />
      </TabsContent>
      <TabsContent value="onlineMigrateHistory">
        <TodayMigrateHistory salesData={salesData?.data} />
      </TabsContent>
    </Tabs>
  );
};

export default TodaySaleTabs;
