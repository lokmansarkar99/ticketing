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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetTodayCancelRequestListQuery } from "@/store/api/bookingApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useState } from "react";
import { LuDownload } from "react-icons/lu";
// import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SaleData } from "@/types/dashboard/vehicleeSchedule.ts/order";
import AcceptRequest from "./AcceptRequest";
import CancelTicketRequestDetails from "./CancelTicketRequestDetails";

interface ISalesListProps { }
export interface ICancelTicketRequestProps {
  search: string;
  addUserOpen: boolean;
  updateModalOpeans: boolean;
  detailsModalOpen: boolean;
  usersList: Partial<any[]>;
  selectedOrderId: number | null;
}

const CancelTicketRequestList: FC<ISalesListProps> = () => {
  const { translate } = useCustomTranslator();
  // const { toastMessage } = useMessageGenerator();
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 100, totalPage: 10 },
  });
  //const bookingState = useSelector(selectCounterSearchFilter);

  const [cancelTicketRequest, setCancelTicketRequest] =
    useState<ICancelTicketRequestProps>({
      search: "",
      addUserOpen: false,
      updateModalOpeans: false,
      detailsModalOpen: false,
      usersList: [],
      selectedOrderId: null,
    });

  // Fetch sales data using the API hook
  const { data: todayCancelRequest, isLoading: todayCancelRequestLoading } =
    useGetTodayCancelRequestListQuery({
      search: cancelTicketRequest.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info) => (query.page - 1) * query.size + info.row.index + 1,
    },
    { accessorKey: "id", header: translate("সেল আইডি", "Sale ID") },
    {
      accessorKey: "order?.customerName",
      header: translate("গ্রাহকের নাম", "Customer Name"),
      cell: ({ row }) => {
        return row.original.order.customerName || "N/A"
      },
    },
    {
      accessorKey: "seat",
      header: translate("আসন", "Seat"),
      cell: ({ row }) => {
        return row.original.seat || "N/A"
      },
    },
    {
      accessorKey: "dueAmount",
      header: translate("বকেয়া পরিমাণ", "Due Amount"),
      cell: ({ row }) => {
        return row.original.order.dueAmount
      },
    },
    {
      accessorKey: "paymentMethod",
      header: translate("পেমেন্ট পদ্ধতি", "Payment Method"),
    },
    { accessorKey: "status", header: translate("স্ট্যাটাস", "Status") },
    {
      accessorKey: "unitPrice",
      header: translate("ইউনিট মূল্য", "Unit Price"),
    },
    {
      accessorKey: "createdAt",
      header: translate("তৈরির তারিখ", "Created At"),
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      header: translate("কার্যক্রম", "Actions"),
      id: "actions",
      cell: ({ row }) => {
        const cancel = row.original as SaleData;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel>
                {translate("কার্যক্রমগুলো", "Actions")}
              </DropdownMenuLabel>

              {/* ACCEEPT REQUEST DATA */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("অনুরোধ গ্রহন", "Accept Request")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <AcceptRequest requestData={cancel} />
                </DialogContent>
              </Dialog>
              {/* DETAILS TODAY CANCEL REQUEST DATA */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("বিস্তারিত", "Details")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <CancelTicketRequestDetails id={cancel?.orderId} />
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  if (todayCancelRequestLoading) {
    return <TableSkeleton columns={7} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "আজকের টিকিট বাতিলের অনুরোধের তথ্য উপাত্ত",
          "Today's Sales Information"
        )}
        heading={translate(
          "আজকের টিকিট বাতিলের অনুরোধ",
          "Today's Ticket Cancel Request"
        )}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCancelTicketRequest((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate("search", "search")}
              />
            </li>
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
          data={todayCancelRequest?.data || []}
        />
      </TableWrapper>

      {/*
      {cancelTicketRequest.updateModalOpeans && (
        <UpdateCounterOrderModal
          isOpen={cancelTicketRequest.updateModalOpeans}
          onClose={closeUpdateModal}
          order={salesTickitList?.data?.todaySalesHistory.find(
            (order: any) => order.id === cancelTicketRequest.selectedOrderId
          )}
        />
      )} */}
    </PageWrapper>
  );
};

export default CancelTicketRequestList;
