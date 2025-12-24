import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const UserWiseSalesReportExcel = ({ result, disabled }: any) => {
  const formattedData = result?.map((sale: any, index: number) => ({
    index: index + 1,
    class: sale?.class || 'N/A',
    status: sale?.status || 'N/A',
    seat: sale?.seat || 'N/A',
    unitPrice: sale?.unitPrice || 'N/A',
    fare: sale?.fare || 'N/A',
    discount: sale?.discount || 'N/A',
    departureDate: sale?.coachConfig?.departureDate || 'N/A',
    cancelBy: sale?.cancelBy || 'N/A',
    coachNo: sale?.coachConfig?.coachNo || 'N/A',
    routeName: sale?.coachConfig?.coach?.route?.routeName || 'N/A',
  }));


  return (
    <CSVLink
      data={formattedData || []}
      headers={[
        { label: "SL", key: "index" },
        { label: "Class", key: "class" },
        { label: "Status", key: "status" },
        { label: "Seat", key: "seat" },
        { label: "Unit Price", key: "unitPrice" },
        { label: "Fare", key: "fare" },
        { label: "Discount", key: "discount" },
        { label: "Travel Date", key: "departureDate" },
        { label: "Cancel By", key: "cancelBy" },
        { label: "Coach No", key: "coachNo" },
        { label: "Route", key: "routeName" },
      ]}
      filename={`${appConfiguration?.appName} - User Wise Sales Report.csv`}
    >
      <Button disabled={disabled} variant="green" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default UserWiseSalesReportExcel;