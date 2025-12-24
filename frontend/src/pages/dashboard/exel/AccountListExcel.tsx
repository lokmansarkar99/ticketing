import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const AccountListExcel = ({ result }: any) => {
  const formattedData = result?.map((sale: any, index: number) => ({
    index: index + 1,
    AccountName: sale?.accountName || 'N/A',
    BankName: sale?.bankName || 'N/A',
    Type: sale?.accountType || 'N/A',
    OpeningBalance: sale?.openingBalance || 'N/A',
    CurrentBalance: sale?.currentBalance || 'N/A',
  }));

  return (
    <CSVLink
      data={formattedData || []}
      headers={[
        { label: "Index", key: "index" },
        { label: "Account Name", key: "AccountName" },
        { label: "Bank Name", key: "BankName" },
        { label: "Type", key: "Type" },
        { label: "Opening Balance", key: "OpeningBalance" },
        { label: "Current Balance", key: "CurrentBalance" },
      ]}
      filename={`${appConfiguration?.appName} - Counter List Report.csv`}
    >
      <Button variant="tertiary" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default AccountListExcel;