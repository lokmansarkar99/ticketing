import PageTransition from "@/components/common/effect/PageTransition";
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
import { useGetTodaysSaleAdminReportQuery } from "@/store/api/adminReport/adminReportApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ColumnDef } from "@tanstack/react-table";
import { FC, useState } from "react";
import { LuDownload } from "react-icons/lu";
import PdfTodaySalesReport from "../todaySale/pdf/PdfTodaySalesReport";
import { Loader } from "@/components/common/Loader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import TodaySalesExcel from "../todaySale/excel/ExcelTodaySales";
interface IReportSuite { }

const ReportSuite: FC<IReportSuite> = () => {
    const { data: singleCms } = useGetSingleCMSQuery(
      {}
    );
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
  const { data: salesData, isLoading: salesLoading } =
    useGetTodaysSaleAdminReportQuery({});

  const totalItems = salesData?.data?.todaySalesHistory?.length || 0;

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
  if (salesLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <PageWrapper>
      {/* sales information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 gap-y-4 my-5">
        <PageTransition className="w-full flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-4 flex justify-center items-center w-full gap-2">
            <h2 className="text-sm">Todays Sales:</h2>
            <h2 className="text-sm">
              {salesData?.data?.todaySales !== 0
                ? salesData?.data?.todaySales
                : 0}
            </h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-4 flex justify-center items-center w-full gap-2">
            <h2 className="text-sm">Todays Online Sales:</h2>
            <h2 className="text-sm">
              {salesData?.data?.todayOnlineSales !== 0
                ? salesData?.data?.todayOnlineSales
                : 0}
            </h2>
          </div>
        </PageTransition>{" "}
        <PageTransition className="w-full flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-4 flex justify-center items-center w-full gap-2">
            <h2 className="text-sm">Todays Offline Sales:</h2>
            <h2 className="text-sm">
              {salesData?.data?.todayOfflineTicketCount !== 0
                ? salesData?.data?.todayOfflineTicketCount
                : 0}
            </h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-4 flex justify-center items-center w-full gap-2">
            <h2 className="text-sm">Todays Cancel Tickit:</h2>
            <h2 className="text-sm">
              {salesData?.data?.todayCancelTicketCount !== 0
                ? salesData?.data?.todayCancelTicketCount
                : 0}
            </h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-4 flex justify-center items-center w-full gap-2">
            <h2 className="text-sm">Todays Online Tickit:</h2>
            <h2 className="text-sm">
              {salesData?.data?.todayOnlineTicketCount !== 0
                ? salesData?.data?.todayOnlineTicketCount
                : 0}
            </h2>
          </div>
        </PageTransition>
      </div>
      {/* sales information */}
      <TableWrapper
        subHeading={translate(
          "আজকের সেলস তথ্য উপাত্ত",
          "Today's Sales Information"
        )}
        heading={translate("আজকের সেলস", "Today's Sales")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="green" size="sm">
                    <LuDownload className="size-4 mr-1" />
                    {translate("এক্সপোর্ট", "Export")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cn("w-[100px] space-y-2")}
                  align="end"
                >
                  <DropdownMenuItem>
                    <PDFDownloadLink
                      document={
                        <PdfTodaySalesReport
                          result={salesData?.data?.todaySalesHistory || []}
                          singleCms={singleCms}
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
                              variant="destructive"
                              size="xs"
                            >
                              <Loader /> {translate("পিডিএফ", "PDF")}
                            </Button>
                          ) : (
                            <Button variant="destructive" size="xs">
                              {translate("পিডিএফ", "PDF")}
                            </Button>
                          );
                        }
                      }
                    </PDFDownloadLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <TodaySalesExcel result={salesData?.data?.todaySalesHistory || []} />
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
          data={salesData?.data?.todaySalesHistory || []} // Passing sales history data
        />
      </TableWrapper>
    </PageWrapper>
  );
};
export default ReportSuite;
