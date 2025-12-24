// SupervisorDashboardHome.tsx
import PageTransition from "@/components/common/effect/PageTransition";
import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGetTodaysCoachConfigListQuery } from "@/store/api/superviosr/supervisorCollectionApi";
import { useGetSupervisorUpDownDetailsQuery } from "@/store/api/superviosr/supervisorExpenseApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";
import { MdDetails } from "react-icons/md";
import { useSelector } from "react-redux";
import CoachDetailsForSupervisor from "./CoachDetailsForSupervisor";
import SupervisorCoachAndFIleDetails from "./SupervisorCoachAndFIleDetails";
interface IReportSuite {}

const SupervisorDashboardHome: FC<IReportSuite> = () => {
  const { translate } = useCustomTranslator();
  //const navigate = useNavigate();

  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: 0,
      size: 10,
      total: 100,
      totalPage: 10,
    },
  });
  const [dateRange, setDateRange] = useState<{
    upDate: Date | null;
    downDate: Date | null;
    upCalendarOpen: boolean;
    downCalendarOpen: boolean;
  }>({
    upDate: null,
    downDate: null,
    upCalendarOpen: false,
    downCalendarOpen: false,
  });

  const { data: coachData, isLoading: coachLoading } =
    useGetTodaysCoachConfigListQuery("supervisor");

  const user = useSelector((state: any) => state.user);
  const handleDateChange = (
    selectedDate: Date,
    type: "upDate" | "downDate"
  ) => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd"); // Ensure consistent format
    setDateRange((prev) => ({
      ...prev,
      [type]: selectedDate,
      [`${type}CalendarOpen`]: false,
    }));
    localStorage.setItem(type, formattedDate); // Store the formatted date
  };

  // Load dates from local storage on component mount
  useEffect(() => {
    const savedUpDate = localStorage.getItem("upDate");
    const savedDownDate = localStorage.getItem("downDate");

    setDateRange({
      upDate: savedUpDate ? new Date(savedUpDate) : null,
      downDate: savedDownDate ? new Date(savedDownDate) : null,
      upCalendarOpen: false,
      downCalendarOpen: false,
    });
  }, []);

  const { data: coachDetailsData, isLoading: coachDetailsLoading } =
    useGetSupervisorUpDownDetailsQuery(
      dateRange.upDate && dateRange.downDate
        ? {
            upDate: format(dateRange.upDate, "yyyy-MM-dd"),
            downDate: format(dateRange.downDate, "yyyy-MM-dd"),
            supervisorId: user.id,
          }
        : skipToken
    );

  const totalItems = coachData?.data?.length || 0;
  //@ts-ignore
  const upDownTotal =
    coachDetailsData?.data?.totalDownIncome +
    coachDetailsData?.data?.totalUpIncome;
  //@ts-ignore
  const totalOtherIncome =
    coachDetailsData?.data?.othersIncomeDownWay +
    coachDetailsData?.data?.othersIncomeUpWay;
  //@ts-ignore
  const chasOnHand =
    upDownTotal +
    coachDetailsData?.data?.totalDownOpeningBalance +
    coachDetailsData?.data?.totalUpOpeningBalance +
    coachDetailsData?.data?.othersIncomeDownWay +
    coachDetailsData?.data?.othersIncomeUpWay -
    coachDetailsData?.data?.totalExpense;
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info) =>
        totalItems > 0
          ? (query.page - 1) * query.size + info.row.index + 1
          : null,
    },
    { accessorKey: "coachNo", header: translate("কোচ নম্বর", "Coach Number") },
    {
      accessorKey: "registrationNo",
      header: translate("নিবন্ধন নম্বর", "Registration Number"),
    },
    { accessorKey: "coachType", header: translate("কোচের ধরন", "Coach Type") },
    {
      accessorKey: "supervisorStatus",
      header: translate("সুপারভাইজার অবস্থা", "Supervisor Status"),
    },

    {
      accessorKey: "seatAvailable",
      header: translate("আসন সংখ্যা", "Available Seats"),
    },
    {
      accessorKey: "coachClass",
      header: translate("কোচ শ্রেণী", "Coach Class"),
      cell: ({ row }) => {
        const coachinfo = row.original;
        return coachinfo.coachClass === "B_Class"
          ? "Business Class"
          : coachinfo.coachClass === "S_Class"
          ? "Suite Class"
          : coachinfo.coachClass === "Sleeper"
          ? "Sleeper Coach"
          : "Economy Class";
      },
    },
    { accessorKey: "schedule", header: translate("সময়সূচি", "Schedule") },
    {
      accessorKey: "departureDate",
      header: translate("প্রস্থানের তারিখ", "Departure Date"),
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      accessorKey: "departureDate",
      header: translate("ফাইল দেখুন", "View Files"),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex gap-2">
            {/* Edit Button */}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="xs">
                  <MdDetails className="mr-1" />
                  {translate("বিস্তারিত", "Details")}
                </Button>
              </DialogTrigger>
              <DialogContent size="lg">
                <DialogTitle>Details</DialogTitle>
                <SupervisorCoachAndFIleDetails item={item} />
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  if (coachLoading) {
    return <TableSkeleton columns={10} />;
  }
  return (
    <PageWrapper>
      {/* code for date select */}
      <div className="page-container">
        <div className="flex lg:flex-row flex-col gap-3 mb-6">
          {/* Up Date Picker */}
          {/* Journey Date Picker */}
          <Popover
            open={dateRange.upCalendarOpen}
            onOpenChange={(open) =>
              setDateRange((prev) => ({ ...prev, upCalendarOpen: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-48"
                size="lg"
                disabled={!!dateRange.upDate} // Disable if the journey date is already selected
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.upDate
                  ? format(dateRange.upDate, "PPP")
                  : translate(
                      "যাত্রার তারিখ নির্বাচন করুন",
                      "Select Journey Date"
                    )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                mode="single"
                selected={dateRange.upDate || undefined}
                onSelect={(date: any) => {
                  if (date && !dateRange.upDate) {
                    handleDateChange(date, "upDate");
                  }
                }}
                fromYear={1900}
                toYear={new Date().getFullYear()}
                disabled={(date) =>
                  dateRange.downDate ? date > dateRange.downDate : false
                } // Disable dates after the return date
              />
            </PopoverContent>
          </Popover>

          {/* Return Date Picker */}
          <Popover
            open={dateRange.downCalendarOpen}
            onOpenChange={(open) =>
              setDateRange((prev) => ({ ...prev, downCalendarOpen: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-48"
                size="lg"
                disabled={!!dateRange.downDate} // Disable if the return date is already selected
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.downDate
                  ? format(dateRange.downDate, "PPP")
                  : translate(
                      "ফেরার তারিখ নির্বাচন করুন",
                      "Select Return Date"
                    )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                mode="single"
                //@ts-ignore
                selected={dateRange.downDate || undefined}
                onSelect={(date: any) => {
                  if (date && !dateRange.downDate) {
                    handleDateChange(date, "downDate");
                  }
                }}
                fromYear={1900}
                toYear={new Date().getFullYear()}
                disabled={(date) =>
                  dateRange.upDate ? date < dateRange.upDate : false
                } // Disable dates before the journey date
              />
            </PopoverContent>
          </Popover>
          {/* reset date button */}
          <Button
            variant="default"
            size="lg"
            className="w-48"
            onClick={() => {
              localStorage.removeItem("upDate");
              localStorage.removeItem("downDate");
              setDateRange((prev) => ({
                ...prev,
                upDate: null,
                downDate: null,
              }));
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      {/* code for date select */}
      {coachDetailsLoading ? (
        <DetailsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 gap-y-4 my-2">
          <PageTransition className="w-full flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-3 flex flex-col justify-start items-start w-full">
              <h2 className="text-sm">Opening Balance</h2>
              <h2 className="mt-2 text-sm">
                Total:
                {coachDetailsData?.data?.totalUpOpeningBalance
                  ? coachDetailsData?.data?.totalUpOpeningBalance
                  : 0.0}
              </h2>
            </div>
          </PageTransition>

          <PageTransition className="w-full  flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-3 flex flex-col justify-start items-start w-full">
              <h2 className="text-sm">Up Income</h2>
              <h2 className="mt-2 text-sm">
                Total: {coachDetailsData?.data?.totalUpIncome}
              </h2>
            </div>
          </PageTransition>

          <PageTransition className="w-full  flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-3 flex flex-col justify-start items-start w-full">
              <h2 className="text-sm">Down Income </h2>
              <h2 className="mt-2 text-sm">
                Total: {coachDetailsData?.data?.totalDownIncome}
              </h2>
            </div>
          </PageTransition>
          <PageTransition className="w-full  flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-3 flex flex-col justify-start items-start w-full">
              <h2 className="text-sm">Total Expense</h2>
              <h2 className="mt-2 text-sm">
                Total:{coachDetailsData?.data?.totalExpense}
              </h2>
            </div>
          </PageTransition>
          <PageTransition className="w-full flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-3 flex flex-col justify-start items-start w-full">
              <h2 className="text-sm">Other Income: </h2>
              <h2 className="mt-2 text-sm">
                Total:{totalOtherIncome ? totalOtherIncome : 0}
              </h2>
            </div>
          </PageTransition>
          <PageTransition className="w-full  flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-3 flex flex-col justify-start items-start w-full">
              <h2 className="text-sm">Cash In Hand </h2>
              <h2 className="mt-2 text-sm">Total:{chasOnHand ? chasOnHand : 0}</h2>
            </div>
          </PageTransition>
          <PageTransition className="w-full  flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-3 flex flex-col justify-start items-start w-full">
              <h2 className="text-sm">Total Token: </h2>
              <h2 className="mt-2 text-sm">Piece: 0</h2>
            </div>
          </PageTransition>
        </div>
      )}

      <TableWrapper
        subHeading={translate("কোচ তথ্য উপাত্ত", "Coach Information Data")}
        heading={translate("কোচ তালিকা", "Today's Coach List")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="xs">
                    <LuDownload className="size-4 mr-1" />
                    {translate("এক্সপোর্ট", "Export")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cn("w-[100px] space-y-2")}
                  align="end"
                >
                  <DropdownMenuItem>
                    {translate("পিডিএফ", "PDF")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {translate("এক্সেল", "Excel")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </TableToolbar>

        <DataTable
          query={query}
          setQuery={setQuery}
          columns={columns}
          data={coachData?.data || []}
        />
      </TableWrapper>
      {coachData?.data?.length > 0 && coachData?.data[0]?.id && (
        <CoachDetailsForSupervisor
          //@ts-ignore
          coachId={coachData.data[0].id}
        />
      )}
    </PageWrapper>
  );
};

export default SupervisorDashboardHome;
