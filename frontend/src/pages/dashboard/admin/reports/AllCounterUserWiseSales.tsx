
import { useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Loader } from "@/components/common/Loader";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Printer,
  // MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
// import { NetDepositCalculation } from "./NetDepositeCalculation";
import { useLazyGetUserWiseSaleAdminReportByCounterQuery } from "@/store/api/adminReport/adminReportApi";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import { TableToolbar, TableWrapper } from "@/components/common/wrapper/TableWrapper";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { LuDownload } from "react-icons/lu";
import { ColumnDef } from "@tanstack/react-table";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfCounterWiseSalesReport from "../../pdf/PdfCounterWiseSalesReport";
import CounterWiseSalesReportExcel from "../../exel/CounterWiseSalesReportExcel";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useReactToPrint } from "react-to-print";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import PrintCounterWiseSalesReport from "../../printLabel/PrintCounterWiseSalesReport";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import PdfRoleList from "../../contacts/user/pdf/PdfRole";

export interface IAllCounterUserWiseSalesStateProps {
  fromCalenderOpen: boolean;
  toCalenderOpen: boolean;
  fromDate: Date | null;
  toDate: Date | null;
  counterId: string;
  dateType: "Purchase" | "Journey" | "";
  orderStatus: "Pending" | "Success" | "Cancelled" | "";
}

