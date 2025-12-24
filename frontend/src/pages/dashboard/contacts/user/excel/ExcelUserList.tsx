import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const UserListExcel = ({ result }: any) => {
  const formattedData = result?.map((sale: any, index: number) => ({
    index: index + 1,
    userName: sale?.userName || 'N/A',
    contactNo: sale?.contactNo || 'N/A',
    role: sale?.role?.name || 'N/A',
    status: sale?.active ? "Active" : "Deactive",
  }));

  return (
    <CSVLink
      data={formattedData || []}
      headers={[
        { label: "Index", key: "index" },
        { label: "Full Name", key: "userName" },
        { label: "Contact No", key: "contactNo" },
        { label: "Role", key: "role" },
        { label: "Status", key: "status" },
      ]}
      filename={`${appConfiguration?.appName} - User List Report.csv`}
    >
      <Button variant="tertiary" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default UserListExcel;