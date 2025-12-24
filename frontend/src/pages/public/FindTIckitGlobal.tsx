import PageTransition from "@/components/common/effect/PageTransition";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import { Loader } from "@/components/common/Loader";
import { Heading } from "@/components/common/typography/Heading";
import { Paragraph } from "@/components/common/typography/Paragraph";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAddBookingPaymentMutation,
  useGetTickitInfoQuery,
  useOrderUserCancelRequestMutation,
} from "@/store/api/bookingApi";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import TickitPrintClient from "../dashboard/printLabel/TicketPrintClient";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfTickitFromFind from "../dashboard/pdf/PdfTickitFromFind";
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
import { Printer, Trash2 } from "lucide-react";
import iconicBusImg from "/public/iconis.jpg";
import QRCode from "react-qr-code";

interface IFindTicketPaymentProps {}

const FindTIckitGlobal: FC<IFindTicketPaymentProps> = () => {
  const { translate } = useCustomTranslator();
  const [ticketNumber, setTicketNumber] = useState("");
  const { handleSubmit } = useForm<{ dueAmount: number }>();
  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );
  const [searchTicketNumber, setSearchTicketNumber] = useState("");
  const [searching, setSearching] = useState<boolean>(false);
  const [saleData, setSaleData] = useState<any>();

  const { data, isLoading, error } = useGetTickitInfoQuery(searchTicketNumber, {
    skip: !searchTicketNumber,
  });

  const [
    cancelRequest,
    { isLoading: cancelLoading, isSuccess: cancelRequestSuccess },
  ] = useOrderUserCancelRequestMutation();

  const [
    addBookingPayment,
    { isLoading: paymentLoading, error: paymentLoadingError },
  ] = useAddBookingPaymentMutation();

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const handleSeatSelection = (seatId: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleCancelRequest = async (seatIds: number[]) => {
    try {
      await cancelRequest({
        seats: seatIds,
      }).unwrap();

      // Reset selection after successful cancellation
      setSelectedSeats([]);

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

  const dueAmount = data?.data?.dueAmount;
  const ticketData = data?.data;

  // Handler for ticket number input
  const handleTicketNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketNumber(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ticketNumber.trim()) {
      setSearchTicketNumber(ticketNumber);
      setSearching(true);
    }
  };

  // Reset the searching state after data or error is received
  useEffect(() => {
    if (data || error) {
      setSearching(false);
    }
  }, [data, error]);

  useEffect(() => {
    if (cancelRequestSuccess) {
      toast.success(
        translate(
          "টিকিট বাতিলের অনুরোধ সফল হয়েছে।",
          "Ticket cancel request successful."
        )
      );
      playSound("success");
    }
  }, [cancelRequestSuccess, translate]);

  // STORE PROMISE RESOLVE REFERENCE
  const promiseResolveRef = useRef<any>(null);
  const printSaleRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_${saleData?.data?.ticketNo}`,
    onAfterPrint: () => {
      // RESET THE PROMISE RESOLVE SO WE CAN PRINT AGAIN
      promiseResolveRef.current = null;
      // setClear(false);
      setSaleData({});
    },
  });

  const invoicePrintHandler = () => {
    if (data) {
      setSaleData(data);
    } else {
      console.error("Failed to fetch sale data from local storage.");
    }
  };
  useEffect(() => {
    if (saleData && Object.keys(saleData).length > 0) {
      handlePrint();
    }
  }, [handlePrint, saleData]);

  // Handle form submission
  const onSubmit = async () => {
    try {
      const payment = await addBookingPayment(ticketData?.id);
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

  const qrData = JSON.stringify({
    ticketNo: ticketData?.ticketNo || "404NOTFOUND",
    phone: ticketData?.phone || "N/A",
    customerName: ticketData?.customerName || "N/A",
    address: ticketData?.address || "N/A",
    seats:
      ticketData?.orderSeat?.map((seat: any) => seat?.seat).join(", ") || "N/A",
    boardingPoint: ticketData?.boardingPoint || "N/A",
    droppingPoint: ticketData?.droppingPoint || "N/A",
    departureDate:
      ticketData?.orderSeat?.[0]?.coachConfig?.departureDate || "N/A",
    schedule: ticketData?.orderSeat?.[0]?.schedule || "N/A",
  });

  const qrMinimalData = {
    t: ticketData?.ticketNo || "N/A", // Ticket number
    p: ticketData?.phone || "N/A", // Phone
    s: ticketData?.orderSeat?.map((seat: any) => seat?.seat).join(",") || "N/A", // Seats
  };



  if (singleCmsLoading) {
    return <Loader />;
  }

  return (
    <section className="min-h-screen bg-cover bg-center bg-no-repeat ">
      <PageWrapper>
        <div className="flex flex-col justify-center items-center">
          <PageTransition className="p-2 lg:p-5 w-full border-primary/50 border-dashed backdrop-blur-[2px] duration-300">
            <div
              className="absolute inset-0 z-0 opacity-30 bg-cover bg-center min-h-[50vh]"
              style={{
                backgroundImage: `url(${singleCms?.data?.findTicketBanner})`,
              }}
            />
            <div className="relative z-30">
              <Heading size="h4" className="text-center text-2xl lg:text-4xl">
                {translate("টিকিট খুঁজুন", "Find Ticket")}
              </Heading>

              {/* Input for Ticket Number */}
              <InputWrapper
                labelFor="ticketNumber"
                label={translate("টিকিট নম্বর লিখুন", "Enter Ticket Number")}
                className="w-full lg:w-1/2 mx-auto"
              >
                <form
                  onSubmit={handleSearchClick}
                  className="flex items-center gap-5"
                >
                  <Input
                    id="ticketNumber"
                    type="text"
                    placeholder={translate(
                      "এখানে টিকিট নম্বর লিখুন",
                      "Enter ticket number here"
                    )}
                    value={ticketNumber}
                    onChange={handleTicketNumberChange}
                  />

                  <Button
                    size={"default"}
                    variant={"primary"}
                    // onClick={handleSearchClick}
                    disabled={searching || !ticketNumber}
                    type="submit"
                  >
                    {searching
                      ? translate("অনুসন্ধান হচ্ছে...", "Searching...")
                      : translate("অনুসন্ধান", "Search")}
                  </Button>
                </form>
              </InputWrapper>

              <div className="flex flex-col justify-center py-5">
                {/* Loading and Error Handling */}
                {isLoading && (
                  <Paragraph className="text-center">
                    {translate("লোড হচ্ছে...", "Loading...")}
                  </Paragraph>
                )}
                {error && (
                  <Paragraph className="text-center">
                    {translate(
                      "ত্রুটি ঘটেছে, অনুগ্রহ করে একটি সঠিক টিকিট নম্বর বা ফোন নম্বর দিন।",
                      "Error fetching data. Please give valid ticket No or Phone number"
                    )}
                  </Paragraph>
                )}

                {/* Display Ticket Data */}
                {ticketData && (
                  <div className="px-2 lg:px-4 pb-5">
                    <div className="flex flex-col space-y-6">
                      {/* Main Ticket */}
                      <div>
                        <div className="flex justify-center">
                          <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row rounded-2xl overflow-hidden w-full lg:w-[850px]">
                            {/* Left Part */}
                            <div className="w-full lg:w-2/3 bg-[#f4a3ff] border-r-2 border-dashed border-b-2 border-l-2 border-gray-300 rounded-2xl lg:rounded-tr-2xl rounded-br-2xl overflow-hidden">
                              {/* Blue Header */}
                              <div className="bg-gradient-to-r from-sky-400 to-sky-600 text-white px-6 py-3 flex justify-between items-center">
                                <h2 className="text-base lg:text-xl font-bold">
                                  Iconic Express
                                </h2>
                                <p className="text-sm">
                                  Ticket No:{ticketData.ticketNo}
                                </p>
                              </div>

                              {/* Body */}
                              <div className="flex justify-between">
                                <div className="px-3 lg:px-6 py-4 space-y-2 text-sm text-gray-800">
                                  <p>
                                    <span className="font-semibold">Name:</span>{" "}
                                    {ticketData.customerName || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-semibold">
                                      Phone:
                                    </span>{" "}
                                    {ticketData.phone || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-semibold">
                                      Email:
                                    </span>{" "}
                                    {ticketData.email || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Journey Date:</span>{" "}
                                    {ticketData.date || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Boarding Point:</span>{" "}
                                    {ticketData.boardingPoint || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Dropping Point:</span>{" "}
                                    {ticketData.droppingPoint || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-semibold">
                                      Bus Type:
                                    </span>{" "}
                                    {ticketData?.coachConfig?.coachType || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-semibold">
                                      Class:
                                    </span>{" "}
                                    {ticketData?.coachConfig?.coachClass || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-semibold">
                                      Amount:
                                    </span>{" "}
                                    {ticketData?.amount || "N/A"}৳
                                  </p>
                                  <p>
                                    <span className="font-semibold">Seat:</span>{" "}
                                    {ticketData.orderSeat
                                      .map((seat: any) => seat.seat)
                                      .join(", ")}
                                  </p>
                                </div>

                                {/* Route Box */}
                                <div className="flex items-center">
                                  <div className="text-sky-800 text-center font-semibold px-3 py-2 rounded-md shadow-inner">
                                    <p>{ticketData.boardingPoint}</p>
                                    <p className="text-center rotate-90">➝</p>
                                    <span>{ticketData.droppingPoint}</span>
                                  </div>
                                </div>

                                {/* QR Code + Bus icon placeholder */}
                                <div className="pr-3 mt-3 sm:mt-0 space-y-2 flex flex-col justify-evenly items-center">
                                  <div className="text-sky-600 ">
                                    <img
                                      src={iconicBusImg}
                                      alt="iconicBusImg"
                                      className="w-24 h-24 border rounded-md"
                                    />
                                  </div>

                                  <QRCode
                                    value={JSON.stringify(qrMinimalData)}
                                    style={{
                                      background: "white",
                                      padding: "1px",
                                      width: "96px",
                                      height: "96px",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Right Part */}
                            <div className="w-full lg:w-1/3 bg-[#f4a3ff] rounded-tl-2xl rounded-2xl lg:rounded-bl-2xl border-b border-r overflow-hidden">
                              {/* Blue Header */}
                              <div className="bg-gradient-to-r from-sky-400 to-sky-600 text-white px-4 py-3 flex justify-between items-center">
                                <h2 className="text-lg font-bold">
                                  Iconic Express
                                </h2>
                              </div>

                              {/* Body */}
                              <div className="px-4 py-4 text-xs text-gray-800 space-y-1">
                                <p>
                                  <span className="font-semibold">
                                    Ticket No:
                                  </span>{" "}
                                  {ticketData.ticketNo}
                                </p>
                                <p>
                                  <span className="font-semibold">Name:</span>{" "}
                                  {ticketData.customerName}
                                </p>
                                <p>
                                  <span className="font-semibold">Phone:</span>{" "}
                                  {ticketData.phone}
                                </p>
                                <p>
                                  <span className="font-semibold">Journey Date:</span>{" "}
                                  {ticketData.date}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Bus Type:
                                  </span>{" "}
                                  {ticketData?.coachConfig?.coachType || "N/A"}
                                </p>
                                <p>
                                  <span className="font-semibold">Class:</span>{" "}
                                  {ticketData?.coachConfig?.coachClass || "N/A"}
                                </p>
                                <p>
                                  <span className="font-semibold">Seat:</span>{" "}
                                  {ticketData.orderSeat
                                    .map((seat: any) => seat.seat)
                                    .join(", ")}
                                </p>
                                <p>
                                  {ticketData.boardingPoint} to{" "}
                                  {ticketData.droppingPoint}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Return Trip Ticket (if exists) */}
                      {ticketData.returnOrderId && ticketData.order && (
                        <div className="border rounded-lg p-6 shadow-md">
                          <div className="flex items-center mb-4">
                            <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                            <Heading size="h4" className="text-blue-600">
                              {translate(
                                "রিটার্ন টিকিটের তথ্য",
                                "Return Ticket Information"
                              )}
                            </Heading>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <span className="font-medium w-32">
                                  {translate("টিকিট নম্বর", "Ticket No")}:
                                </span>
                                <span className="font-semibold">
                                  {ticketData.order.ticketNo}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium w-32">
                                  {translate("যাত্রার তারিখ", "Journey Date")}:
                                </span>
                                <span>{ticketData.order.date}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium w-32">
                                  {translate("সিট", "Seat")}:
                                </span>
                                <span>
                                  {ticketData.order.orderSeat
                                    .map((seat: any) => seat.seat)
                                    .join(", ")}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center">
                                <span className="font-medium w-32">
                                  {translate("বাসের ধরন", "Bus Type")}:
                                </span>
                                <span>
                                  {
                                    ticketData.order.orderSeat[0]?.coachConfig
                                      ?.coachType
                                  }
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium w-32">
                                  {translate("শ্রেণি", "Class")}:
                                </span>
                                <span>
                                  {
                                    ticketData.order.orderSeat[0]?.coachConfig
                                      ?.coachClass
                                  }
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium w-32">
                                  {translate("মূল্য", "Amount")}:
                                </span>
                                <span>{ticketData.order.amount}</span>
                              </div>
                            </div>
                          </div>

                          {/* Return Journey Details */}
                          <div className="mt-6 p-4 rounded-lg">
                            <h5 className="font-semibold mb-2 text-blue-700">
                              {translate(
                                "রিটার্ন যাত্রার বিবরণ",
                                "Return Journey Details"
                              )}
                            </h5>
                            <div className="flex items-center justify-center space-x-4">
                              <div className="text-center">
                                <p className="font-medium">
                                  {ticketData.order.boardingPoint}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {ticketData.order.orderSeat[0]?.schedule}
                                </p>
                              </div>
                              <div className="flex-1 flex items-center justify-center">
                                <div className="h-px bg-gray-500 w-full relative">
                                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="font-medium">
                                  {ticketData.order.droppingPoint}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-6">
                        {!ticketData?.cancelRequest && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant={"destructive"}
                                className="flex items-center gap-2"
                              >
                                <Trash2 size={16} />
                                {translate("টিকিট বাতিল করুন", "Cancel Ticket")}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-5xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {translate(
                                    "টিকেট বাতিল করুন",
                                    "Cancel Tickets"
                                  )}
                                </AlertDialogTitle>
                                <AlertDialogDescription asChild>
                                  <div>
                                    {translate(
                                      "বাতিল করতে চাইয়া টিকেট গুলো সিলেক্ট করুন",
                                      "Select the tickets you want to cancel"
                                    )}

                                    {/* Ticket selection table */}
                                    <div className="mt-4 overflow-auto max-h-96">
                                      <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 dark:bg-[#1f2128]">
                                          <tr>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                                              {translate("সিলেক্ট", "SELECT")}
                                            </th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                                              {translate(
                                                "সিট নম্বর",
                                                "SEAT NO"
                                              )}
                                            </th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                                              {translate(
                                                "টিকেট নম্বর",
                                                "TICKET NO"
                                              )}
                                            </th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                                              {translate(
                                                "ভাড়া",
                                                "FARE (TAKA)"
                                              )}
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-[#1f2128]">
                                          {ticketData?.orderSeat?.map(
                                            (seat: any) => (
                                              <tr key={seat.id}>
                                                <td className="px-4 py-2 whitespace-nowrap text-center">
                                                  <input
                                                  disabled={seat?.status === "CancelRequest"}
                                                    type="checkbox"
                                                    checked={selectedSeats.includes(
                                                      seat.id
                                                    )}
                                                    onChange={() =>
                                                      handleSeatSelection(
                                                        seat.id
                                                      )
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                  />
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center">
                                                  {seat.seat}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center">
                                                  {ticketData.ticketNo}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center">
                                                  {ticketData.amount /
                                                    ticketData.orderSeat.length}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {translate("না", "No")}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={
                                    cancelLoading || selectedSeats.length === 0
                                  }
                                  onClick={() =>
                                    handleCancelRequest(selectedSeats)
                                  }
                                >
                                  {cancelLoading
                                    ? translate(
                                        "বাতিল করা হচ্ছে...",
                                        "Cancelling..."
                                      )
                                    : translate(
                                        "হ্যাঁ, বাতিল করুন",
                                        "Yes, Cancel"
                                      )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {dueAmount === 0 && (
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <PDFDownloadLink
                              document={
                                <PdfTickitFromFind
                                  ticketData={ticketData}
                                  logo={singleCms?.data}
                                  qrData={qrData}
                                />
                              }
                              fileName="tickit.pdf"
                            >
                              {
                                //@ts-ignore
                                (params) => {
                                  const { loading } = params;
                                  return loading ? (
                                    <Button
                                      disabled
                                      className="transition-all duration-150"
                                    >
                                      <Loader /> Download
                                    </Button>
                                  ) : (
                                    <Button>Download</Button>
                                  );
                                }
                              }
                            </PDFDownloadLink>

                            <Button
                              onClick={invoicePrintHandler}
                              className="flex items-center gap-2"
                            >
                              <Printer size={16} />
                              {translate("প্রিন্ট", "Print")}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input for Due Amount */}
              {ticketData && dueAmount > 0 && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Submit Button to Make Payment */}
                  <Submit
                    loading={paymentLoading}
                    submitTitle={translate("পেমেন্ট করুন", "Pay")}
                    errors={paymentLoadingError}
                    errorTitle={translate(
                      "পেমেন্ট সম্পূর্ণ করতে ত্রুটি হয়েছে",
                      "Payment Error"
                    )}
                  />
                </form>
              )}
            </div>
          </PageTransition>
        </div>
      </PageWrapper>
      <div className="invisible hidden -left-full">
        {saleData && (
          <TickitPrintClient
            ref={printSaleRef}
            saleData={saleData?.data}
            logo={singleCms?.data}
          />
        )}
      </div>
    </section>
  );
};

export default FindTIckitGlobal;