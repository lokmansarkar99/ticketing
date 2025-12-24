import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const TodayOnlineHistoryExcel = ({ result }: any) => {
  const formattedData = result?.map((sale: any, index: number) => ({
    index: index + 1,
    coachNo: sale?.coachConfig?.coachNo || 'N/A',
    customerName: sale?.order?.customerName || 'N/A',
    phone: sale?.order?.phone || 'N/A',
    schedule: sale?.schedule || 'N/A',
    date: sale?.date ? new Date(sale.date).toLocaleDateString() : 'N/A',
    seat: sale?.seat || 'N/A',
    unitPrice: `${sale?.unitPrice || 0}`,
    status: sale?.status || 'N/A',
    paymentMethod: sale?.paymentMethod || 'N/A'
  }));

  return (
    <CSVLink
      data={formattedData || []}
      headers={[
        { label: "Index", key: "index" },
        { label: "Coach No", key: "coachNo" },
        { label: "Customer Name", key: "customerName" },
        { label: "Phone", key: "phone" },
        { label: "Schedule", key: "schedule" },
        { label: "Date", key: "date" },
        { label: "Seat", key: "seat" },
        { label: "Unit Price", key: "unitPrice" },
        { label: "Status", key: "status" },
        { label: "Payment Method", key: "paymentMethod" }
      ]}
      filename={`${appConfiguration?.appName} - Today's Sales Online Report.csv`}
    >
      <Button variant="tertiary" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default TodayOnlineHistoryExcel;