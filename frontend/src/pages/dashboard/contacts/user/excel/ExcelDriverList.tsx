import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const DriverListExcel = ({ result }: any) => {
  const formattedData = result?.map((sale: any, index: number) => ({
    index: index + 1,
    License: sale?.licensePhoto || 'N/A',
    Name: sale?.name || 'N/A',
    Contact: sale?.contactNo || 'N/A',
    Status: sale?.active ? "Active" : "Deactive",
  }));

  return (
    <CSVLink
      data={formattedData || []}
      headers={[
        { label: "Index", key: "index" },
        { label: "License", key: "License" },
        { label: "Full Name", key: "Name" },
        { label: "Contact No", key: "Contact" },
        { label: "Status", key: "Status" },
      ]}
      filename={`${appConfiguration?.appName} - Driver List Report.csv`}
    >
      <Button variant="tertiary" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default DriverListExcel;