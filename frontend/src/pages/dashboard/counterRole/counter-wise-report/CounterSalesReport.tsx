import PageTransition from "@/components/common/effect/PageTransition";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
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
import { useGetSalesTickitListQuery } from "@/store/api/counter/counterSalesBookingApi";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { LuDownload } from "react-icons/lu";
import { useReactToPrint } from "react-to-print";
import { ISalesDataStateProps } from "../counterHome/CounterDashboardHome";
import { ColumnDef } from "@tanstack/react-table";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useOrderCancelRequestMutation } from "@/store/api/bookingApi";
import { MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CounterOrderDetailsModal from "../sales/CounterOrderDetailsModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import UpdateCounterOrderModal from "../sales/UpdateCounterOrderModal";
import TickitPrintSingle from "../../printLabel/TicketPrintSingle";

const CounterSalesReport = () => {
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 100, totalPage: 10 },
  });
  const [cancelRequest] = useOrderCancelRequestMutation();
  const printSaleRef = useRef(null);
  // STORE PROMISE RESOLVE REFERENCE
  const promiseResolveRef = useRef<any>(null);
  //const dispatch = useDispatch();
  const { translate } = useCustomTranslator();
  const [invoiceData, setInvoiceData] = useState();

  const [salesTickitState, setSalesTickitState] =
    useState<ISalesDataStateProps>({
      search: "",
      addUserOpen: false,
      updateModalOpeans: false,
      detailsModalOpen: false,
      usersList: [],
      selectedOrderId: null,
      isPrinting: false,
    });

  // Fetch sales data using the API hook
  const { data: salesTickitList, isLoading: loadingSalesTickit } =
    useGetSalesTickitListQuery({
      search: salesTickitState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });

  const handleUpdateClick = (orderId: number) => {
    setSalesTickitState((prev) => ({
      ...prev,
      updateModalOpeans: true,
      selectedOrderId: orderId,
    }));
  };

  const handleCancelRequest = async (id: number) => {
    try {
      await cancelRequest({
        seats: [id],
      }).unwrap();

      toast.success(
        translate(
          "টিকিট বাতিলের অনুরোধ সফল হয়েছে।",
          "Ticket cancel request successful."
        )
      );
    } catch (error) {
      toast.error(
        translate(
          "টিকিট বাতিল করতে সমস্যা হয়েছে।",
          "Failed to cancel tickets."
        )
      );
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info) => (query.page - 1) * query.size + info.row.index + 1,
    },
    {
      accessorKey: "coachConfig.coachNo",
      header: translate("কোচ নং", "Coach No"),
    },
    {
      accessorKey: "order.customerName",
      header: translate("গ্রাহকের নাম", "Customer Name"),
    },
    {
      accessorKey: "seat",
      header: translate("আসন", "Seat"),
      // cell: ({ row }) =>
      //   row.original.orderSeat?.map((s: any) => s.seat).join(", ") || "N/A",
    },
    {
      accessorKey: "dueAmount",
      header: translate("বকেয়া পরিমাণ", "Due Amount"),
    },
    {
      accessorKey: "paymentMethod",
      header: translate("পেমেন্ট পদ্ধতি", "Payment Method"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const color = status === "Success" ? "text-green-700" : "text-red-700";
        return <span className={`${color} font-semibold`}>{status}</span>;
      },
    },
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
        const order = row.original as any;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                onMouseEnter={() => setInvoiceData(order)}
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel>
                {translate("কার্যক্রমগুলো", "Actions")}
              </DropdownMenuLabel>
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
                  <CounterOrderDetailsModal id={order?.orderId} />
                </DialogContent>
              </Dialog>

              <Button
                onClick={() => handleUpdateClick(row.original.id)}
                variant="outline"
                size="xs"
                className="w-full flex justify-start"
              >
                {translate("পেমেন্ট করুন", "Pay")}
              </Button>
              <Button
                onClick={() => handlePrint()}
                variant="outline"
                size="xs"
                className="w-full flex justify-start"
              >
                {translate("টিকেট প্রিন্ট করুন", "Print Ticket")}
              </Button>

              {/*  CANCEL ALERT */}
              {order?.status !== "Cancelled" && (
                <AlertDialog>
                  <AlertDialogTrigger
                    className={cn(
                      "w-full flex bg-destructive text-destructive-foreground hover:bg-destructive/90 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive focus:text-bg-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    )}
                  >
                    <span className="ml-0.5">
                      {translate("টিকিট বাতিল", "Cancel Ticket")}
                    </span>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {translate(
                          "আপনি কি একদম নিশ্চিত?",
                          "Are you absolutely sure?"
                        )}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {translate(
                          "আপনি টিকিট বাতিল করতে চান? আপনি আপনার টিকিট বাতিল করতে যাচ্ছেন।",
                          "Are you sure you want to cancel this ticked? You are about to calcel your ticket."
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {translate("বাতিল করুন", "Cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleCancelRequest(order.id)}
                      >
                        {translate("নিশ্চিত করুন", "Confirm")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // UPDATE THE COMPONENT VIA REFERENCE
  useEffect(() => {
    if (salesTickitState.isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [salesTickitState.isPrinting]);

  const closeUpdateModal = () => {
    setSalesTickitState((prev) => ({
      ...prev,
      updateModalOpeans: false,
      selectedOrderId: null,
    }));
  };
  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setSalesTickitState((prevState) => ({
          ...prevState,
          isPrinting: true,
        }));
      });
    },
    onAfterPrint: () => {
      // RESET THE PROMISE RESOLVE SO WE CAN PRINT AGAIN
      promiseResolveRef.current = null;
      setSalesTickitState((prevState) => ({ ...prevState, isPrinting: false }));
    },
  });

  // const handelCancleRequest = async (orderId: number) => {
  //   try {
  //     const result = await cancelRequst(orderId).unwrap();
  //     if (result?.data?.success) {
  //       toast(translate("টিকিট বাতিলের অনুরোধ", "Cancel Ticket Request"));
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  if (loadingSalesTickit || loadingSalesTickit) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <div className="flex gap-5">
      <div className="w-[200px]">
        <PageTransition className="border border-gray-400">
          {/* Header Bar */}
          <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
            Todays Sales
          </div>
          {/* Body */}
          <div className="bg-gray-100 px-2 py-2">
            <p className="text-[12px] font-bold">
              {salesTickitList?.data?.todaySales !== 0
                ? salesTickitList?.data?.todaySales
                : 0}
            </p>
          </div>
        </PageTransition>

        <PageTransition className="border border-gray-400">
          {/* Header Bar */}
          <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
            Todays Online Sales
          </div>
          {/* Body */}
          <div className="bg-gray-100 px-2 py-2">
            <p className="text-[12px] font-bold">
              {salesTickitList?.data?.todayOnlineSales !== 0
                ? salesTickitList?.data?.todayOnlineSales
                : 0}
            </p>
          </div>
        </PageTransition>

        <PageTransition className="border border-gray-400">
          {/* Header Bar */}
          <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
            Todays Counter Sales
          </div>
          {/* Body */}
          <div className="bg-gray-100 px-2 py-2">
            <p className="text-[12px] font-bold">
              {salesTickitList?.data?.todayOfflineTicketCount !== 0
                ? salesTickitList?.data?.todayOfflineTicketCount
                : 0}
            </p>
          </div>
        </PageTransition>

        <PageTransition className="border border-gray-400">
          {/* Header Bar */}
          <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
            Todays Cancel Tickit
          </div>
          {/* Body */}
          <div className="bg-gray-100 px-2 py-2">
            <p className="text-[12px] font-bold">
              {salesTickitList?.data?.todayCancelTicketCount !== 0
                ? salesTickitList?.data?.todayCancelTicketCount
                : 0}
            </p>
          </div>
        </PageTransition>

        <PageTransition className="border border-gray-400">
          {/* Header Bar */}
          <div className="bg-gray-500 text-white text-[12px] font-semibold py-1">
            Todays Online Tickit
          </div>
          {/* Body */}
          <div className="bg-gray-100 px-2 py-2">
            <p className="text-[12px] font-bold">
              {salesTickitList?.data?.todayOnlineTicketCount !== 0
                ? salesTickitList?.data?.todayOnlineTicketCount
                : 0}
            </p>
          </div>
        </PageTransition>
      </div>

      {/* table design */}
      <TableWrapper
        subHeading={translate(
          "আজকের সেলস তথ্য উপাত্ত",
          "Today's Sales Information"
        )}
        className="font-bold"
        heading=""
        // heading={translate("আজকের সেলস", "Today's Sales")}
      >
        <TableToolbar alignment="responsive" className="-mt-14">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSalesTickitState((prev) => ({
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
                  <Button variant="default" size="sm">
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
          data={salesTickitList?.data?.todaySalesHistory || []}
        />
      </TableWrapper>
      <div className="invisible hidden -left-full">
        {salesTickitList && (
          <TickitPrintSingle ref={printSaleRef} tickitData={invoiceData} />
        )}
      </div>
      {salesTickitState.updateModalOpeans && (
        <UpdateCounterOrderModal
          isOpen={salesTickitState.updateModalOpeans}
          onClose={closeUpdateModal}
          order={salesTickitList?.data?.todaySalesHistory.find(
            (order: any) => order.id === salesTickitState.selectedOrderId
          )}
        />
      )}
    </div>
  );
};

export default CounterSalesReport;
