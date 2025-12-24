import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const RouteListExcel = ({ result }: any) => {
  // Format data for the CSV export
  const formattedData = result?.map((item: any, index: number) => ({
    index: index + 1, // Index starts from 1
    routeName: item?.routeName || "N/A",
  }));

  return (
    <CSVLink
      data={formattedData}
      headers={[
        { label: "SN", key: "index" },
        { label: "Route Name", key: "routeName" },
      ]}
      filename={`${appConfiguration?.appName} ◉ Expense Report.csv`}
    >
      <Button variant="tertiary" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default RouteListExcel;
