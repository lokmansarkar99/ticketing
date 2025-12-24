import { FC, useState, useRef, useEffect } from "react";
import { TableWrapper } from "@/components/common/wrapper/TableWrapper";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LuEye, LuPrinter, LuDownload } from "react-icons/lu";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { MoreHorizontal } from "lucide-react";
import { useCustomerOrderListQuery } from "@/store/api/authenticationApi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useReactToPrint } from "react-to-print";
import OrderPdfDocument from "./OrderPdfDocument";
import OrderPrintView from "./OrderPrintView";
import { Loader } from "@/components/common/Loader";
import QRCode from "qrcode";
import iconicBusImg from "/public/iconis.jpg";
import { useForm } from "react-hook-form";
import { useAddBookingPaymentMutation } from "@/store/api/bookingApi";
import { playSound } from "@/utils/helpers/playSound";
import { toast } from "sonner";
import { TbCurrencyTaka } from "react-icons/tb";

// Define the order interface based on the response data
interface IOrderSeat {
  id: number;
  orderId: number;
  coachConfigId: number;
  class: string;
  segmentId: number;
  isSeatShare: boolean;
  fromStationId: number;
  destinationStationId: number;
  status: string;
  fare: number;
  discount: number;
  online: boolean;
  cancelBy: string | null;
  paymentMethod: string;
  date: string;
  seat: string;
  unitPrice: number;
  cancelNote: string | null;
  refundAmount: number;
  refundType: string | null;
  createdAt: string;
  cancelDate: string | null;
  updatedAt: string;
}

interface IOrder {
  coachConfig: {
    coach: {
      coachNo: string;
      CoachViaRoute: any;
    };
    coachType: string;
    coachClass: string;
  };
  qrCodeDataUrl: string;
  busImgUrl: string;
  id: number;
  ticketNo: string;
  returnOrderId: number | null;
  counterId: number | null;
  coachConfigId: number;
  userId: number | null;
  orderType: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  age: number | null;
  gender: string;
  status: string;
  cancelBy: string | null;
  cancelNote: string | null;
  refundPercentage: number | null;
  refundType: string | null;
  cancelRequest: boolean;
  nid: string;
  nationality: string;
  paymentMethod: string;
  paymentType: string;
  boardingPoint: string;
  droppingPoint: string;
  returnBoardingPoint: string;
  returnDroppingPoint: string;
  noOfSeat: number;
  amount: number;
  paymentAmount: number;
  dueAmount: number;
  payment: boolean;
  partial: boolean;
  partialPaymentAmount: number;
  smsSend: boolean;
  online: boolean;
  date: string;
  returnDate: string | null;
  goods: number;
  grossPay: number;
  goodsDiscount: number;
  netPay: number;
  bookingType: string;
  expiryBookingDate: string | null;
  expiryBookingTime: string | null;
  createdAt: string;
  updatedAt: string;
  orderSeat: IOrderSeat[];
}

interface IOrderListProps {}

