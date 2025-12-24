import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ColumnDef } from "@tanstack/react-table";
import { FC, useState } from "react";
import { LuDownload } from "react-icons/lu";
import PdfCancelHistory from "./pdf/PdfCancelHistory";
import { Loader } from "@/components/common/Loader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import TodayCancelExcel from "./excel/ExcelCancelHistory";

interface salesDataProps {
  salesData: any;
}

const CancelHistory: FC<salesDataProps> = ({ salesData }) => {
  const totalItems = salesData?.cancelHistory?.length || 0;
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

  const { data: singleCms } = useGetSingleCMSQuery({});
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      size:65,
      cell: (info) =>
        totalItems > 0
          ? (query.page - 1) * query.size + info.row.index + 1
          : null,
    },
    {
      accessorKey: "coachConfig.coachNo",
      header: translate("কোচ নম্বর", "Coach No"),
      size:150
    },
 
    {
      accessorKey: "seat",
      header: translate("আসন", "Seat"),
      size:70
    },
    {
      accessorKey: "date",
      header: translate("তারিখ", "Purchase Date"),
      cell: (info) => {
        const value = info.getValue();
        if (typeof value === "string" || typeof value === "number") {
          return new Date(value).toLocaleDateString();
        }
        return "Invalid date";
      },
    },
   {
      accessorKey: "date",
      header: translate("", "Journey Date"),
      size:90
    },
    {
      accessorKey: "order.customerName",
      header: translate("গ্রাহকের নাম", "Passenger"),
    },
    {
      accessorKey: "order.phone",
      header: translate("ফোন নম্বর", "Mobile"),
      size:90
    },
    {
      accessorKey: "coachConfig.coach.route.routeName",
      header: translate("ফোন নম্বর", "Route"),
    },
    {
      accessorKey: "unitPrice",
      header: translate("ইউনিট মূল্য", "Fare"),
      size:50, 
      cell: (info) => `${info.getValue()}`,
    },
    {
      accessorKey: "cancellationFee",
      header: translate("সময়সূচী", "Cancellation Fee"),
      size:100,
       cell: ({ row }) => {
        const value = row.original.cancellationFee;
        return value ? value : 0.0;
      },
    },
    {
      accessorKey: "refundAmount",
      header: translate("সময়সূচী", "Refund"),
    },
    {
      accessorKey: "cancelByUser.userName",
      header: translate("সময়সূচী", "Cancel By"),
    },

  ];

  return (
    <div>
      <TableWrapper
        heading=""
        subHeading=""
        // subHeading={translate(
        //   "আজকের সেলস তথ্য উপাত্ত",
        //   "Today's Sales Information"
        // )}
        // heading={translate("আজকের সেলস", "Today's Sale")}
      >
        <TableToolbar alignment="responsive" className="mb-1 mt-0">
          <TabsList className="mr-auto p-0 border-0 h-auto">
            <TabsTrigger value="todaySalesHistory" >
              Today Sales History
            </TabsTrigger>
            <TabsTrigger value="cancelHistory" >
              Todays Cancel History
            </TabsTrigger>
            <TabsTrigger value="onlineHistory" >
              Todays Online History
            </TabsTrigger>
            <TabsTrigger value="onlineHistoryCancel" >
              Todays Online Cancellation History
            </TabsTrigger>
            <TabsTrigger value="onlineMigrateHistory" >
              Todays Migrate History
            </TabsTrigger>
          </TabsList>
          <ul className="flex items-center gap-x-2">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="green" size="xs" shape="rounded_sm">
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
                        <PdfCancelHistory
                          result={salesData?.cancelHistory || []}
                          singleCms={singleCms}
                        />
                      }
                      fileName="today_ticket_cancel_report.pdf"
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
                    <TodayCancelExcel result={salesData?.cancelHistory || []} />
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
          data={salesData?.cancelHistory || []}
        />
      </TableWrapper>
    </div>
  );
};

export default CancelHistory;
