import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const StatusExel = ({ result }: any) => {
  const formattedData = result?.map((item: any) => ({
    counterId: item.counterId,
    counterName: item?.counterName,
    orderBy: item?.orderBy,
    phone: item?.phone,
    bookedCount: item?.bookedCount || 0,
    bookedSeat: item?.bookedSeat?.join(", "), 
    soldCount: item?.soldCount || 0,
    soldSeat: item?.soldSeat?.join(", "), 
  }));

  return (
    <CSVLink
      data={formattedData}
      headers={[
        { label: "Counter ID", key: "counterId" },
        { label: "Counter Name", key: "counterName" },
        { label: "Ordered By", key: "orderBy" },
        { label: "Phone", key: "phone" },
        { label: "Booked Count", key: "bookedCount" },
        { label: "Booked Seats", key: "bookedSeat" },
        { label: "Sold Count", key: "soldCount" },
        { label: "Sold Seats", key: "soldSeat" },
      ]}
      filename={`${appConfiguration?.appName} ◉ Counter Booking Status Report.csv`}
    >
      <Button variant="tertiary" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default StatusExel;
