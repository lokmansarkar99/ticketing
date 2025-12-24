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
import { useLazyGetCounterWiseSaleAdminReportQuery } from "@/store/api/adminReport/adminReportApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Printer } from "lucide-react";
import { format } from "date-fns";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import UserWiseSalesReportSummeryExcel from "../../exel/UserWiseSalesReportSummeryExcel";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import SoldDetailsTable from "./SoldDetailsTable";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import PdfCounterSalesReport from "../../pdf/PdfCounterSalesReport";
import { useReactToPrint } from "react-to-print";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import PrintCounterSalesReport from "../../printLabel/PrintCounterSalesReport";

export interface IUserWiseSalesSummaryStateProps {
  fromCalenderOpen: boolean;
  toCalenderOpen: boolean;
  fromDate: Date | null;
  toDate: Date | null;
  routeName: string;
  dateType: "Purchase" | "Journey" | "";
}

const CounterWiseSales = () => {
  const { data: singleCms } = useGetSingleCMSQuery({});

  const [isSoldModalOpen, setIsSoldModalOpen] = useState(false);

  const [userWiseSalesSummaryState, setUserWiseSalesSummaryState] =
    useState<IUserWiseSalesSummaryStateProps>({
      fromCalenderOpen: false,
      toCalenderOpen: false,
      fromDate: null,
      toDate: null,
      routeName: "",
      dateType: "",
    });
  const { translate } = useCustomTranslator();

  const [trigger, { data: userWiseSalesData, isFetching }] =
    useLazyGetCounterWiseSaleAdminReportQuery();
  interface ISoldDetails {
    user?: any[];
  }
  const [selectedSoldDetails, setSelectedSoldDetails] =
    useState<ISoldDetails | null>(null);

  const printSaleRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_Counter_Wise_Sales`,
  });

  const invoicePrintHandler = () => {
    handlePrint();
  };

  const handleSearch = () => {
    const { fromDate, toDate, routeName, dateType } = userWiseSalesSummaryState;
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
      routeName,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      dateType,
    });
  };

  const handleReset = () => {
    setUserWiseSalesSummaryState({
      fromCalenderOpen: false,
      toCalenderOpen: false,
      fromDate: null,
      toDate: null,
      routeName: "",
      dateType: "",
    });
  };

  // const { data: usersData, isLoading: userLoading } = useGetUserListQuery({
  //   size: 1000,
  //   page: 0,
  // }) as any;

  const { data: routeData, isLoading: stationsLoading } = useGetRoutesQuery(
    {}
  ) as any;

  const dateTypes = [
    { id: "Purchase", name: "Purchase Date" },
    { id: "Journey", name: "Journey Date" },
  ];

  // table related start
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 0,
    size: 10,
    meta: {
      page: 0,
      size: 10,
      total: 100,
      totalPage: 1,
    },
  });

  const handleSoldModalOpen = (selectedDetailsIndex: number) => {
    setSelectedSoldDetails(userWiseSalesData?.data[selectedDetailsIndex]);
    setIsSoldModalOpen(true);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("সি.না", "SL"),
      accessorFn: (_, index) => `${index < 9 ? "0" : ""}${index + 1}`,
      footer: () => {
        return <div className="text-left font-bold">Total:</div>;
      },
    },
    {
      accessorKey: "date",
      header: translate("ভ্রমণের তারিখ", "Travel Date"),
      accessorFn: (row) => row.date ?? "N/A",
    },

    {
      accessorKey: "totalSoldSeat",
      header: translate("বিক্রিত সিট সংখ্যা", "Sold Seat Qty"),
      cell: ({ row }) => (
        <span>
          {row.original.totalSoldSeat ? row.original.totalSoldSeat : ""}{" "}
          <span
            onClick={() => handleSoldModalOpen(row?.index)}
            className="text-secondary cursor-pointer"
          >
            details
          </span>
        </span>
      ),
      footer: () => {
        const total = (userWiseSalesData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.totalSoldSeat ?? 0),
          0
        );

        return <div className="font-bold">{total.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "totalFare",
      header: translate("ভাড়া", "Fare"),
      accessorFn: (row) => row.totalFare ?? 0,
      footer: () => {
        const total = (userWiseSalesData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.totalFare ?? 0),
          0
        );

        return <div className="font-bold">{total.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "fare",
      header: translate("ভাড়া", "Commission Fare"),
      accessorFn: (row) => row.commissionFee ?? 0,
      footer: () => {
        const total = (userWiseSalesData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.commissionFee ?? 0),
          0
        );

        return <div className="font-bold">{total.toLocaleString()}</div>;
      },
    },
  ];
  // table related end

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              {translate(
                "ব্যবহারকারী অনুসারে বিক্রয় রিপোর্টের সারাংশ",
                "User Wise Sales Report Summary"
              )}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Route Select */}
              <InputWrapper
                label={translate("রাউট", "Route")}
                labelFor="counter"
                isRequired={true}
              >
                <Select
                  value={userWiseSalesSummaryState.routeName}
                  onValueChange={(value) =>
                    setUserWiseSalesSummaryState((prev) => ({
                      ...prev,
                      routeName: value,
                    }))
                  }
                >
                  <SelectTrigger id="counter" className="w-full">
                    <SelectValue
                      placeholder={translate(
                        "রাউট নির্বাচন করুন",
                        "Select route"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {!stationsLoading &&
                      routeData?.data?.length > 0 &&
                      routeData?.data?.map(
                        (singleStation: any, stationIndex: number) => (
                          <SelectItem
                            key={stationIndex}
                            value={singleStation?.routeName?.toString()}
                          >
                            {singleStation?.routeName}
                          </SelectItem>
                        )
                      )}

                    {stationsLoading && !routeData?.data?.length && <Loader />}
                  </SelectContent>
                </Select>
              </InputWrapper>

              <InputWrapper
                label={translate("ক্রয় ডেটার ধরন", "Purchase date type")}
                labelFor="dateType"
                isRequired={true}
              >
                <Select
                  value={userWiseSalesSummaryState.dateType}
                  onValueChange={(value: "Purchase" | "Journey" | "") =>
                    setUserWiseSalesSummaryState((prev) => ({
                      ...prev,
                      dateType: value,
                    }))
                  }
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
                  open={userWiseSalesSummaryState.fromCalenderOpen}
                  onOpenChange={(open) =>
                    setUserWiseSalesSummaryState((prev) => ({
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
                        !userWiseSalesSummaryState.fromDate &&
                          "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {userWiseSalesSummaryState.fromDate ? (
                        format(userWiseSalesSummaryState.fromDate, "dd/MM/yyyy")
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
                      selected={
                        userWiseSalesSummaryState.fromDate || new Date()
                      }
                      onSelect={(date) =>
                        setUserWiseSalesSummaryState((prev) => ({
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
                  open={userWiseSalesSummaryState.toCalenderOpen}
                  onOpenChange={(open) =>
                    setUserWiseSalesSummaryState((prev) => ({
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
                        !userWiseSalesSummaryState.toDate &&
                          "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {userWiseSalesSummaryState.toDate ? (
                        format(userWiseSalesSummaryState.toDate, "dd/MM/yyyy")
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
                      selected={userWiseSalesSummaryState.toDate || new Date()}
                      onSelect={(date) =>
                        setUserWiseSalesSummaryState((prev) => ({
                          ...prev,
                          toDate: date || new Date(),
                          toCalenderOpen: false,
                        }))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </InputWrapper>
            </div>

            <div className="flex justify-end gap-4">
              <Button onClick={handleReset} variant="outline">
                {translate("রিসেট করুন", "Reset")}
              </Button>
              <Button
                onClick={handleSearch}
                disabled={
                  !userWiseSalesSummaryState.fromDate ||
                  !userWiseSalesSummaryState.toDate ||
                  !userWiseSalesSummaryState.routeName ||
                  !userWiseSalesSummaryState.dateType ||
                  isFetching
                }
              >
                {translate("অনুসন্ধান করুন", "Search")}
                {isFetching && <Loader className="ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="mt-8 shadow-lg">
          <CardContent>
            {/* table start  */}
            <TableWrapper
              heading={translate("ভূমিকা তালিকা", "Report Results")}
            >
              <TableToolbar alignment="responsive">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-3 ml-auto">
                    <PDFDownloadLink
                      document={
                        <PdfCounterSalesReport
                          result={userWiseSalesData?.data || []}
                          singleCms={singleCms}
                          userName={shareAuthentication()?.name || ""}
                          startDate={
                            userWiseSalesSummaryState?.fromDate
                              ? format(
                                  userWiseSalesSummaryState?.fromDate,
                                  "dd/MM/yyyy"
                                )
                              : ""
                          }
                          endDate={
                            userWiseSalesSummaryState?.toDate
                              ? format(
                                  userWiseSalesSummaryState?.toDate,
                                  "dd/MM/yyyy"
                                )
                              : ""
                          }
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
                              disabled={
                                userWiseSalesData?.data?.length ? false : true
                              }
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
                      disabled={!userWiseSalesData?.data?.length}
                      size={"xs"}
                    >
                      <Printer className="w-[14px] h-[14px]" />
                      {translate("প্রিন্ট", "Print")}
                    </Button>

                    <PrintCounterSalesReport
                      ref={printSaleRef}
                      result={userWiseSalesData?.data || []}
                      singleCms={singleCms}
                      userName={shareAuthentication()?.name || ""}
                      startDate={
                        userWiseSalesSummaryState?.fromDate
                          ? format(
                              userWiseSalesSummaryState?.fromDate,
                              "dd/MM/yyyy"
                            )
                          : ""
                      }
                      endDate={
                        userWiseSalesSummaryState?.toDate
                          ? format(
                              userWiseSalesSummaryState?.toDate,
                              "dd/MM/yyyy"
                            )
                          : ""
                      }
                    />

                    <UserWiseSalesReportSummeryExcel
                      result={userWiseSalesData?.data || []}
                      disabled={userWiseSalesData?.data?.length ? false : true}
                    />
                  </div>
                </div>
              </TableToolbar>
              <DataTable
                query={query}
                setQuery={setQuery}
                pagination
                columns={columns}
                data={userWiseSalesData?.data || []}
              />
            </TableWrapper>
            {/* table end  */}
          </CardContent>
        </Card>
      </div>

      {/* sold modal  */}

      <SoldDetailsTable
        data={selectedSoldDetails?.user || []}
        isSoldModalOpen={isSoldModalOpen}
        setIsModalOpen={setIsSoldModalOpen}
      />
    </>
  );
};

export default CounterWiseSales;