const OrderList: FC<IOrderListProps> = () => {
  const { translate } = useCustomTranslator();
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 100, totalPage: 10 },
  });

  const { data: orderListData, isLoading } = useCustomerOrderListQuery({
    page: query.page,
    size: query.size,
  });

  // For printing
  const printRef = useRef(null);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const { handleSubmit } = useForm<{ dueAmount: number }>();
  const [addBookingPayment, { isLoading: paymentLoading }] =
    useAddBookingPaymentMutation();

  const onSubmit = async (id: number) => {
    try {
      const payment = await addBookingPayment(id);
      if (payment.data?.success) {
        playSound("success");
        toast.success(
          translate("পেমেন্ট সফল হয়েছে।", "Payment was successful.")
        );

        if (payment.data?.data?.url) {
          window.location.href = payment.data.data.url;
        }
      } else {
        throw new Error("Payment unsuccessful");
      }
    } catch (error) {
      toast.error(
        translate(
          "পেমেন্টে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          "There was an issue with the payment. Please try again."
        )
      );
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Order_${selectedOrder?.ticketNo || "Details"}`,
  });

  const handlePrintClick = (order: IOrder) => {
    setSelectedOrder(order);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const [ordersWithQR, setOrdersWithQR] = useState<IOrder[]>([]);

  useEffect(() => {
    const generateQR = async () => {
      if (!orderListData?.data) return;

      const newData = await Promise.all(
        orderListData.data.map(async (order: IOrder) => {
          try {
            const qrCodeDataUrl = await QRCode.toDataURL(
              JSON.stringify(
                order?.orderSeat?.map((seat) => seat?.seat).join(", ")
              ) || "N/A"
            );
            return {
              ...order,
              qrCodeDataUrl,
              busImgUrl: iconicBusImg,
            };
          } catch (error) {
            console.error("Error generating QR code:", error);
            return order;
          }
        })
      );
      setOrdersWithQR(newData);
    };

    generateQR();
  }, [orderListData]);

  // Define table columns
  const columns: ColumnDef<IOrder>[] = [
    {
      accessorKey: "ticketNo",
      header: translate("অর্ডার নম্বর", "Ticket No"),
    },
    {
      accessorKey: "customerName",
      header: translate("গ্রাহকের নাম", "Customer Name"),
    },
    {
      accessorKey: "phone",
      header: translate("ফোন নম্বর", "Phone Number"),
    },
    {
      accessorKey: "date",
      header: translate("তারিখ", "Date"),
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "noOfSeat",
      header: translate("সিট সংখ্যা", "Number of Seats"),
    },
    {
      accessorKey: "amount",
      header: translate("মোট Amount", "Total Amount"),
      cell: ({ row }) => {
        const amount = row.original.amount;
        return `${amount.toFixed(2)}৳`;
      },
    },
    {
      accessorKey: "paymentAmount",
      header: translate("মোট Payment Amount", "Payment Amount"),
      cell: ({ row }) => {
        const paymentAmount = row.original.paymentAmount;
        return `${paymentAmount.toFixed(2)}৳`;
      },
    },
    {
      accessorKey: "dueAmount",
      header: translate("মোট Due Amount", "Due Amount"),
      cell: ({ row }) => {
        const dueAmount = row.original.dueAmount;
        return `${dueAmount.toFixed(2)}৳`;
      },
    },

    {
      id: "actions",
      header: translate("অ্যাকশন", "Action"),
      cell: ({ row }) => {
        const order = row.original;
        const orderWithQR =
          ordersWithQR.find((o) => o.id === order.id) || order;
        const boardingPoint = order?.boardingPoint;
        const viaRoute = order?.coachConfig?.coach?.CoachViaRoute || [];
        const result = {
          boardingSchedule: viaRoute.find(
            (route: { station: { name: any } }) =>
              route.station.name === boardingPoint
          )?.schedule,

          departureDate: order?.date,
        };

        const calculateReportingTime = (
          schedule: string | undefined
        ): string => {
          if (!schedule || typeof schedule !== "string") {
            return "Invalid time";
          }

          const [time, period] = schedule.split(" ");
          const [hours, minutes] = time.split(":").map(Number);

          let departureHours =
            period === "PM" && hours !== 12 ? hours + 12 : hours;
          if (period === "AM" && hours === 12) departureHours = 0;

          const departureTime = new Date();
          departureTime.setHours(departureHours, minutes, 0, 0);

          const reportingTime = new Date(
            departureTime.getTime() - 15 * 60 * 1000
          );

          const reportingHours = reportingTime.getHours() % 12 || 12;
          const reportingMinutes = reportingTime
            .getMinutes()
            .toString()
            .padStart(2, "0");
          const reportingPeriod = reportingTime.getHours() >= 12 ? "PM" : "AM";

          return `${reportingHours}:${reportingMinutes} ${reportingPeriod}`;
        };

        const reportingTime = calculateReportingTime(result?.boardingSchedule);

        const seatNo = (order?.orderSeat || []).filter(
          (s: any) => s.date === order?.date
        );
        const status = (order?.orderSeat || []).find(
          (s: any) => s.status
        )?.status;

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
                {translate("অর্ডার অ্যাকশন", "Order Actions")}
              </DropdownMenuLabel>

              {/* View Iconic Express */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start gap-2"
                    size="xs"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <LuEye className="h-4 w-4" />
                    {translate("বিস্তারিত", "Details")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full h-[60%] md:max-w-[850px] md:max-h-[90%] overflow-y-auto p-4 bg-gray-100">
                  <div className="flex justify-center items-center p-6">
                    {/* Ticket container */}
                    <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden w-full">
                      {/* Left Part */}
                      <div className="lg:w-2/3 w-full border-2 border-dashed border-gray-300 lg:rounded-tr-2xl lg:rounded-br-2xl rounded-t-2xl lg:rounded-t-none overflow-hidden bg-[#f4a3ff]">
                        {/* Blue Header */}
                        <div className="bg-gradient-to-r from-sky-400 to-sky-600 text-white px-6 py-3 flex justify-between items-center">
                          <h2 className="text-lg sm:text-xl font-bold">
                            Iconic Express
                          </h2>
                          <p className="text-xs sm:text-sm">
                            Ticket No:{order.ticketNo}
                          </p>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col sm:flex-row justify-between">
                          {/* Info Section */}
                          <div className="px-4 sm:px-6 py-4 space-y-2 text-xs sm:text-sm text-gray-800 flex-1">
                            <p>
                              <span className="font-semibold">
                                {translate("তারিখ", "Journey Date")}:
                              </span>{" "}
                              {order?.date}
                            </p>
                            {/* <p>
                              <span className="font-semibold">
                                {translate("সময়", "Time")}:
                              </span>{" "}
                              {new Date(order.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p> */}
                            <p>
                              <span className="font-semibold">
                                {translate("গ্রাহকের নাম", "Customer Name")}:
                              </span>{" "}
                              {order?.customerName || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">
                                {translate("ফোন নম্বর", "Phone")}:
                              </span>{" "}
                              {order?.phone || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">
                                {translate("ফোন নম্বর", "Email")}:
                              </span>{" "}
                              {order?.email || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">
                                Departure Time:
                              </span>{" "}
                              {result?.boardingSchedule || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">
                                Reporting Time:
                              </span>{" "}
                              {reportingTime || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">
                                Boarding Point:
                              </span>{" "}
                              {order?.boardingPoint || boardingPoint || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">
                                Dropping Point:
                              </span>{" "}
                              {order?.droppingPoint || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">
                                {translate("বাস", "Bus Type")}:
                              </span>{" "}
                              {order?.coachConfig?.coachType}
                            </p>
                            <p>
                              <span className="font-semibold">
                                {translate("বাস", "Class")}:
                              </span>{" "}
                              {order?.coachConfig?.coachClass}
                            </p>

                            <p>
                              <span className="font-semibold">
                                {translate("পেমেন্ট টাইপ", "Payment Type")}:
                              </span>{" "}
                              {order.paymentType}
                            </p>
                            <p>
                              <span className="font-semibold">
                                {translate("স্ট্যাটাস", "Status")}:
                              </span>{" "}
                              {status}
                            </p>
                            <p>
                              <span className="font-semibold">Seat:</span>{" "}
                              {seatNo
                                ?.map((seat: any) => seat?.seat)
                                .join(", ") || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">
                                {" "}
                                Seat Fare(Tk):{" "}
                              </span>{" "}
                              {order?.paymentAmount / seatNo?.length || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">
                                Total Fare(Tk):
                              </span>{" "}
                              {order?.paymentAmount / seatNo?.length || "N/A"}৳
                            </p>
                          </div>

                          {/* Route Box */}
                          <div className="flex items-center justify-center py-3 sm:py-0">
                            <div className="text-sky-800 text-center font-semibold px-3 py-2 rounded-md shadow-inner">
                              <p>{order.boardingPoint}</p>
                              <p className="text-center rotate-90">➝</p>
                              <span>{order.droppingPoint}</span>
                            </div>
                          </div>

                          {/* Seat & QR Section */}
                          <div className="pr-3 mt-3 sm:mt-0 space-y-2 flex justify-between md:flex-col md:justify-evenly items-center">
                            <div className="text-sky-600">
                              <img
                                src={iconicBusImg}
                                alt="iconicBusImg"
                                className="w-20 h-20 sm:w-24 sm:h-24 border rounded-md"
                              />
                            </div>
                            <div className="text-sky-600">
                              <div className="w-20 h-20 sm:w-24 sm:h-24 border rounded-md flex items-center justify-center bg-gray-50">
                                <img
                                  src={orderWithQR.qrCodeDataUrl}
                                  alt="QR Code"
                                  className="w-20 h-20 sm:w-24 sm:h-24 p-1 bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Part */}
                      <div className="lg:w-1/3 w-full rounded-b-2xl lg:rounded-b-none lg:rounded-tl-2xl lg:rounded-bl-2xl border-t lg:border-t-0 border-b border-r overflow-hidden bg-[#f4a3ff]">
                        {/* Blue Header */}
                        <div className="bg-gradient-to-r from-sky-400 to-sky-600 text-white px-4 py-3 flex justify-between items-center">
                          <h2 className="text-base sm:text-lg font-semibold">
                            Iconic Express
                          </h2>
                        </div>

                        {/* Body */}
                        <div className="px-4 py-4 text-xs sm:text-sm text-gray-800 space-y-1">
                          <p>
                            <span className="font-semibold">
                              {translate("অর্ডার নম্বর", "Ticket No")}:
                            </span>{" "}
                            {order.ticketNo}
                          </p>
                          <p>
                            <span className="font-semibold">
                              {translate("তারিখ", "Journey Date")}:
                            </span>{" "}
                            {order?.date}
                          </p>
                          {/* <p>
                              <span className="font-semibold">
                                {translate("সময়", "Time")}:
                              </span>{" "}
                              {new Date(order.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p> */}
                          <p>
                            <span className="font-semibold">
                              {translate("গ্রাহকের নাম", "Customer Name")}:
                            </span>{" "}
                            {order?.customerName || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">
                              {translate("ফোন নম্বর", "Phone")}:
                            </span>{" "}
                            {order?.phone || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">
                              {translate("ফোন নম্বর", "Email")}:
                            </span>{" "}
                            {order?.email || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Departure Time:
                            </span>{" "}
                            {result?.boardingSchedule || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Reporting Time:
                            </span>{" "}
                            {reportingTime || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Boarding Point:
                            </span>{" "}
                            {order?.boardingPoint || boardingPoint || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Dropping Point:
                            </span>{" "}
                            {order?.droppingPoint || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">
                              {translate("বাস", "Bus Type")}:
                            </span>{" "}
                            {order?.coachConfig?.coachType}
                          </p>
                          <p>
                            <span className="font-semibold">
                              {translate("বাস", "Class")}:
                            </span>{" "}
                            {order?.coachConfig?.coachClass}
                          </p>

                          <p>
                            <span className="font-semibold">
                              {translate("পেমেন্ট টাইপ", "Payment Type")}:
                            </span>{" "}
                            {order.paymentType}
                          </p>
                          <p>
                            <span className="font-semibold">
                              {translate("স্ট্যাটাস", "Status")}:
                            </span>{" "}
                            {status}
                          </p>
                          <p>
                            <span className="font-semibold">Seat:</span>{" "}
                            {seatNo
                              ?.map((seat: any) => seat?.seat)
                              .join(", ") || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">
                              {" "}
                              Seat Fare(Tk):{" "}
                            </span>{" "}
                            {order?.paymentAmount / seatNo?.length || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Total Fare(Tk):
                            </span>{" "}
                            {order?.paymentAmount || order?.amount || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Download Button in Dropdown */}
              <PDFDownloadLink
                document={
                  <OrderPdfDocument
                    order={orderWithQR}
                    qrCodeDataUrl={orderWithQR.qrCodeDataUrl}
                    busImgUrl={orderWithQR.busImgUrl}
                  />
                }
                fileName={`Order_${order.ticketNo}.pdf`}
              >
                {
                  //@ts-ignore
                  (params) => {
                    const { loading } = params;
                    return loading ? (
                      <Button
                        variant="outline"
                        className="w-full flex justify-start gap-2"
                        size="xs"
                        disabled
                      >
                        <Loader size="sm" />
                        {translate("ডাউনলোড", "Download")}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full flex justify-start gap-2"
                        size="xs"
                      >
                        <LuDownload className="h-4 w-4" />
                        {translate("ডাউনলোড", "Download")}
                      </Button>
                    );
                  }
                }
              </PDFDownloadLink>

              {/* Pay Button in Dropdown - only show if dueAmount > 0 */}
              {row?.original?.dueAmount > 0 && (
                <form
                  onSubmit={handleSubmit(() => onSubmit(row.original.id))}
                  className="w-full"
                >
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full flex justify-start gap-2"
                    size="xs"
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? (
                      <Loader size="sm" />
                    ) : (
                      <TbCurrencyTaka className="h-4 w-4" />
                    )}
                    {translate("পেমেন্ট করুন", "Pay")}
                  </Button>
                </form>
              )}

              {/* Print Button in Dropdown */}
              <Button
                variant="outline"
                className="w-full flex justify-start gap-2"
                size="xs"
                onClick={() => handlePrintClick(order)}
              >
                <LuPrinter className="h-4 w-4" />
                {translate("প্রিন্ট", "Print")}
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "অর্ডারের তালিকা এবং সকল তথ্য উপাত্ত",
          "Order list and all relevant information & data"
        )}
        heading={translate("অর্ডার তালিকা", "Order List")}
      >
        {orderListData?.data && orderListData.data.length > 0 ? (
          <>
            <DataTable
              columns={columns}
              data={orderListData.data}
              pagination
              query={query}
              setQuery={setQuery}
            />

            {/* Hidden print component */}
            {selectedOrder && (
              <div className="hidden">
                <OrderPrintView ref={printRef} order={selectedOrder} />
              </div>
            )}
          </>
        ) : (
          <p className="text-center py-6 text-gray-500">
            {translate("কোনো অর্ডার নেই", "There are no orders yet")}
          </p>
        )}
      </TableWrapper>
    </PageWrapper>
  );
};

export default OrderList;
