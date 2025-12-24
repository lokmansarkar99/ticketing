import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const CounterListExcel = ({ result }: any) => {
  const formattedData = result?.map((sale: any, index: number) => ({
    index: index + 1,
    CounterName: sale?.name || 'N/A',
    MobileNo: sale?.mobile || 'N/A',
    ContactPerson: sale?.primaryContactPersonName || 'N/A',
    Type: sale?.type || 'N/A',
    Status: sale?.status ? "Active" : 'Deactive',
  }));

  return (
    <CSVLink
      data={formattedData || []}
      headers={[
        { label: "Index", key: "index" },
        { label: "Counter Name", key: "CounterName" },
        { label: "Mobile No", key: "MobileNo" },
        { label: "Contact Person", key: "ContactPerson" },
        { label: "Type", key: "Type" },
        { label: "Status", key: "Status" },
      ]}
      filename={`${appConfiguration?.appName} - Counter List Report.csv`}
    >
      <Button variant="tertiary" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default CounterListExcel;