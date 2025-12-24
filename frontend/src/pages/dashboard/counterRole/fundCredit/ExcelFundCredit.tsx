import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

interface IUser {
  counter: {
    name: string;
  };
}

interface IFund {
  id: number;
  user: IUser;
  txId: string;
  paymentType: string;
  amount: number;
  status: string;
  date: string | Date;
}

interface ExcelFundCreditProps {
  result: IFund[];
}

const ExcelFundCredit: React.FC<ExcelFundCreditProps> = ({ result }) => {
  const formattedData = result?.map((fund, index) => ({
    index: index + 1,
    counterName: fund?.user?.counter?.name || "N/A",
    transactionId: fund.txId || "N/A",
    paymentType: fund.paymentType || "N/A",
    txId: fund.txId || "N/A",
    amount: fund?.amount?.toLocaleString() || "0",
    status: fund.status || "N/A",
    date: fund.date ? new Date(fund.date)?.toLocaleDateString("en-GB") : "N/A",
  }));

  return (
    <CSVLink
      data={formattedData || []}
      headers={[
        { label: "Index", key: "index" },
        { label: "Counter Name", key: "counterName" },
        { label: "Transaction ID", key: "transactionId" },
        { label: "Payment Type", key: "paymentType" },
        { label: "Amount", key: "amount" },
        { label: "Status", key: "status" },
        { label: "Payment Date", key: "date" },
      ]}
      filename={`${appConfiguration?.appName} - Fund Report.csv`}
    >
      <Button variant="tertiary" size="sm" className="px-8">
        Excel
      </Button>
    </CSVLink>
  );
};

export default ExcelFundCredit;
