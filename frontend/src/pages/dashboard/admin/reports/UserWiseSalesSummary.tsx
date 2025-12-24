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
  useGetUserListQuery,
  useLazyGetUserWiseSaleAdminReportSummeryQuery,
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
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfUserWiseSalesReportSummery from "../../pdf/PdfUserWiseSalesReportSummery";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import UserWiseSalesReportSummeryExcel from "../../exel/UserWiseSalesReportSummeryExcel";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useReactToPrint } from "react-to-print";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import PrintUserWiseSalesSummary from "../../printLabel/PrintUserWiseSalesSummary";

export interface IUserWiseSalesSummaryStateProps {
  fromCalenderOpen: boolean;
  toCalenderOpen: boolean;
  fromDate: Date | null;
  toDate: Date | null;
  // counterId: string;
  userId: string;
  dateType: string;
  // orderStatus: string;
  // busType: "AC" | "NON AC" | "";
}

const UserWiseSalesSummary = () => {
  const { data: singleCms } = useGetSingleCMSQuery({});
  const [userWiseSalesSummaryState, setUserWiseSalesSummaryState] =
    useState<IUserWiseSalesSummaryStateProps>({
      fromCalenderOpen: false,
      toCalenderOpen: false,
      fromDate: null,
      toDate: null,
      userId: "",
      dateType: "",
    });
  const { translate } = useCustomTranslator();

  const [trigger, { data: userWiseSalesData, isFetching }] =
    useLazyGetUserWiseSaleAdminReportSummeryQuery();
  const printSaleRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_User_Wise_Sales_Report_summary`,
  });

  const invoicePrintHandler = () => {
    handlePrint();
  };

  const handleSearch = () => {
    const { fromDate, toDate, userId, dateType } = userWiseSalesSummaryState;
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
      userId,
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
      userId: "",
      dateType: "",
    });
  };

  const { data: usersData, isLoading: userLoading } = useGetUserListQuery({
    size: 1000,
    page: 1,
  }) as any;

  const dateTypes = [
    { id: "Purchase", name: "Purchase Date" },
    { id: "Journey", name: "Journey Date" },
  ];

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
    // {
    //   accessorKey: "route",
    //   header: translate("রুট", "Route"),
    //   accessorFn: (row) => row.route ?? "N/A",
    // },
    // {
    //   accessorKey: "schedule",
    //   header: translate("শিডিউল", "Schedule"),
    //   accessorFn: (row) => row.schedule ?? "N/A",
    // },
    {
      accessorKey: "soldSeatQty",
      header: translate("বিক্রিত সিট সংখ্যা", "Sold Seat Qty"),
      accessorFn: (row) => row.soldSeatQty ?? 0,
      footer: () => {
        const total = (userWiseSalesData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.soldSeatQty ?? 0),
          0
        );

        return <div className="font-bold">{total.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "fare",
      header: translate("ভাড়া", "Fare"),
      accessorFn: (row) => row.fare ?? 0,
      footer: () => {
        const total = (userWiseSalesData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.fare ?? 0),
          0
        );

        return <div className="font-bold">{total.toLocaleString()}</div>;
      },
    },
  ];
  // table related end

  return (
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
            {/* User Select */}
            <InputWrapper
              label={translate("ব্যবহারকারীগণ", "Users")}
              labelFor="user"
              isRequired={true}
            >
              <SearchableSelect
                onValueChange={(value) =>
                  setUserWiseSalesSummaryState((prev) => ({
                    ...prev,
                    userId: value,
                  }))
                }
                options={
                  usersData?.data?.map((user: any) => ({
                    id: user?.id,
                    name: user?.userName,
                  })) || []
                }
                labelKey={"name"}
                // disabled={!userWiseSalesState.counterId}
                value={userWiseSalesSummaryState.userId}
                placeholder={translate(
                  "ব্যবহারকারী নির্বাচন করুন",
                  "Select user"
                )}
                loading={userLoading}
                isReset={!userWiseSalesSummaryState?.userId ? true : false}
              />
            </InputWrapper>

            <InputWrapper
              label={translate("ক্রয় ডেটার ধরন", "Purchase date type")}
              labelFor="dateType"
              isRequired={true}
            >
              <Select
                value={userWiseSalesSummaryState.dateType}
                onValueChange={(value) =>
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
                    selected={userWiseSalesSummaryState.fromDate || new Date()}
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
                !userWiseSalesSummaryState.userId ||
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
                      <PdfUserWiseSalesReportSummery
                        result={userWiseSalesData?.data || []}
                        singleCms={singleCms}
                        userName={shareAuthentication()?.name || ""}
                        selectedUser={
                          usersData?.data?.find(
                            (user: any) =>
                              user?.id?.toString() ===
                              userWiseSalesSummaryState?.userId
                          )?.userName || ""
                        }
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

                  <div className="hidden">
                    <div ref={printSaleRef}>
                      <PrintUserWiseSalesSummary
                        result={userWiseSalesData?.data || []}
                        userName={shareAuthentication()?.name || ""}
                        selectedUser={
                          usersData?.data?.find(
                            (user: any) =>
                              user?.id?.toString() ===
                              userWiseSalesSummaryState?.userId
                          )?.userName || ""
                        }
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
                        counter={""}
                        singleCms={undefined}
                      />
                    </div>
                  </div>
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
  );
};

export default UserWiseSalesSummary;
