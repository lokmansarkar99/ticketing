import { useEffect, useRef, useState } from "react";
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
import { useGetUserListQuery, useLazyGetUserWiseSaleAdminReportQuery } from "@/store/api/adminReport/adminReportApi";
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
import { TableToolbar, TableWrapper } from "@/components/common/wrapper/TableWrapper";
// import { LuDownload } from "react-icons/lu";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { PDFDownloadLink } from "@react-pdf/renderer";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfUserWiseSalesReport from "../../pdf/PdfUserWiseSalesReport";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import UserWiseSalesReportExcel from "../../exel/UserWiseSalesReportExcel";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import PrintUserWiseSalesReport from "../../printLabel/PrintUserWiseSalesReport";
import { useReactToPrint } from "react-to-print";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";

export interface IUserWiseSalesStateProps {
  fromCalenderOpen: boolean;
  toCalenderOpen: boolean;
  fromDate: Date | null;
  toDate: Date | null;
  counterId: string;
  userId: string;
  dateType: "Purchase" | "Journey" | "";
  orderStatus: "Pending" | "Success" | "Cancelled" | "";
  busType: "AC" | "NON AC" | "";
}

const UserWiseSales = () => {
  const { data: singleCms } = useGetSingleCMSQuery(
    {}
  );
  const { name: currentUser } = shareAuthentication()

  const [userWiseSalesState, setUserWiseSalesState] =
    useState<IUserWiseSalesStateProps>({
      fromCalenderOpen: false,
      toCalenderOpen: false,
      fromDate: null,
      toDate: null,
      counterId: "",
      userId: "",
      dateType: "",
      orderStatus: "",
      busType: "AC",
    });
  const { translate } = useCustomTranslator();
  const [trigger, { data: userWiseSalesData, isFetching }] = useLazyGetUserWiseSaleAdminReportQuery()
  const { data: usersData, isLoading: userLoading } = useGetUserListQuery({
    size: 1000,
    page: 1,
  }) as any;

  const [filteredUser, setFilteredUser] = useState<any[]>([]);

  // this effect for filtering user based on selected counterId
  useEffect(() => {
    if (usersData?.data && userWiseSalesState?.counterId) {
      const filtered = usersData?.data?.filter((user: any) => user?.counterId?.toString() === userWiseSalesState?.counterId);
      setFilteredUser(() => filtered);
    }

  }, [userWiseSalesState?.counterId, usersData?.data])

  const handleSearch = () => {
    const { fromDate, toDate, counterId, userId, busType, orderStatus, dateType } = userWiseSalesState;
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
      counterId,
      dateType,
      orderStatus,
      busType
    });
  }

  const handleReset = () => {
    setUserWiseSalesState({
      fromCalenderOpen: false,
      toCalenderOpen: false,
      fromDate: null,
      toDate: null,
      counterId: "",
      userId: "",
      dateType: "",
      orderStatus: "",
      busType: "",
    })
  }

  const { data: stationsData, isLoading: stationsLoading } =
    useGetCountersQuery({
      page: 1,
      size: 99999999,
    }) as any;

  // const [saleData, setSaleData] = useState<any>();

  // const promiseResolveRef = useRef<any>(null);
  const printSaleRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_User_Wise_Sales_Report`,
  });

  const invoicePrintHandler = () => {
    handlePrint();
  };



  const dateTypes = [
    { id: "Purchase", name: "Purchase Date" },
    { id: "Journey", name: "Journey Date" },
  ];

  const orderStatuses = [
    { id: "Success", name: "Completed" },
    { id: "Pending", name: "Pending" },
    { id: "Cancelled", name: "Cancelled" },
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
        return (
          <div className="text-left font-bold">
            Total:
          </div>
        );
      },
    },
    {
      accessorKey: "coachConfig?.departureDate",
      header: translate("ভ্রমণের তারিখ", "Travel Date"),
      accessorFn: (row) => row?.coachConfig?.departureDate ?? "N/A",
    },
    {
      accessorKey: "coachConfig.coachNo",
      header: translate("কোচ নাম্বার", "Coach No"),
      accessorFn: (row) => row.coachConfig?.coachNo ?? "N/A",
    },

    {
      accessorKey: "class",
      header: translate("ক্লাস", "Class"),
      accessorFn: (row) => row.class ?? "N/A",
    },
    {
      accessorKey: "seat",
      header: translate("সিট", "Seat"),
      accessorFn: (row) => row.seat ?? "N/A",
    },
    {
      accessorKey: "status",
      header: translate("স্ট্যাটাস", "Status"),
      accessorFn: (row) => row.status ?? "N/A",
    },


    // {
    //   accessorKey: "fare",
    //   header: translate("ভাড়া", "Fare"),
    //   accessorFn: (row) => row.fare ?? "N/A",
    // },
    {
      accessorKey: "cancelBy",
      header: translate("ক্যানসেল করেছেন", "Cancel By"),
      accessorFn: (row) => row.cancelBy ?? "N/A",
    },
    {
      accessorKey: "unitPrice",
      header: translate("মূল্য", "Fare"),
      accessorFn: (row) => row.unitPrice ?? "N/A",
      footer: () => {
        const total = (userWiseSalesData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.unitPrice ?? 0),
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
      accessorKey: "discount",
      header: translate("ডিসকাউন্ট", "Discount"),
      accessorFn: (row) => row.discount ?? "N/A",
      footer: () => {
        const total = (userWiseSalesData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.discount ?? 0),
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
      accessorKey: "actualfare",
      header: translate("ডিসকাউন্ট", "Actual Fare"),
      accessorFn: (row) => row.unitPrice - row.discount,
      footer: () => {
        const totalDiscount = (userWiseSalesData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item.discount ?? 0),
          0
        );
        const totalFare = (userWiseSalesData?.data ?? []).reduce(
          (sum: number, item: any) => sum + Number(item?.unitPrice ?? 0),
          0
        );
        const total = totalFare - totalDiscount;

        return (
          <div className="font-bold">
            {total.toLocaleString()}
          </div>
        );
      },
    },

    // {
    //   accessorKey: "coachConfig.coach.route.routeName",
    //   header: translate("রুট", "Route"),
    //   accessorFn: (row) => row.coachConfig?.coach?.route?.routeName ?? "N/A",
    // },


  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            {translate("ব্যবহারকারী অনুসারে বিক্রয় রিপোর্ট", "User Wise Sales Report")}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-8">
            {/* Counter Select */}
            <InputWrapper
              label={translate("কাউন্টার", "Counter")}
              labelFor="counter"
              isRequired={true}
            >
              <SearchableSelect
                onValueChange={(value) =>
                  setUserWiseSalesState((prev) => ({
                    ...prev,
                    counterId: value,
                  }))
                }
                options={stationsData?.data?.map((station: any) => ({ id: station?.id, name: station?.name })) || []}
                labelKey={"name"}
                // disabled={!userWiseSalesState.counterId}
                value={userWiseSalesState?.counterId}
                placeholder={translate(
                  "কাউন্টার নির্বাচন করুন",
                  "Select counter"
                )}
                loading={stationsLoading}
                isReset={!userWiseSalesState?.counterId ? true : false}
              />
              {/* <Select
                value={userWiseSalesState.counterId}
                onValueChange={(value) =>
                  setUserWiseSalesState((prev) => ({
                    ...prev,
                    counterId: value,
                  }))
                }
              >
                <SelectTrigger id="counter" className="w-full">
                  <SelectValue
                    placeholder={translate(
                      "কাউন্টার নির্বাচন করুন",
                      "Select counter"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {!stationsLoading &&
                    stationsData?.data?.length > 0 &&
                    stationsData?.data?.map(
                      (singleStation: any, stationIndex: number) => (
                        <SelectItem
                          key={stationIndex}
                          value={singleStation?.id?.toString()}
                        >
                          {singleStation?.name}
                        </SelectItem>
                      )
                    )}

                  {stationsLoading && !stationsData?.data?.length && <Loader />}
                </SelectContent>
              </Select> */}
            </InputWrapper>

            {/* User Select */}
            <InputWrapper
              label={translate("ব্যবহারকারীগণ", "Users")}
              labelFor="user"
              isRequired={true}
            >
              <SearchableSelect
                onValueChange={(value) =>
                  setUserWiseSalesState((prev) => ({ ...prev, userId: value }))
                }
                options={filteredUser?.map((user) => ({ id: user?.id, name: user?.userName })) || []}
                labelKey={"name"}
                disabled={!userWiseSalesState.counterId}
                value={userWiseSalesState.userId}
                placeholder={translate(
                  "ব্যবহারকারী নির্বাচন করুন",
                  "Select user"
                )}
                loading={userLoading}
                isReset={!userWiseSalesState?.userId ? true : false}
              />
            </InputWrapper>

            {/* Date Type Select */}
            <InputWrapper
              label={translate("ক্রয় ডেটার ধরন", "Purchase date type")}
              labelFor="dateType"
              isRequired={true}
            >
              <Select
                value={userWiseSalesState?.dateType}
                onValueChange={(value: "Purchase" | "Journey" | "") => setUserWiseSalesState((prev) => ({ ...prev, dateType: value }))}
              // value={selectedDateType}
              // onValueChange={setSelectedDateType}
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
                open={userWiseSalesState.fromCalenderOpen}
                onOpenChange={(open) =>
                  setUserWiseSalesState((prev) => ({
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
                      !userWiseSalesState.fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {userWiseSalesState.fromDate ? (
                      format(userWiseSalesState.fromDate, "dd/MM/yyyy")
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
                    selected={userWiseSalesState.fromDate || new Date()}
                    onSelect={(date) =>
                      setUserWiseSalesState((prev) => ({
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
                open={userWiseSalesState.toCalenderOpen}
                onOpenChange={(open) =>
                  setUserWiseSalesState((prev) => ({
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
                      !userWiseSalesState.toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {userWiseSalesState.toDate ? (
                      format(userWiseSalesState.toDate, "dd/MM/yyyy")
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
                    selected={userWiseSalesState.toDate || new Date()}
                    onSelect={(date) =>
                      setUserWiseSalesState((prev) => ({
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
                value={userWiseSalesState.orderStatus}
                onValueChange={(value: "Pending" | "Success" | "Cancelled" | "") =>
                  setUserWiseSalesState((prev) => ({ ...prev, orderStatus: value }))
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
              label={translate("বাসের ধরণ", "Bus Type")}
              labelFor="busType"
              isRequired={true}
            >
              <Select
                value={userWiseSalesState.busType}
                onValueChange={(value: "AC" | "NON AC" | "") =>
                  setUserWiseSalesState((prev) => ({ ...prev, busType: value }))
                }
              >
                <SelectTrigger
                  id="coachType"
                  className="w-full uppercase text-xs lg:text-sm px-2 lg:px-3"
                >
                  <SelectValue
                    placeholder={translate("কোচের ধরণ", "Coach Type")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC" className="uppercase">
                    {translate("শীতাতপ নিয়ন্ত্রিত", "Air Condition")}
                  </SelectItem>
                  <SelectItem value="NON AC" className="uppercase">
                    {translate(
                      "শীতাতপ নিয়ন্ত্রিত বিহীন",
                      "Without Air Condition"
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
            </InputWrapper>
          </div>

          <div className="flex justify-end gap-4">
            <Button onClick={handleReset} variant="outline">
              {translate("রিসেট করুন", "Reset")}
            </Button>
            <Button onClick={handleSearch}
              disabled={
                !userWiseSalesState?.counterId
                || !userWiseSalesState?.userId
                || !userWiseSalesState?.dateType
                || !userWiseSalesState?.fromDate
                || !userWiseSalesState?.toDate
                || !userWiseSalesState?.orderStatus
                || !userWiseSalesState?.busType
              }
            >{translate("অনুসন্ধান করুন", "Search")}{isFetching && <Loader className="ml-2" />}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="mt-8 shadow-lg">
        {/* <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">
              {translate("", "Report Results")}
            </CardTitle>
            <div className="flex items-center gap-3">
              <Button variant={"primary"} size={"xs"}>
                Pdf
              </Button>
              <Button variant={"default"} size={"xs"}>
                Excel
              </Button>
            </div>
          </div>
        </CardHeader> */}

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
          {/* table start  */}
          <TableWrapper
            heading={translate("ভূমিকা তালিকা", "Report Results")}
          >
            <TableToolbar alignment="responsive">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3 ml-auto">
                  <PDFDownloadLink
                    document={
                      <PdfUserWiseSalesReport
                        result={userWiseSalesData?.data || []}
                        singleCms={singleCms}
                        userName={currentUser}
                        counter={stationsData?.data?.find((station: any) => station?.id?.toString() === userWiseSalesState?.counterId)?.name || ''}
                        selectedUser={filteredUser?.find((user: any) => user?.id?.toString() === userWiseSalesState?.userId)?.userName || ''}
                        startDate={userWiseSalesState?.fromDate ? format(userWiseSalesState?.fromDate, "dd/MM/yyyy") : ''}
                        endDate={userWiseSalesState?.toDate ? format(userWiseSalesState?.toDate, "dd/MM/yyyy") : ''}
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
                            disabled={userWiseSalesData?.data?.length ? false : true}
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
                  <PrintUserWiseSalesReport ref={printSaleRef}
                    result={userWiseSalesData?.data || []}
                    singleCms={singleCms}
                    userName={currentUser}
                    counter={stationsData?.data?.find((station: any) => station?.id?.toString() === userWiseSalesState?.counterId)?.name || ''}
                    selectedUser={filteredUser?.find((user: any) => user?.id?.toString() === userWiseSalesState?.userId)?.userName || ''}
                    startDate={userWiseSalesState?.fromDate ? format(userWiseSalesState?.fromDate, "dd/MM/yyyy") : ''}
                    endDate={userWiseSalesState?.toDate ? format(userWiseSalesState?.toDate, "dd/MM/yyyy") : ''} />
                  <UserWiseSalesReportExcel result={userWiseSalesData?.data || []} disabled={userWiseSalesData?.data?.length ? false : true} />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default UserWiseSales;
