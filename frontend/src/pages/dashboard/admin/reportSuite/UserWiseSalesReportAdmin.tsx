/* eslint-disable @typescript-eslint/no-unused-vars */
// Imports
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useGetUserListQuery,
  useGetUserWiseSaleAdminReportQuery,
} from "@/store/api/adminReport/adminReportApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { format } from "date-fns/format";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";

// Types
interface IUserWiseSalesReportAdminProps {}

interface ISalesAdminStateProps {
  userId: string | null;
  fromDate: Date | null;
  toDate: Date | null;
}

interface IQueryProps {
  sort: string;
  page: number;
  size: number;
  meta: {
    page: number;
    size: number;
    total: number;
    totalPage: number;
  };
}

// Component
const UserWiseSalesReportAdmin: FC<IUserWiseSalesReportAdminProps> = () => {
  const { translate } = useCustomTranslator();

  const [formState, setFormState] = useState<ISalesAdminStateProps>({
    userId: null,
    fromDate: null,
    toDate: null,
  });

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

  const { data: userList, isLoading: userListLoading } = useGetUserListQuery({
    size: 1000,
    page: 1,
  });

  const {
    data: salesData,
    isLoading: salesLoading,
    refetch,
  } = useGetUserWiseSaleAdminReportQuery(
    {
      userId: formState.userId,
      fromDate: formState.fromDate
        ? format(formState.fromDate, "yyyy-MM-dd")
        : "",
      toDate: formState.toDate ? format(formState.toDate, "yyyy-MM-dd") : "",
    },
    { skip: !formState.userId || !formState.fromDate || !formState.toDate }
  );

  const setValue = (key: keyof ISalesAdminStateProps, value: any) => {
    setFormState((prevState) => ({ ...prevState, [key]: value }));
  };

  useEffect(() => {
    if (formState.userId && formState.fromDate && formState.toDate) {
      refetch();
    }
  }, [formState.userId, formState.fromDate, formState.toDate, refetch]);

  if (salesLoading || userListLoading) {
    return <TableSkeleton columns={8} />;
  }

  const records = salesData?.data?.records || [];

  const columns = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      //@ts-ignore
      cell: (info) => info.row.index + 1, // Static index based on the row position
    },
    {
      accessorKey: "travelDate",
      header: translate("ভ্রমণের তারিখ", "Travel Date"),
    },
    {
      accessorKey: "coachInfo",
      header: translate("কোচের তথ্য", "Coach Info"),
    },
    {
      accessorKey: "schedule",
      header: translate("সময়সূচী", "Schedule"),
    },
    {
      accessorKey: "route",
      header: translate("রুট", "Route"),
    },
    {
      accessorKey: "soldSeatQty",
      header: translate("বিক্রিত আসন সংখ্যা", "Sold Seats"),
    },
    {
      accessorKey: "complementarySeatQty",
      header: translate("ফ্রি আসন সংখ্যা", "Complementary Seats"),
    },
    {
      accessorKey: "grossFare",
      header: translate("মোট ভাড়া", "Gross Fare"),
    },
  ];

  return (
    <PageWrapper>
      <div className="grid grid-cols-3 gap-6 p-6 border-2 justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] rounded-lg shadow">
        {/* User Dropdown */}
        <div>
          <h2 className="mb-2 font-semibold">Select User</h2>
          <Select
            value={formState.userId || ""}
            onValueChange={(value) => setValue("userId", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {userList?.data?.map((user: any) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.userName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* From Date */}
        <div>
          <h2 className="mb-2 font-semibold">From Date</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal text-sm h-10",
                  !formState.fromDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {formState.fromDate
                  ? format(formState.fromDate, "PPP")
                  : "Select From Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                mode="single"
                selected={formState.fromDate || new Date()}
                onSelect={(date) => {
                  setValue("fromDate", date);
                }}
                fromYear={1900}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */}
        <div>
          <h2 className="mb-2 font-semibold">To Date</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal text-sm h-10",
                  !formState.toDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {formState.toDate
                  ? format(formState.toDate, "PPP")
                  : "Select To Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                mode="single"
                selected={formState.toDate || new Date()}
                onSelect={(date) => {
                  setValue("toDate", date);
                }}
                fromYear={1900}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <TableWrapper
        subHeading={translate(
          "ব্যবহারকারীর সেলস তথ্য",
          "User's Sales Information"
        )}
        heading={translate("সেলস রিপোর্ট", "Sales Report")}
      >
        <TableToolbar alignment="responsive">
          <Button variant="green" size="sm">
            <LuDownload className="size-4 mr-1" />
            {translate("এক্সপোর্ট", "Export")}
          </Button>
        </TableToolbar>

        <DataTable
          //@ts-ignore
          query={query}
          //@ts-ignore
          setQuery={setQuery}
          pagination
          columns={columns}
          data={records}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default UserWiseSalesReportAdmin;
