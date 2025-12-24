import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const ExpenseReportExcel = ({ result }: any) => {
  // Format data for the CSV export
  const formattedData = result?.map((item: any, index: number) => ({
    index: index + 1, // Index starts from 1
    note: item?.note || "N/A",
    category: item?.dummyCategory || "Not Found",
    subCategory: item?.dummySubCategory || "Not Found",
    date: item?.dummyDate || "N/A",
    totalAmount: item?.totalAmount || "0.00",
  }));

  return (
    <CSVLink
      data={formattedData}
      headers={[
        { label: "Index", key: "index" },
        { label: "Note", key: "note" },
        { label: "Category", key: "category" },
        { label: "Sub-Category", key: "subCategory" },
        { label: "Date", key: "date" },
        { label: "Total Amount", key: "totalAmount" },
      ]}
      filename={`${appConfiguration?.appName} ◉ Expense Report.csv`}
    >
      <Button variant="tertiary" size="xs">
        Excel
      </Button>
    </CSVLink>
  );
};

export default ExpenseReportExcel;
