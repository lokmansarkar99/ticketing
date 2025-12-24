import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const CounterWiseSalesReportExcel = ({ result, disabled }: any) => {
  const formattedData = result?.map((sale: any, index: number) => ({
    index: index + 1,
    counter: sale?.counter || 'N/A',
    userName: sale?.userName || 'N/A',
    totalSold: sale?.totalSold || 'N/A',
    totalCancel: sale?.totalCancel || 'N/A',
    actualSold: sale?.actualSold || 'N/A',
    totalFare: sale?.totalFare || 'N/A',
    refundAmount: sale?.refundAmount || 'N/A',
    totalCommission: sale?.totalCommission || 'N/A',
    deposit: sale?.deposit || 'N/A',
  }));


  return (
    <CSVLink
      data={formattedData || []}
      headers={[
        { label: "SL", key: "index" },
        { label: "Counter", key: "counter" },
        { label: "User Name", key: "userName" },
        { label: "Total Sold", key: "totalSold" },
        { label: "Total Cancel", key: "totalCancel" },
        { label: "Actual Sold", key: "actualSold" },
        { label: "Total Fare", key: "totalFare" },
        { label: "Refund Amount", key: "refundAmount" },
        { label: "Total Commission", key: "totalCommission" },
        { label: "Deposit", key: "deposit" },
      ]}
      filename={`${appConfiguration?.appName} - Counter Wise Sales Report.csv`}
    >
      <Button disabled={disabled} variant="default" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default CounterWiseSalesReportExcel;