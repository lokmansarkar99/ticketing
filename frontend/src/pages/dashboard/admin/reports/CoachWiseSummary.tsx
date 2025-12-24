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
// import { Loader } from "@/components/common/Loader";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Printer } from "lucide-react";
import { format } from "date-fns";
// import { NetDepositCalculation } from "./NetDepositeCalculation";
// import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
// import { useGetSchedulesQuery } from "@/store/api/vehiclesSchedule/scheduleApi";
import { useLazyGetCoachWiseSaleAdminReportSummeryQuery } from "@/store/api/adminReport/adminReportApi";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Loader } from "@/components/common/Loader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfCoachWiseSalesReportSummery from "../../pdf/PdfCoachWiseSalesReportSummery";
import CoachWiseSalesReportSummeryExcel from "../../exel/CoachWiseSalesReportSummeryExcel";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useReactToPrint } from "react-to-print";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import PrintCoachWiseSalesReportSummery from "../../printLabel/PrintCoachWiseSalesReportSummery";

export interface ICoachWiseSummaryStateProps {
  fromCalenderOpen: boolean;
  toCalenderOpen: boolean;
  fromDate: Date | null;
  toDate: Date | null;
  // routeName: string;
  // schedule: string;
  // dateType: "Purchase" | "Journey" | "";
  // orderStatus: "Pending" | "Success" | "Cancelled" | "";
  class: "" | "Sleeper" | "S_Class" | "E_Class" | "B_Class";
}