const AllCounterUserWiseSales = () => {
  const { data: singleCms } = useGetSingleCMSQuery(
    {}
  );
  const [allCounterUserWiseSalesState, setAllCounterUserWiseSalesState] =
    useState<IAllCounterUserWiseSalesStateProps>({
      fromCalenderOpen: false,
      toCalenderOpen: false,
      fromDate: null,
      toDate: null,
      counterId: "",
      dateType: "",
      orderStatus: "",
    });
  const [trigger, { data: counterWiseReportData, isFetching }] = useLazyGetUserWiseSaleAdminReportByCounterQuery()

  const { translate } = useCustomTranslator();

  const { data: stationsData, isLoading: stationsLoading } =
    useGetCountersQuery({
      page: 1,
      size: 99999999,
    }) as any;


  const dateTypes = [
    { id: "Purchase", name: "Purchase Date" },
    { id: "Journey", name: "Journey Date" },
  ];

  const orderStatuses = [
    { id: "Success", name: "Completed" },
    { id: "Pending", name: "Pending" },
    { id: "Cancelled", name: "Cancelled" },
  ];

    const printSaleRef = useRef(null);
  
    const handlePrint = useReactToPrint({
      content: () => printSaleRef.current,
      documentTitle: `${appConfiguration?.appName}_All_Counter_User_Wise_Sales`,
    });
  
    const invoicePrintHandler = () => {
      handlePrint();
    };

  // search handler 
  const handleSearch = () => {
    const { fromDate, toDate, dateType, counterId, orderStatus } = allCounterUserWiseSalesState;
    if (!fromDate || !toDate) {
      alert(translate("দয়া করে তারিখ নির্বাচন করুন", "Please select dates"));
      return;
    }
    if (fromDate > toDate) {
      alert(
        translate(
          "শুরুর তারিখ শেষ তারিখের চেয়ে বড় হতে পারে না",
          "From date cannot be greater than To date"
        )
      );
      return;
    }

    const formattedFromDate = format(fromDate, "yyyy-MM-dd");
    const formattedToDate = format(toDate, "yyyy-MM-dd");

    trigger({
      counterId,
      orderStatus,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      dateType,
    });
  }
  const handleReset = () => {
    setAllCounterUserWiseSalesState({
      fromCalenderOpen: false,
      toCalenderOpen: false,
      fromDate: null,
      toDate: null,
      counterId: "",
      dateType: "",
      orderStatus: "",
    })
  }

  // table related start 
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 20,
    meta: {
      page: 0,
      size: 20,
      total: 100,
      totalPage: 1,
    },
  });

  const columns: ColumnDef<unknown>[] = [
    {
      accessorKey: "index",
      header: translate("সি.না", "SL"),
      accessorFn: (_, index) => `${index < 9 ? "0" : ""}${index + 1}`,
      footer: () => {
        return (
          <div className="text-left font-bold">
            Total:
          </div>
        );
      },
    },

    {
      accessorKey: "counter",
      header: translate("নাম", "Counter Name"),
      //@ts-ignore
      accessorFn: (row) => row.counter ?? "Unknown counter",
    },
    {
      accessorKey: "userName",
      header: translate("নাম", "User Name"),
      //@ts-ignore
      accessorFn: (row) => row.userName ?? "Unknown userName",
    },
    // {
    //   accessorKey: "nonAc",
    //   header: translate("নাম", "Non-Ac"),
    //   //@ts-ignore
    //   accessorFn: (row) => row.nonAc ?? "Unknown userName",
    // },
    // {
    //   accessorKey: "ac",
    //   header: translate("নাম", "Ac"),
    //   //@ts-ignore
    //   accessorFn: (row) => row.ac ?? "Unknown userName",
    // },
    {
      accessorKey: "totalSold",
      header: translate("নাম", "Total Sold"),
      //@ts-ignore
      accessorFn: (row) => row.totalSold ?? "Unknown userName",
      footer: () => {
        const total = (counterWiseReportData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.totalSold ?? 0),
          0
        );

        return (
          <div className="font-bold">
            {total.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "totalCancel",
      header: translate("নাম", "Total Cancel"),
      //@ts-ignore
      accessorFn: (row) => row.totalCancel ?? "Unknown userName",
      footer: () => {
        const total = (counterWiseReportData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.totalCancel ?? 0),
          0
        );

        return (
          <div className="font-bold">
            {total.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "actualSold",
      header: translate("নাম", "Actual Sold"),
      //@ts-ignore
      accessorFn: (row) => row.actualSold ?? "Unknown userName",
      footer: () => {
        const total = (counterWiseReportData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.actualSold ?? 0),
          0
        );

        return (
          <div className="font-bold">
            {total.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "totalFare",
      header: translate("নাম", "Total Fare"),
      //@ts-ignore
      accessorFn: (row) => row.totalFare ?? "Unknown userName",
      footer: () => {
        const total = (counterWiseReportData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.totalFare ?? 0),
          0
        );

        return (
          <div className="font-bold">
            {total.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "refundAmount",
      header: translate("নাম", "Total Refund"),
      //@ts-ignore
      accessorFn: (row) => row.refundAmount ?? "Unknown userName",
      footer: () => {
        const total = (counterWiseReportData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.refundAmount ?? 0),
          0
        );

        return (
          <div className="font-bold">
            {total.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "totalCommission",
      header: translate("নাম", "Total Commission"),
      //@ts-ignore
      accessorFn: (row) => row.totalCommission ?? "Unknown userName",
      footer: () => {
        const total = (counterWiseReportData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.totalCommission ?? 0),
          0
        );

        return (
          <div className="font-bold">
            {total.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "deposit",
      header: translate("নাম", "Deposit"),
      //@ts-ignore
      accessorFn: (row) => row.deposit ?? "Unknown userName",
      footer: () => {
        const total = (counterWiseReportData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.deposit ?? 0),
          0
        );

        return (
          <div className="font-bold">
            {total.toLocaleString()}
          </div>
        );
      },
    },
  ];
  // table related end

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            {translate("সব কাউন্টারের ব্যবহারকারীভিত্তিক বিক্রয় রিপোর্ট", "All Counter User Wise Sales Report")}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Counter Select */}
            <InputWrapper
              label={translate("কাউন্টার", "Counter")}
              labelFor="counter"
              isRequired={true}
            >
              <SearchableSelect
                value={allCounterUserWiseSalesState.counterId}
                onValueChange={(value) =>
                  setAllCounterUserWiseSalesState((prev) => ({
                    ...prev,
                    counterId: value,
                  }))
                }
                options={stationsData?.data?.map((station: any) => ({ id: station?.id, name: station?.name })) || []}
                labelKey={"name"}
                placeholder={translate(
                  "কাউন্টার নির্বাচন করুন",
                  "Select counter"
                )}
                loading={stationsLoading}
                isReset={!allCounterUserWiseSalesState?.counterId ? true : false}
              />

            </InputWrapper>

            {/* Date Type Select */}
            <InputWrapper
              label={translate("ক্রয় ডেটার ধরন", "Purchase date type")}
              labelFor="dateType"
              isRequired={true}
            >
              <Select
                value={allCounterUserWiseSalesState?.dateType}
                onValueChange={(value: "Purchase" | "Journey" | "") => setAllCounterUserWiseSalesState((prev) => ({ ...prev, dateType: value }))}
              >
                <SelectTrigger id="dateType" className="w-full">
                  <SelectValue
                    placeholder={translate(
                      "ক্রয় ডেটার ধরন",
                      "Select date type"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {dateTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWrapper>

            {/* From Date Calendar */}
            <InputWrapper
              label={translate("শুরুর তারিখ", "From Date")}
              labelFor="fromDate"
              isRequired={true}
            >
              <Popover
                open={allCounterUserWiseSalesState.fromCalenderOpen}
                onOpenChange={(open) =>
                  setAllCounterUserWiseSalesState((prev) => ({
                    ...prev,
                    fromCalenderOpen: open,
                  }))
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal w-full px-3 text-muted-foreground hover:bg-background text-sm h-9",
                      !allCounterUserWiseSalesState.fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {allCounterUserWiseSalesState.fromDate ? (
                      format(allCounterUserWiseSalesState.fromDate, "dd/MM/yyyy")
                    ) : (
                      <span>
                        {translate("তারিখ বাছাই করুন", "Select Date")}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="end">
                  <Calendar
                    mode="single"
                    selected={allCounterUserWiseSalesState.fromDate || new Date()}
                    onSelect={(date) =>
                      setAllCounterUserWiseSalesState((prev) => ({
                        ...prev,
                        fromDate: date || new Date(),
                        fromCalenderOpen: false,
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </InputWrapper>

            {/* To Date Calendar */}
            <InputWrapper
              label={translate("শেষ তারিখ", "To Date")}
              labelFor="toDate"
              isRequired={true}
            >
              <Popover
                open={allCounterUserWiseSalesState.toCalenderOpen}
                onOpenChange={(open) =>
                  setAllCounterUserWiseSalesState((prev) => ({
                    ...prev,
                    toCalenderOpen: open,
                  }))
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal w-full px-3 text-muted-foreground hover:bg-background text-sm h-9",
                      !allCounterUserWiseSalesState.toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {allCounterUserWiseSalesState.toDate ? (
                      format(allCounterUserWiseSalesState.toDate, "dd/MM/yyyy")
                    ) : (
                      <span>
                        {translate("তারিখ বাছাই করুন", "Select Date")}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="end">
                  <Calendar
                    mode="single"
                    selected={allCounterUserWiseSalesState.toDate || new Date()}
                    onSelect={(date) =>
                      setAllCounterUserWiseSalesState((prev) => ({
                        ...prev,
                        toDate: date || new Date(),
                        toCalenderOpen: false,
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </InputWrapper>

            {/* Order Status Select */}
            <InputWrapper
              label={translate("অর্ডারের অবস্থা", "Order Status")}
              labelFor="orderStatus"
              isRequired={true}
            >
              <Select
                value={allCounterUserWiseSalesState?.orderStatus}
                onValueChange={(value: "Pending" | "Success" | "Cancelled" | "") => setAllCounterUserWiseSalesState((prev) => ({ ...prev, orderStatus: value }))}
              >
                <SelectTrigger id="orderStatus" className="w-full">
                  <SelectValue
                    placeholder={translate(
                      "অর্ডারের অবস্থা নির্বাচন",
                      "Select order status"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWrapper>
          </div>

          <div className="flex justify-end gap-4">
            <Button onClick={handleReset} variant="outline">
              {translate("রিসেট করুন", "Reset")}
            </Button>
            <Button
              onClick={handleSearch}
              disabled={
                !allCounterUserWiseSalesState.fromDate
                || !allCounterUserWiseSalesState.toDate
                || !allCounterUserWiseSalesState.dateType
                || !allCounterUserWiseSalesState.counterId
                || !allCounterUserWiseSalesState.orderStatus
              }
            >{translate("অনুসন্ধান করুন", "Search")} {isFetching && <Loader className="ml-2" />}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="mt-8 shadow-lg">
        <CardContent>
          {/* <NetDepositCalculation
            data={{
              totalSold: 20700,
              totalComplementary: 0,
              fareRefund: 2400,
              totalRefund: 2400,
              calculationCharge: 0,
              migrationCharge: 0,
            }}
            labels={{
              totalSold: "Total Revenue",
              totalDeposit: "Net Deposit",
            }}
            currencySymbol="৳"
          /> */}
          <TableWrapper
            heading={translate("ভূমিকা তালিকা", "Report Results")}
          >
            <TableToolbar alignment="responsive">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3 ml-auto">
                  <PDFDownloadLink
                    document={
                      <PdfCounterWiseSalesReport
                        result={counterWiseReportData?.data || []}
                        singleCms={singleCms}
                        userName={shareAuthentication()?.name || ""}
                        startDate={allCounterUserWiseSalesState?.fromDate ? format(allCounterUserWiseSalesState?.fromDate, "dd/MM/yyyy") : ''}
                        endDate={allCounterUserWiseSalesState?.toDate ? format(allCounterUserWiseSalesState?.toDate, "dd/MM/yyyy") : ''}
                      />
                    }
                    fileName="today_sales_report.pdf"
                  >
                    {
                      //@ts-ignore
                      (params) => {
                        const { loading } = params;
                        return loading ? (
                          <Button
                            disabled
                            className="transition-all duration-150"
                            variant="primary"
                            size="xs"
                          >
                            <Loader /> {translate("পিডিএফ", "PDF")}
                          </Button>
                        ) : (
                          <Button
                            disabled={counterWiseReportData?.data?.length ? false : true}
                            variant="primary"
                            size="xs"
                          >
                            {translate("পিডিএফ", "PDF")}
                          </Button>
                        );
                      }
                    }
                  </PDFDownloadLink>
                   <Button
                                      onClick={invoicePrintHandler}
                                      className="flex items-center gap-2"
                                      variant={"secondary"}
                                      disabled={!counterWiseReportData?.data?.length}
                                      size={"xs"}
                                    >
                                      <Printer className="w-[14px] h-[14px]" />
                                      {translate("প্রিন্ট", "Print")}
                                    </Button>

                   <div className="hidden">
   <PrintCounterWiseSalesReport 
  ref={printSaleRef} // Connect the ref here
  result={counterWiseReportData?.data || []}
  singleCms={singleCms}
  userName={shareAuthentication()?.name || ""}
  startDate={allCounterUserWiseSalesState?.fromDate ? format(allCounterUserWiseSalesState?.fromDate, "dd/MM/yyyy") : ''}
  endDate={allCounterUserWiseSalesState?.toDate ? format(allCounterUserWiseSalesState?.toDate, "dd/MM/yyyy") : ''} 
  counter={""} 
  selectedUser={""} 
/>
  </div>
                  <CounterWiseSalesReportExcel result={counterWiseReportData?.data || []} disabled={counterWiseReportData?.data?.length ? false : true} />
                </div>
              </div>
            </TableToolbar>
            <DataTable
              query={query}
              setQuery={setQuery}
              pagination
              columns={columns}
              // data={roleState.roleList}
              data={counterWiseReportData?.data || []}
            />
          </TableWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllCounterUserWiseSales;
