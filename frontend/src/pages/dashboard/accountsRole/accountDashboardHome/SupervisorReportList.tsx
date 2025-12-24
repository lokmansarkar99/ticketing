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
import { useGetAccountDashboardHomeDataQuery } from "@/store/api/accounts/accountsDashboardApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { LuDownload } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function SupervisorReportList() {
  const { translate } = useCustomTranslator();
  //const [selectedData, setSelectedData] = useState<any>(null);

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

  // Fetch data for the dashboard
  const { data: accountReportData, isLoading: accountDataLoading } =
    useGetAccountDashboardHomeDataQuery({
      sort: query.sort,
      page: query.page,
      size: query.size,
    });
  //const [isModalOpen, setIsModalOpen] = useState(false);

  const totalItems = accountReportData?.data?.length || 0;

  // Define columns for DataTable
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info) =>
        totalItems > 0
          ? (query.page - 1) * query.size + info.row.index + 1
          : null,
    },
    {
      accessorKey: "cashOnHand",
      header: translate("হাতে নগদ", "Cash On Hand"),
    },
    {
      accessorKey: "supervisor.userName",
      header: translate("সুপারভাইজার নাম", "Supervisor Name"),
    },

    {
      accessorKey: "upWayDate",
      header: translate("আপ ওয়ে তারিখ", "Up Way Date"),
    },
    {
      accessorKey: "downWayDate",
      header: translate("ডাউন ওয়ে তারিখ", "Down Way Date"),
    },
    {
      accessorKey: "upWayCoach.coach.coachNo",
      header: translate("আপ কোচ", "Up Coach"),
    },
    {
      accessorKey: "downWayCoach.coach.coachNo",
      header: translate("ডাউন কোচ", "Down Coach"),
    },
    {
      header: translate("কার্যক্রম", "Action"),
      cell: ({ row }: { row: any }) => (
        <Link
          to={`/accounts/dashboard/report_details_account/${row.original.id}`}
          className=" hover:underline"
        >
          {translate("দেখুন", "View")}
        </Link>
      ),
    },
  ];

  // If loading, show skeleton
  if (accountDataLoading) {
    return <TableSkeleton columns={7} />;
  }

  // Handle empty data
  // if (!accountReportData?.data || accountReportData?.data.length === 0) {
  //   return (
  //     <PageWrapper>
  //       <h2 className="font-bold text-center mt-10 text-xl">
  //         {translate("কোনো প্রতিবেদন পাওয়া যায়নি", "No Reports Found")}
  //       </h2>
  //     </PageWrapper>
  //   );
  // }

  return (
    <PageWrapper>
      {/* Dashboard Cards */}

      {/* Data Table */}
      <TableWrapper
        subHeading={translate(
          "আজকের  তথ্য উপাত্ত",
          "Today's Report Information"
        )}
        heading={translate("আজকের তথ্য উপাত্ত", "Today's Report")}
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

        {/* Displaying Table Data */}
        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={accountReportData?.data || []}
        />
      </TableWrapper>
    </PageWrapper>
  );
}