const CoachWiseSummary = () => {
  const { data: singleCms } = useGetSingleCMSQuery({});
  const [coachWiseSummaryState, setCoachWiseSummaryState] =
    useState<ICoachWiseSummaryStateProps>({
      fromCalenderOpen: false,
      toCalenderOpen: false,
      fromDate: null,
      toDate: null,
      // routeName: "",
      // schedule: "",
      class: "",
    });
  const { translate } = useCustomTranslator();

  const [trigger, { data: coachWiseSummeryData, isFetching }] =
    useLazyGetCoachWiseSaleAdminReportSummeryQuery();

  // const { data: schedulesData, isLoading: schedulesLoading } =
  //   useGetSchedulesQuery({}) as any;

  // const { data: routeData, isLoading: stationsLoading } = useGetRoutesQuery(
  //   {}
  // ) as any;

  const printSaleRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_Coach_Wise_Summary`,
  });

  const invoicePrintHandler = () => {
    handlePrint();
  };

  // search handler
  const handleSearch = () => {
    const {
      fromDate,
      toDate,
      // routeName,
      // schedule,
      class: C_class,
    } = coachWiseSummaryState;

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
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      coachClass: C_class,
    });
  };

  const handleReset = () => {
    setCoachWiseSummaryState({
      fromCalenderOpen: false,
      toCalenderOpen: false,
      fromDate: null,
      toDate: null,
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
      accessorKey: "coachNo",
      header: translate("কোচ নাম্বার", "Coach No"),
      accessorFn: (row) => row.coachNo ?? "N/A",
    },
    {
      accessorKey: "travelDate",
      header: translate("ভ্রমণের তারিখ", "Travel Date"),
      accessorFn: (row) => row.travelDate ?? "N/A",
    },

    // {
    //   accessorKey: "route",
    //   header: translate("রুট", "Route"),
    //   accessorFn: (row) => row.route ?? "N/A",
    // },
    {
      accessorKey: "seatQuantity",
      header: translate("মোট সিট", "Total Seat Qty"),
      accessorFn: (row) => row.seatQuantity ?? 0,
      footer: () => {
        const total = (coachWiseSummeryData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.seatQuantity ?? 0),
          0
        );

        return <div className="font-bold">{total.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "soldSeatQty",
      header: translate("বিক্রিত সিট", "Sold Seat Qty"),
      accessorFn: (row) => row.soldSeatQty ?? 0,
      footer: () => {
        const total = (coachWiseSummeryData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.soldSeatQty ?? 0),
          0
        );

        return <div className="font-bold">{total.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "seatRemainingUnsold",
      header: translate("অবিক্রিত সিট", "Remaining Unsold"),
      accessorFn: (row) => row.seatRemainingUnsold ?? 0,
      footer: () => {
        const total = (coachWiseSummeryData?.data ?? []).reduce(
          (sum: number, item: any) =>
            sum + Number(item.seatRemainingUnsold ?? 0),
          0
        );

        return <div className="font-bold">{total.toLocaleString()}</div>;
      },
    },
    // {
    //   accessorKey: "counterSale",
    //   header: translate("কাউন্টার সেল", "Counter Sale"),
    //   accessorFn: (row) =>
    //     row.counterSale && row.counterSale.length > 0
    //       ? row.counterSale.map(
    //         (c: any) => `${c.counterName} (${c.quantity})`
    //       ).join(", ")
    //       : "N/A",
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Route Select */}
            {/* <InputWrapper label={translate("রাউট", "Route")} labelFor="counter">
              <Select
                value={coachWiseSummaryState.routeName}
                onValueChange={(value) =>
                  setCoachWiseSummaryState((prev) => ({
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
            </InputWrapper> */}

            {/* Schedule Select */}
            {/* <InputWrapper
              label={translate("সিডিউল", "Schedule")}
              labelFor="user"
            >
              <Select
                value={coachWiseSummaryState.schedule}
                onValueChange={(value) =>
                  setCoachWiseSummaryState((prev) => ({
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
                      <SelectItem key={index} value={schedule?.time?.toString()}>
                        {schedule.time}
                      </SelectItem>
                    ))}

                  {schedulesLoading && !schedulesData?.data?.length && <Loader />}
                </SelectContent>
              </Select>
            </InputWrapper> */}

            {/* From Date Calendar */}
            <InputWrapper
              label={translate("শুরুর তারিখ", "From Date")}
              labelFor="fromDate"
              isRequired={true}
            >
              <Popover
                open={coachWiseSummaryState.fromCalenderOpen}
                onOpenChange={(open) =>
                  setCoachWiseSummaryState((prev) => ({
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
                      !coachWiseSummaryState.fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {coachWiseSummaryState.fromDate ? (
                      format(coachWiseSummaryState.fromDate, "dd/MM/yyyy")
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
                    selected={coachWiseSummaryState.fromDate || new Date()}
                    onSelect={(date) =>
                      setCoachWiseSummaryState((prev) => ({
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
                open={coachWiseSummaryState.toCalenderOpen}
                onOpenChange={(open) =>
                  setCoachWiseSummaryState((prev) => ({
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
                      !coachWiseSummaryState.toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {coachWiseSummaryState.toDate ? (
                      format(coachWiseSummaryState.toDate, "dd/MM/yyyy")
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
                    selected={coachWiseSummaryState.toDate || new Date()}
                    onSelect={(date) =>
                      setCoachWiseSummaryState((prev) => ({
                        ...prev,
                        toDate: date || new Date(),
                        toCalenderOpen: false,
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </InputWrapper>

            {/* Coach Class Select */}
            <InputWrapper
              label={translate("কোচের শ্রেণী", "Coach Class")}
              labelFor="busType"
              isRequired={true}
            >
              <Select
                value={coachWiseSummaryState.class}
                onValueChange={(
                  value: "Sleeper" | "S_Class" | "E_Class" | "B_Class" | ""
                ) =>
                  setCoachWiseSummaryState((prev) => ({
                    ...prev,
                    class: value,
                  }))
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
                !coachWiseSummaryState.fromDate ||
                !coachWiseSummaryState.toDate ||
                !coachWiseSummaryState.class ||
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
                      <PdfCoachWiseSalesReportSummery
                        result={coachWiseSummeryData?.data || []}
                        singleCms={singleCms}
                        userName={shareAuthentication()?.name || ""}
                        startDate={
                          coachWiseSummaryState?.fromDate
                            ? format(
                                coachWiseSummaryState?.fromDate,
                                "dd/MM/yyyy"
                              )
                            : ""
                        }
                        endDate={
                          coachWiseSummaryState?.toDate
                            ? format(
                                coachWiseSummaryState?.toDate,
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
                              coachWiseSummeryData?.data?.length ? false : true
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
                    disabled={!coachWiseSummeryData?.data?.length}
                    size={"xs"}
                  >
                    <Printer className="w-[14px] h-[14px]" />
                    {translate("প্রিন্ট", "Print")}
                  </Button>

                  <PrintCoachWiseSalesReportSummery
                    ref={printSaleRef}
                    result={coachWiseSummeryData?.data || []}
                    singleCms={singleCms}
                    userName={shareAuthentication()?.name || ""}
                    startDate={
                      coachWiseSummaryState?.fromDate
                        ? format(coachWiseSummaryState?.fromDate, "dd/MM/yyyy")
                        : ""
                    }
                    endDate={
                      coachWiseSummaryState?.toDate
                        ? format(coachWiseSummaryState?.toDate, "dd/MM/yyyy")
                        : ""
                    }
                  />

                  <CoachWiseSalesReportSummeryExcel
                    result={coachWiseSummeryData?.data || []}
                    disabled={coachWiseSummeryData?.data?.length ? false : true}
                  />
                </div>
              </div>
            </TableToolbar>
            <DataTable
              query={query}
              setQuery={setQuery}
              pagination
              columns={columns}
              data={coachWiseSummeryData?.data || []}
            />
          </TableWrapper>
          {/* table end  */}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachWiseSummary;
