import PageTransition from "@/components/common/effect/PageTransition";
import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAccountDashboardSummaryDataQuery } from "@/store/api/accounts/accountsDashboardApi";
import { FC } from "react";
import { LuClipboardCopy, LuClipboardPaste } from "react-icons/lu";
import CounterReportsList from "./CounterReportsList";
import SupervisorReportList from "./SupervisorReportList";

interface AccountHomeListProps {}

const AccountDashboardHome: FC<AccountHomeListProps> = () => {
  const { data: accounData, isLoading: accountDataLoading } =
    useGetAccountDashboardSummaryDataQuery({});
  if (accountDataLoading) {
    return <DetailsSkeleton />;
  }
  return (
    <section className="mt-2">
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-5 my-5">
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Received Amount</h2>
            <h2 className="mt-3">
              Total:{" "}
              {accounData?.data?.receivedAmount !== 0
                ? accounData?.data?.receivedAmount
                : 0}
            </h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Payment Amount</h2>
            <h2 className="mt-3">
              Total:{" "}
              {accounData?.data?.paymentAmount !== 0
                ? accounData?.data?.paymentAmount
                : 0}
            </h2>
          </div>
        </PageTransition>{" "}
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Expense Amount</h2>
            <h2 className="mt-3">
              Total:{" "}
              {accounData?.data?.expenseAmount !== 0
                ? accounData?.data?.expenseAmount
                : 0}
            </h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Current Balance</h2>
            <h2 className="mt-3">
              Total:{" "}
              {accounData?.data?.cashOnHand !== 0
                ? accounData?.data?.cashOnHand
                : 0}
            </h2>
          </div>
        </PageTransition>
      </div>
      <Tabs defaultValue="supervisor-report_list" className="my-2">
        <TabsList className="border">
          <TabsTrigger value="supervisor-report_list" className="font-bold">
            <LuClipboardCopy className="button-icon-size mr-1" />
            Supervisor Reports
          </TabsTrigger>
          <TabsTrigger value="counter-report_list" className="font-bold">
            {" "}
            <LuClipboardPaste className="button-icon-size mr-1" />
            Counter Reports
          </TabsTrigger>
        </TabsList>
        {/* CONFIG LIST CONTAINER  */}
        <TabsContent className="mt-8" value="supervisor-report_list">
          <SupervisorReportList />
        </TabsContent>
        {/* UPATE CONFIG LIST CONTAINER */}
        <TabsContent className="mt-8" value="counter-report_list">
          <CounterReportsList />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AccountDashboardHome;
