import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const HelperListExcel = ({ result }: any) => {
  const formattedData = result?.map((sale: any, index: number) => ({
    index: index + 1,
    name: sale?.name || 'N/A',
    contact: sale?.contactNo || 'N/A',
    status: sale?.active ? "Active" : "Deactive",
  }));

  return (
    <CSVLink
      data={formattedData || []}
      headers={[
        { label: "Index", key: "index" },
        { label: "Full Name", key: "name" },
        { label: "Contact No", key: "contact" },
        { label: "Status", key: "status" },
      ]}
      filename={`${appConfiguration?.appName} - Helper List Report.csv`}
    >
      <Button variant="tertiary" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default HelperListExcel;