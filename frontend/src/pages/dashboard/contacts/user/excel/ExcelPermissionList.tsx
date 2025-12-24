import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const PermissionListExcel = ({ result }: any) => {
  const formattedData = result?.map((sale: any, index: number) => ({
    index: index + 1,
    name: sale?.name || 'N/A',
    permissionType: sale?.permissionType?.name || 'N/A',
  }));

  return (
    <CSVLink
      data={formattedData || []}
      headers={[
        { label: "Index", key: "index" },
        { label: "Name", key: "name" },
        { label: "Permission Type", key: "permissionType" },
      ]}
      filename={`${appConfiguration?.appName} - Permission List Report.csv`}
    >
      <Button variant="tertiary" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default PermissionListExcel;