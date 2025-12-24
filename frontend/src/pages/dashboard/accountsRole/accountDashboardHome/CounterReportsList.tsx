import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useGetAccountDashboardCounterReportDataQuery } from "@/store/api/accounts/accountsDashboardApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { LuDownload } from "react-icons/lu";
import AuthorizeCounterReportModal from "./AuthorizeCounterReportModal";

export default function CounterReportsList() {
  const { translate } = useCustomTranslator();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Fetch data for the dashboard
  const { data: accountReportData, isLoading: accountDataLoading } =
    useGetAccountDashboardCounterReportDataQuery({
      sort: query.sort,
      page: query.page,
      size: query.size,
    });

  const closeModal = () => {
    setIsModalOpen(false);
  };
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
      accessorKey: "tripNo",
      header: translate("ট্রিপ নম্বর", "Trip No"),
    },
    {
      accessorKey: "date",
      header: translate("তারিখ", "Date"),
    },
    {
      accessorKey: "totalPassenger",
      header: translate("মোট যাত্রী", "Total Passengers"),
    },
    {
      accessorKey: "amount",
      header: translate("মোট পরিমাণ", "Amount"),
    },
    {
      accessorKey: "authorizeStatus",
      header: translate("অনুমোদন স্ট্যাটাস", "Authorization Status"),
      cell: (info) =>
        info.row.original.authorizeStatus ? "Authorized" : "Not Authorized",
    },
    {
      accessorKey: "coachConfig.coach.coachNo",
      header: translate("কোচ নং", "Coach No"),
    },
    {
      header: translate("কার্যক্রম", "Action"),
      cell: ({ row }: { row: any }) => (
        <Button
          variant="link"
          onClick={() => {
            setSelectedReport(row.original); // Set the selected report data
            setIsModalOpen(true); // Open the modal
          }}
        >
          {translate("দেখুন", "Authorize")}
        </Button>
      ),
    },
  ];

  // If loading, show skeleton
  if (accountDataLoading) {
    return <TableSkeleton columns={8} />;
  }
  return (
    <PageWrapper>
      {/* Dashboard Cards */}

      {/* Data Table */}
      <TableWrapper
        subHeading={translate(
          "আজকের তথ্য উপাত্ত",
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
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent size="lg">
            <DialogTitle>{translate("অনুমোদন করুন", "Authorize")}</DialogTitle>

            <AuthorizeCounterReportModal
              reportId={selectedReport.id}
              closeModal={closeModal}
              amount={selectedReport.amount}
            />
          </DialogContent>
        </Dialog>
      )}
    </PageWrapper>
  );
}
