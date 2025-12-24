import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useGetSalesTickitListQuery } from "@/store/api/counter/counterSalesBookingApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { FC, useState } from "react";
import { LuDownload } from "react-icons/lu";

interface ISalesListProps {}
export interface ISalesDataStateProps {
  search: string;
  addUserOpen: boolean;
  usersList: Partial<any[]>;
  userId: number | null;
}

const CounterTodaysCancel: FC<ISalesListProps> = () => {
  const { translate } = useCustomTranslator();

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

  // const [salesTickitState, setSalesTickitState] =
  //   useState<ISalesDataStateProps>({
  //     search: "",
  //     addUserOpen: false,
  //     usersList: [],
  //     userId: null,
  //   });

  // Fetch sales data using the API hook
  const { data: salesTickitList, isLoading: loadingSalesTickit } =
    useGetSalesTickitListQuery({});

  // Log the sales data

  // Calculate total items for pagination
  const totalItems = salesTickitList?.data?.todaySalesHistory?.length || 0;

  // Define columns based on the API response
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info) =>
        totalItems > 0 // Check if there are items before calculating the index
          ? (query.page - 1) * query.size + info.row.index + 1
          : null,
    },
    {
      accessorKey: "id",
      header: translate("সেল আইডি", "Sale ID"),
    },
    {
      accessorKey: "order.customerName",
      header: translate("গ্রাহকের নাম", "Customer Name"),
    },
    {
      accessorKey: "seat",
      header: translate("আসন", "Seat"),
    },
    {
      accessorKey: "paymentMethod",
      header: translate("পেমেন্ট পদ্ধতি", "Payment Method"),
    },
    {
      accessorKey: "status",
      header: translate("স্ট্যাটাস", "Status"),
    },
    {
      accessorKey: "unitPrice",
      header: translate("ইউনিট মূল্য", "Unit Price"),
    },
    {
      accessorKey: "createdAt",
      header: translate("তৈরির তারিখ", "Created At"),
      //@ts-ignore
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
  ];

  // Show a skeleton if the data is loading
  if (loadingSalesTickit) {
    return <TableSkeleton columns={7} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "আজকের অনলাইন বাতিল সেলস তথ্য উপাত্ত",
          "Today's Online Cancel Sales Information"
        )}
        heading={translate(
          "আজকের অনলাইন বাতিল সেলস",
          "Today's Online Cancel Sales"
        )}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
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
          pagination
          columns={columns}
          data={salesTickitList?.data?.onlineHistoryCancel || []} // Passing sales history data
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default CounterTodaysCancel;
