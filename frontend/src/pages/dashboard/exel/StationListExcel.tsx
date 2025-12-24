import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const StationListExcel = ({ result }: any) => {
  // Format data for the CSV export
  const formattedData = result?.map((item: any, index: number) => ({
    index: index + 1, // Index starts from 1
    StationName: item?.name || "N/A",
    Status: item?.isActive ? "Active" : "Inactive",
  }));

  return (
    <CSVLink
      data={formattedData}
      headers={[
        { label: "SN", key: "index" },
        { label: "Station Name", key: "StationName" },
        { label: "Status", key: "Status" },
      ]}
      filename={`${appConfiguration?.appName} ◉ Expense Report.csv`}
    >
      <Button variant="tertiary" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default StationListExcel;
