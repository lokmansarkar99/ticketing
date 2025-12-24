import { useEffect, useState } from "react";
import { fallback } from "@/utils/constants/common/fallback";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
// import { appConfiguration } from "@/utils/constants/common/appConfiguration";
// import { useReactToPrint } from "react-to-print";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dateFormatter } from "@/utils/helpers/dateFormatter";
import { format } from "date-fns";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useGetExpenseReportQuery } from "@/store/api/extraExpense/extraExpenseApi";
import { useGetExpenseCategoreyAccountListQuery } from "@/store/api/accounts/expenseDashboardApi";
import { useGetExpenseSubCategoreyAccountListQuery } from "@/store/api/accounts/expenseSubCategory";
import { IExtraExpense } from "@/types/dashboard/extraExpense/extraExpense";
import { DataTable } from "@/components/common/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfExpenseReport from "@/pages/dashboard/pdf/PdfExpenseReport";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import ExpenseReportExcel from "@/pages/dashboard/exel/ExpenseReportExcel";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";

export interface IExpenseStateProps {
  expenseList: IExtraExpense[];
}

const ExpenseCategoryReport = () => {
  const { translate } = useCustomTranslator();
  const [expenseReportsState, setExpenseReportsState] = useState<any>({
    categoryId: null,
    subCategoryId: null,
    searchSupplier: "",
    from: new Date(),
    to: new Date(),
  });

  const [expenseState, setExpenseState] = useState<any>({
    expenseList: [],
  });

  const fromDate = expenseReportsState?.from
    ? dateFormatter(expenseReportsState?.from)
    : null;
  const toDate = expenseReportsState?.to
    ? dateFormatter(expenseReportsState?.to)
    : null;

  const dateRange = toDate
    ? toDate === fromDate
      ? fromDate
      : `${fromDate} to ${toDate}`
    : fromDate;

  // GET PAYMENTS REPORTS
  const { data: paymentReportsData } = useGetExpenseReportQuery({
    from:
      expenseReportsState?.from instanceof Date
        ? format(expenseReportsState.from, "yyyy-MM-dd")
        : undefined,
    to:
      expenseReportsState?.to instanceof Date
        ? format(expenseReportsState.to, "yyyy-MM-dd")
        : undefined,
    categoryId: expenseReportsState.categoryId,
    subCategoryId: expenseReportsState.subCategoryId,
  });

  useEffect(() => {
    if (paymentReportsData?.data?.length > 0) {
      const customizeExpense = paymentReportsData?.data?.map(
        (singleExpense: any, expenseIndex: number) => ({
          ...singleExpense,
          index: generateDynamicIndexWithMeta(
            paymentReportsData.data,
            expenseIndex
          ),
          dummyNote:singleExpense?.note || "",
          dummyCategory:
            singleExpense?.expenseCategoryAccount?.name || fallback.notFound,
          dummySubCategory:
            singleExpense?.expenseSubCategoryAccount?.name || fallback.notFound,
          dummyDate: singleExpense?.date,
          dummyTotalAmount:
            (singleExpense?.totalAmount?.toFixed(2) || fallback.amount) + "৳",
        })
      );
      setExpenseState((prevState: any) => ({
        ...prevState,
        expenseList: customizeExpense || [],
      }));
    }
  }, [paymentReportsData]);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: "Index",
    },
    {
      accessorKey: "dummyCategory",
      header: "Category Name",
    },
    {
      accessorKey: "dummySubCategory",
      header: "Sub-category Name",
    },
    {
      accessorKey: "dummyNote",
      header: "Note",
    },
    {
      accessorKey: "dummyDate",
      header: "Date",
    },
    {
      accessorKey: "dummyTotalAmount",
      header: "Total Amount",
    },
  ];

  // GET EXPENSE CATEGORIES QUERY
  const { data: expenseCategoriesData, isLoading: expenseCategoriesLoading } =
    useGetExpenseCategoreyAccountListQuery({});

  // GET EXPENSE SUB-CATEGORY QUERY
  const {
    data: expenseSubcategoriesData,
    isLoading: expenseSubcategoryLoading,
  } = useGetExpenseSubCategoreyAccountListQuery({});

  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );
  // const printSaleRef = useRef(null);

  // const handlePrint = useReactToPrint({
  //   content: () => printSaleRef.current,
  //   documentTitle: `${appConfiguration?.appName}_expense_category_report`,
  // });

  if (singleCmsLoading) {
    return <TableSkeleton columns={6} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "খরচ অ্যাকাউন্টের তালিকা এবং সকল তথ্য উপাত্ত",
          "Expense Account report list and all relevant information & data"
        )}
        heading={translate("খরচ তথ্য", "Expense Report")}
      >
        <ul className="flex space-x-3 w-full">
        <li>
          <ExpenseReportExcel result={expenseState?.expenseList} />
        </li>

        <li>
          <PDFDownloadLink
            document={<PdfExpenseReport result={expenseState?.expenseList} logo={singleCms} dateRange={dateRange}/>}
            fileName="expense_report.pdf"
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
            }}
          </PDFDownloadLink>
        </li>
      </ul>
        <TableToolbar alignment="responsive">
          <div className="flex flex-col lg:flex-row justify-end items-center space-x-2">
            <div className="flex space-x-2">
              {/* EXPENSE CATEGORY */}
              <InputWrapper
                labelFor="expenseCategoryId"
                label="Select Expense Category"
              >
                <Select
                  defaultValue={
                    expenseReportsState.categoryId?.toString() || ""
                  }
                  onValueChange={(value: string) =>
                    setExpenseReportsState((prevState: any) => ({
                      ...prevState,
                      categoryId: +value,
                    }))
                  }
                >
                  <SelectTrigger
                    className="w-[150px] lg:w-[200px]"
                    id="expenseCategoryId"
                  >
                    <SelectValue placeholder="Expense category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] w-[200px] overflow-y-auto">
                    {expenseCategoriesData?.data?.length > 0 &&
                      expenseCategoriesData?.data?.map(
                        (singleCategory: any) => (
                          <SelectItem
                            key={singleCategory?.id}
                            value={singleCategory?.id?.toString()}
                          >
                            {singleCategory?.name}
                          </SelectItem>
                        )
                      )}
                    {!expenseCategoriesData?.data?.length &&
                      expenseCategoriesLoading && (
                        <div className="flex justify-center w-full h-8 items-center bg-accent rounded-md">
                          <Loader />
                        </div>
                      )}
                  </SelectContent>
                </Select>
              </InputWrapper>

              {/* EXPENSE SUB-CATEGORY */}
              <InputWrapper
                labelFor="expenseSubcategoryId"
                label="Select Expense Subcategory"
              >
                <Select
                  defaultValue={
                    expenseReportsState.subCategoryId?.toString() || ""
                  }
                  onValueChange={(value: string) =>
                    setExpenseReportsState((prevState: any) => ({
                      ...prevState,
                      subCategoryId: +value,
                    }))
                  }
                >
                  <SelectTrigger
                    className="w-[150px] lg:w-[200px]"
                    id="expenseSubcategoryId"
                  >
                    <SelectValue placeholder="Expense subcategory" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] w-[200px] overflow-y-auto">
                    {expenseSubcategoriesData?.data?.length > 0 &&
                      expenseSubcategoriesData?.data
                        ?.filter(
                          (current: any) =>
                            expenseReportsState?.categoryId ===
                            current?.expenseCategoryId
                        )
                        ?.map((singleSubCategory: any) => (
                          <SelectItem
                            key={singleSubCategory?.id}
                            value={singleSubCategory?.id?.toString()}
                          >
                            {singleSubCategory?.name}
                          </SelectItem>
                        ))}
                    {!expenseSubcategoriesData?.data?.length &&
                      expenseSubcategoryLoading && (
                        <div className="flex justify-center w-full h-8 items-center bg-accent rounded-md">
                          <Loader />
                        </div>
                      )}
                  </SelectContent>
                </Select>
              </InputWrapper>
            </div>

            <InputWrapper label="Select Date Range" labelFor="date_range">
              <Popover>
                <PopoverTrigger id="date_range" asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left text-sm mx-0 px-2 font-normal",
                      !expenseReportsState.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {expenseReportsState?.from ? (
                      expenseReportsState.to ? (
                        `${dateFormatter(
                          expenseReportsState.from
                        )} - ${dateFormatter(expenseReportsState.to)}`
                      ) : (
                        dateFormatter(expenseReportsState.from)
                      )
                    ) : (
                      <span className="text-sm">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={expenseReportsState?.from}
                    selected={expenseReportsState}
                    onSelect={(date: any) =>
                      setExpenseReportsState((prevState: any) => ({
                        ...prevState,
                        from: date.from || undefined,
                        to: date.to || undefined,
                      }))
                    }
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </InputWrapper>
          </div>
        </TableToolbar>
        <DataTable columns={columns} data={expenseState.expenseList} />
      </TableWrapper>
    </PageWrapper>
  );
};

export default ExpenseCategoryReport;
