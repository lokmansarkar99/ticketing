import { useRef, useState } from "react";
import EmptyTableCell from "@/components/ui/emptyTableCell";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fallback } from "@/utils/constants/common/fallback";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { useReactToPrint } from "react-to-print";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExpenseSubCategoryPrint from "@/pages/dashboard/printLabel/ExpenseSubCategoryReportPrint";
import PdfExpenseSubCategoryReport from "@/pages/dashboard/pdf/PdfExpenseSubCategoryReport";
import { Heading } from "@/components/common/typography/Heading";

const categoryList = [
  { name: "Breakfast", amount: 150, note: "Includes coffee and bagels" },
  { name: "Lunch", amount: 250, note: "Combo meal with drink" },
  { name: "Breakfast", amount: 300, note: "Includes dessert and appetizer" },
  { name: "Lunch", amount: 100, note: "Afternoon tea with biscuits" },
  { name: "Desserts", amount: 120, note: "Cakes and ice cream" },
];

const categoryOptions = [
  { id: 0, name: "All" },
  { id: 1, name: "Lunch" },
  { id: 2, name: "Breakfast" },
  { id: 3, name: "Desserts" },
];

const ExpenseSubCategoryReport = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredData, setFilteredData] = useState(categoryList);


  const totalAmount = filteredData.reduce(
    (acc, category) => acc + category.amount,
    0
  );

  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );
  const printSaleRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_expense_sub_category_report`,
  });

  // Filter data based on selected category
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === "All") {
      setFilteredData(categoryList);
    } else {
      setFilteredData(categoryList.filter((item) => item.name === value));
    }
  };

  if (singleCmsLoading) {
    return <Loader />;
  }

  return (
    <section className="pt-4">
      <div className="flex justify-between items-center mb-4">
        <ul className="flex space-x-3">
          <li>
            <PDFDownloadLink
              document={<PdfExpenseSubCategoryReport result={categoryList} singleCms={singleCms}/>}
              fileName="expense_sub_category_report.pdf"
            >
              {
                //@ts-ignore
                (params) => {
                  const { loading } = params;
                  return loading ? (
                    <Button
                      disabled
                      className="transition-all duration-150"
                      variant="destructive"
                      size="xs"
                    >
                      <Loader /> Pdf
                    </Button>
                  ) : (
                    <Button variant="destructive" size="xs">
                      Pdf
                    </Button>
                  );
                }
              }
            </PDFDownloadLink>
          </li>
          <li>
            <Button onClick={handlePrint} variant="destructive" size="xs">
              Print
            </Button>
          </li>
        </ul>

        <div className="flex space-x-4">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.id} value={option.name}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Heading size={"h5"}>Expense Sub Category Report</Heading>
        <div className="-mx-2 border overflow-hidden">
          <Table className="overflow-hidden">
            <TableCaption className="mt-0 border-t-[0.5px]">
              A list of your expense sub category reports
            </TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                {["Index", "Expense SubCategory Name", "Note", "Amount"].map(
                  (header) => (
                    <TableHead key={header} className="border-r">
                      {header}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((singleCategory, index) => (
                  <TableRow key={index}>
                    <TableCell className="border-r">
                      {generateDynamicIndexWithMeta(filteredData, index)}
                    </TableCell>
                    <TableCell className="border-r">
                      {singleCategory.name}
                    </TableCell>
                    <TableCell className="border-r">
                      {singleCategory.note}
                    </TableCell>
                    <TableCell>
                      {singleCategory.amount?.toFixed(2) || fallback.amount}৳
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
              <TableRow className="font-semibold">
                <TableCell>Total Amount</TableCell>
                <EmptyTableCell item={2} className="custom-table" />
                <TableCell className="border-l">
                  {totalAmount.toFixed(2)}৳
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="invisible hidden -left-full">
        {filteredData.length > 0 && (
          <ExpenseSubCategoryPrint
            ref={printSaleRef}
            categoryData={filteredData}
            logo={singleCms?.data}
          />
        )}
      </div>
    </section>
  );
};

export default ExpenseSubCategoryReport;
