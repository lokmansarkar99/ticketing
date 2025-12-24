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
  // useGetUserListQuery,
  useLazyGetCoachWiseSaleAdminReportQuery,
} from "@/store/api/adminReport/adminReportApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Printer } from "lucide-react";
import { format } from "date-fns";
// import { NetDepositCalculation } from "./NetDepositeCalculation";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { useGetSchedulesQuery } from "@/store/api/vehiclesSchedule/scheduleApi";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfCoachWiseSalesReport from "../../pdf/PdfCoachWiseSalesReport";
import CoachWiseSalesReportExcel from "../../exel/CoachWiseSalesReportExcel";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useReactToPrint } from "react-to-print";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import PrintCoachWiseSalesReport from "../../printLabel/PrintCoachWiseSalesReport";

export interface ICoachWiseSalesStateProps {
  fromCalenderOpen: boolean;
  toCalenderOpen: boolean;
  fromDate: Date | null;
  toDate: Date | null;
  routeName: string;
  schedule: string;
  dateType: "Purchase" | "Journey" | "";
  orderStatus: "Pending" | "Success" | "Cancelled" | "";
  class: "" | "Sleeper" | "S_Class" | "E_Class" | "B_Class";
}

const CoachWiseSales = () => {
  const { data: singleCms } = useGetSingleCMSQuery({});
  const [coachWiseSalesState, setCoachWiseSalesState] =
    useState<ICoachWiseSalesStateProps>({
      fromCalenderOpen: false,
      toCalenderOpen: false,
      fromDate: null,
      toDate: null,
      routeName: "",
      schedule: "",
      dateType: "",
      orderStatus: "",
      class: "",
    });
  const { translate } = useCustomTranslator();

  const { data: schedulesData, isLoading: schedulesLoading } =
    useGetSchedulesQuery({}) as any;

  const { data: routeData, isLoading: stationsLoading } = useGetRoutesQuery(
    {}
  ) as any;

  const [trigger, { data: coachWiseData, isFetching }] =
    useLazyGetCoachWiseSaleAdminReportQuery();

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
    documentTitle: `${appConfiguration?.appName}_Coach_Wise_Sales`,
  });

  const invoicePrintHandler = () => {
    handlePrint();
  };

  // search handler
  const handleSearch = () => {
    const {
      fromDate,
      toDate,
      routeName,
      schedule,
      dateType,
      orderStatus,
      class: C_class,
    } = coachWiseSalesState;

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
      schedule,
      orderStatus,
      coachClass: C_class,
    });
  };

  const handleReset = () => {
    setCoachWiseSalesState({
      fromCalenderOpen: false,
      toCalenderOpen: false,
      fromDate: null,
      toDate: null,
      routeName: "",
      schedule: "",
      dateType: "",
      orderStatus: "",
      class: "",
    });
  };

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
      accessorKey: "travelDate",
      header: translate("ভ্রমণের তারিখ", "Travel Date"),
      accessorFn: (row) => row.travelDate ?? "N/A",
    },
    {
      accessorKey: "coachNo",
      header: translate("কোচ নাম্বার", "Coach No"),
      accessorFn: (row) => row.coachNo ?? "N/A",
    },
    {
      accessorKey: "seatNo",
      header: translate("সিট নাম্বার", "Seat No"),
      accessorFn: (row) => row.seatNo ?? "N/A",
    },

    // {
    //   accessorKey: "routeName",
    //   header: translate("রুট", "Route"),
    //   accessorFn: (row) => row.routeName ?? "N/A",
    // },
    {
      accessorKey: "from",
      header: translate("যাত্রা শুরু", "From"),
      accessorFn: (row) => row.from ?? "N/A",
    },
    {
      accessorKey: "to",
      header: translate("গন্তব্য", "To"),
      accessorFn: (row) => row.to ?? "N/A",
    },

    {
      accessorKey: "orderedBy",
      header: translate("অর্ডার করেছেন", "Ordered By"),
      accessorFn: (row) => row.orderedBy ?? "N/A",
    },

    {
      accessorKey: "remarks",
      header: translate("মন্তব্য", "Remarks"),
      accessorFn: (row) => row.remarks ?? "N/A",
    },
    {
      accessorKey: "originalFare",
      header: translate("মূল ভাড়া", "Original Fare"),
      accessorFn: (row) => row.originalFare ?? 0,
      footer: () => {
        const total = (coachWiseData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.originalFare ?? 0),
          0
        );

        return <div className="font-bold">{total.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "discount",
      header: translate("ডিসকাউন্ট", "Discount"),
      accessorFn: (row) => row.discount ?? 0,
      footer: () => {
        const total = (coachWiseData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.discount ?? 0),
          0
        );

        return <div className="font-bold">{total.toLocaleString()}</div>;
      },
    },
    // {
    //   accessorKey: "fare",
    //   header: translate("ভাড়া", "Fare"),
    //   accessorFn: (row) => row.fare ?? 0,
    //   footer: () => {
    //     const total = (coachWiseData?.data ?? []).reduce(
    //       (sum: number, item: any) => sum + Number(item.fare ?? 0),
    //       0
    //     );

    //     return (
    //       <div className="text-left font-bold">
    //         {total.toLocaleString()}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "refund",
    //   header: translate("রিফান্ড", "Refund"),
    //   accessorFn: (row) => row.refund ?? 0,
    //   footer: () => {
    //     const total = (coachWiseData?.data ?? []).reduce(
    //       (sum: number, item: any) => sum + Number(item.refund ?? 0),
    //       0
    //     );

    //     return (
    //       <div className="text-left font-bold">
    //         {total.toLocaleString()}
    //       </div>
    //     );
    //   },
    // },
  ];

  // table related end

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            {translate(
              "কোচ অনুসারে বিক্রয় রিপোর্ট",
              "Coach Wise Sales Report"
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-8">
            {/* Route Select */}
            <InputWrapper
              label={translate("রাউট", "Route")}
              labelFor="counter"
              isRequired={true}
            >
              <Select
                value={coachWiseSalesState.routeName}
                onValueChange={(value) =>
                  setCoachWiseSalesState((prev) => ({
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

            {/* User Select */}
            <InputWrapper
              label={translate("সিডিউল", "Schedule")}
              labelFor="user"
              isRequired={true}
            >
              <Select
                value={coachWiseSalesState.schedule}
                onValueChange={(value) =>
                  setCoachWiseSalesState((prev) => ({
                    ...prev,
                    schedule: value,
                  }))
                }
              >
                <SelectTrigger id="user" className="w-full">
                  <SelectValue
                    placeholder={translate(
                      "সিডিউল নির্বাচন করুন",
                      "Select schedule"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {!schedulesLoading &&
                    schedulesData?.data?.length > 0 &&
                    schedulesData?.data?.map((schedule: any, index: number) => (
                      <SelectItem
                        key={index}
                        value={schedule?.time?.toString()}
                      >
                        {schedule?.time}
                      </SelectItem>
                    ))}

                  {schedulesLoading && !schedulesData?.data?.length && (
                    <Loader />
                  )}
                </SelectContent>
              </Select>
            </InputWrapper>

            {/* Date Type Select */}
            <InputWrapper
              label={translate("ক্রয় ডেটার ধরন", "Purchase date type")}
              labelFor="dateType"
              isRequired={true}
            >
              <Select
                value={coachWiseSalesState?.dateType}
                onValueChange={(value: "Purchase" | "Journey" | "") =>
                  setCoachWiseSalesState((prev) => ({
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
                open={coachWiseSalesState.fromCalenderOpen}
                onOpenChange={(open) =>
                  setCoachWiseSalesState((prev) => ({
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
                      !coachWiseSalesState.fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {coachWiseSalesState.fromDate ? (
                      format(coachWiseSalesState.fromDate, "dd/MM/yyyy")
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
                    selected={coachWiseSalesState.fromDate || new Date()}
                    onSelect={(date) =>
                      setCoachWiseSalesState((prev) => ({
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
                open={coachWiseSalesState.toCalenderOpen}
                onOpenChange={(open) =>
                  setCoachWiseSalesState((prev) => ({
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
                      !coachWiseSalesState.toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {coachWiseSalesState.toDate ? (
                      format(coachWiseSalesState.toDate, "dd/MM/yyyy")
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
                    selected={coachWiseSalesState.toDate || new Date()}
                    onSelect={(date) =>
                      setCoachWiseSalesState((prev) => ({
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
                value={coachWiseSalesState?.orderStatus}
                onValueChange={(
                  value: "Pending" | "Success" | "Cancelled" | ""
                ) =>
                  setCoachWiseSalesState((prev) => ({
                    ...prev,
                    orderStatus: value,
                  }))
                }
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

            {/* Bus Type Select */}
            <InputWrapper
              label={translate("কোচের শ্রেণী", "Coach Class")}
              labelFor="busType"
              isRequired={true}
            >
              <Select
                value={coachWiseSalesState.class}
                onValueChange={(
                  value: "" | "Sleeper" | "S_Class" | "E_Class" | "B_Class"
                ) =>
                  setCoachWiseSalesState((prev) => ({ ...prev, class: value }))
                }
              >
                <SelectTrigger
                  id="coachType"
                  className="w-full uppercase text-xs lg:text-sm px-2 lg:px-3"
                >
                  <SelectValue
                    placeholder={translate(
                      "কোচের শ্রেণী নির্বাচন করুন",
                      "Select coach class"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B_Class" className="uppercase">
                    {translate("বিজনেস শ্রেণি", "Business Class")}
                  </SelectItem>
                  <SelectItem value="Sleeper" className="uppercase">
                    {translate("স্লিপার শ্রেণি", "Sleeper Class")}
                  </SelectItem>
                  <SelectItem value="S_Class" className="uppercase">
                    {translate("এস শ্রেণি", "Suit Class")}
                  </SelectItem>
                  <SelectItem value="E_Class" className="uppercase">
                    {translate("ইকোনমি শ্রেণি", "Economy Class")}
                  </SelectItem>
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
                !coachWiseSalesState.routeName ||
                !coachWiseSalesState.schedule ||
                !coachWiseSalesState.dateType ||
                !coachWiseSalesState.fromDate ||
                !coachWiseSalesState.toDate ||
                !coachWiseSalesState.orderStatus ||
                !coachWiseSalesState.class ||
                isFetching
              }
            >
              {translate("অনুসন্ধান করুন", "Search")}{" "}
              {isFetching && <Loader className="ml-2" />}
            </Button>
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
          {/* <div className="flex flex-col items-center justify-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {translate("তথ্য পাওয়া যায়নি", "Data Not Found")}
            </h3>
            <p className="text-gray-500">
              {translate(
                "আপনার বর্তমান ফিল্টারগুলোর সাথে কোনো রেকর্ড মেলেনি",
                "No records match your current filters"
              )}
            </p>
          </div> */}

          {/* table start  */}
          <TableWrapper heading={translate("ভূমিকা তালিকা", "Report Results")}>
            <TableToolbar alignment="responsive">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3 ml-auto">
                  <PDFDownloadLink
                    document={
                      <PdfCoachWiseSalesReport
                        result={coachWiseData?.data || []}
                        singleCms={singleCms}
                        userName={shareAuthentication()?.name || ""}
                        startDate={
                          coachWiseSalesState?.fromDate
                            ? format(
                                coachWiseSalesState?.fromDate,
                                "dd/MM/yyyy"
                              )
                            : ""
                        }
                        endDate={
                          coachWiseSalesState?.toDate
                            ? format(coachWiseSalesState?.toDate, "dd/MM/yyyy")
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
                              coachWiseData?.data?.length ? false : true
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
                    disabled={!coachWiseData?.data?.length}
                    size={"xs"}
                  >
                    <Printer className="w-[14px] h-[14px]" />
                    {translate("প্রিন্ট", "Print")}
                  </Button>
                  <PrintCoachWiseSalesReport
                    ref={printSaleRef}
                    result={coachWiseData?.data || []}
                    singleCms={singleCms}
                    userName={shareAuthentication()?.name || ""}
                    startDate={
                      coachWiseSalesState?.fromDate
                        ? format(coachWiseSalesState?.fromDate, "dd/MM/yyyy")
                        : ""
                    }
                    endDate={
                      coachWiseSalesState?.toDate
                        ? format(coachWiseSalesState?.toDate, "dd/MM/yyyy")
                        : ""
                    }
                  />
                  <CoachWiseSalesReportExcel
                    result={coachWiseData?.data || []}
                    disabled={coachWiseData?.data?.length ? false : true}
                  />
                </div>
              </div>
            </TableToolbar>
            <DataTable
              query={query}
              setQuery={setQuery}
              pagination
              columns={columns}
              data={coachWiseData?.data || []}
            />
          </TableWrapper>
          {/* table end  */}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachWiseSales;
