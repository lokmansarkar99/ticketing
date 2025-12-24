import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const VehicleListExcel = ({ result }: any) => {
  // Format data for the CSV export
  const formattedData = result?.map((item: any, index: number) => ({
    index: index + 1, // Index starts from 1
    RegistrationNumber: item?.registrationNo || "N/A",
    ManufacturerCompany: item?.manufacturerCompany || "N/A",
    Model: item?.model || "N/A",
  }));

  return (
    <CSVLink
      data={formattedData}
      headers={[
        { label: "SN", key: "index" },
        { label: "Registration Number", key: "RegistrationNumber" },
        { label: "Manufacturer Company", key: "Manufacturer Company" },
        { label: "Model", key: "Model" },
      ]}
      filename={`${appConfiguration?.appName} ◉ Expense Report.csv`}
    >
      <Button variant="tertiary" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default VehicleListExcel;
