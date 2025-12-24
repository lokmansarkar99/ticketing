import PageTransition from "@/components/common/effect/PageTransition";
// import { InputWrapper } from "@/components/common/form/InputWrapper";
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
// import iconicBusImg from "/public/iconis.jpg";
import QRCode from "react-qr-code";
import { IoMdSearch } from "react-icons/io";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

interface IFindTicketPaymentProps {}

const FindTicketPayment: FC<IFindTicketPaymentProps> = () => {
  const { translate } = useCustomTranslator();
  const [ticketNumber, setTicketNumber] = useState("");
  const { handleSubmit } = useForm<{ dueAmount: number }>();
  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );
  const user = useSelector((state: any) => state.user);
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

  const boardingPoint = ticketData?.boardingPoint;
  const viaRoute = ticketData?.coachConfig?.coach?.CoachViaRoute || [];
  const result = {
    boardingSchedule: viaRoute.find(
      (route: { counter: { name: any } }) =>
        route.counter.name === boardingPoint
    )?.boardingTime,

    departureDate: ticketData?.coachConfig?.departureDate,
  };

  const calculateReportingTime = (schedule: string | undefined): string => {
    if (!schedule || typeof schedule !== "string") {
      return "Invalid time";
    }

    const [time, period] = schedule.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    let departureHours = period === "PM" && hours !== 12 ? hours + 12 : hours;
    if (period === "AM" && hours === 12) departureHours = 0;

    const departureTime = new Date();
    departureTime.setHours(departureHours, minutes, 0, 0);

    const reportingTime = new Date(departureTime.getTime() - 15 * 60 * 1000);

    const reportingHours = reportingTime.getHours() % 12 || 12;
    const reportingMinutes = reportingTime
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const reportingPeriod = reportingTime.getHours() >= 12 ? "PM" : "AM";

    return `${reportingHours}:${reportingMinutes} ${reportingPeriod}`;
  };

  const reportingTime = calculateReportingTime(result?.boardingSchedule);

  //     const seatNo = (
  //     ticketData?.orderSeat || []
  //   ).filter((s: any) => s.date === ticketData?.date);

  //   const status = (ticketData?.orderSeat || []).find(
  //   (s: any) => s.status
  // )?.status;

  if (singleCmsLoading) {
    return <Loader />;
  }

  return (
    <section className="min-h-screen bg-cover bg-center bg-no-repeat max-w-4xl mx-auto mb-28">
      <Helmet>
        <meta
          name="viewport"
          content={
            user?.role === "counter" || !user?.role
              ? "width=1450"
              : "width=device-width, initial-scale=1.0"
          }
        />
      </Helmet>
      <PageWrapper>
        <div className="px-3 lg:px-0">
          <h1 className="text-xl lg:text-2xl inline-block font-bold border-b-2 border-secondary pb-1 mt-10">
            {" "}
            {translate("টিকিট খুঁজুন", "Find Ticket")}
          </h1>
          <div className="border border-secondary flex flex-col gap-2 bg-secondary/10 dark:text-gray-200 py-3 px-4 text-sm my-5">
            <p className="text-secondary flex items-start gap-1 dark:text-gray-200">
              <AiOutlineCheckCircle className="text-2xl lg:text-lg" />{" "}
              <span>
                Enter the ticket <strong>PNR</strong>. Then click on the{" "}
                <strong>Search</strong> button and you will get{" "}
                <strong>Ticket</strong> details.
              </span>
            </p>
            <p className="text-secondary flex items-start gap-1 dark:text-gray-200">
              <AiOutlineCheckCircle className="text-2xl lg:text-lg" />
              <span>
                {" "}
                After that, You can <strong>Cancel</strong> the ticket (If
                applicable), resend the reservation <strong>Email</strong> and{" "}
                <strong>Print</strong> the ticket details
              </span>
            </p>
          </div>
          {/* Input for Ticket Number */}
          <form
            onSubmit={handleSearchClick}
            className="border bg-white dark:bg-background flex justify-between items-center px-5 gap-5 h-[70px]"
          >
            <div className="flex-1">
              <form className="flex items-center gap-5">
                <Input
                  id="ticketNumber"
                  type="text"
                  placeholder={translate("এখানে টিকিট নম্বর লিখুন", "PNR")}
                  value={ticketNumber}
                  onChange={handleTicketNumberChange}
                  className="rounded-none h-10 dark:bg-background"
                />
              </form>
            </div>
            <button
              type="submit"
              className="flex-1  text-center cursor-pointer bg-gray-300 dark:bg-background dark:border"
            >
              <button
                className=" font-semibold px-3 py-2"
                // onClick={handleSearchClick}
                disabled={searching || !ticketNumber}
                type="submit"
              >
                <span className="flex gap-3 items-center">
                  <IoMdSearch className="text-xl" />
                  {searching
                    ? translate("অনুসন্ধান হচ্ছে...", "Searching...")
                    : translate("অনুসন্ধান", "Search")}
                </span>
              </button>
            </button>
          </form>
        </div>
        <div className="flex flex-col justify-center items-center mt-0 lg:mt-5">
          <PageTransition className="w-full  border-primary/50 border-dashed backdrop-blur-[2px] duration-300 mb-40">
            <div
              className="absolute inset-0 z-0 bg-contain bg-center aspect-[16/9] w-full bg-no-repeat my"
              style={{
                backgroundImage: `url(${singleCms?.data?.findTicketBanner})`,
              }}
            />

            <div className="relative z-30">
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
                  <div className="pb-5 mt-5 lg:mt-[120px] text-black ">
                    <div className="flex flex-col space-y-6">
                      {/* Main Ticket */}
                      <div className="">
                        <div className="grid grid-cols-7 gap-">
                          {/* Client Section */}
                          <div className=" relative px-5 col-span-3 pl-">
                            <div className="absolute top-0 right-0 md:top-2 md:right-2">
                              <QRCode
                                value={JSON.stringify(qrMinimalData)}
                                className="bg-white dark:bg-background p-1 rounded-lg w-8 h-8 sm:w-10 sm:h-10 lg:w-16 lg:h-16"
                              />
                            </div>
                            <div className="space-y-1 text-[6px] lg:text-xs pl-1 lg:pl-2">
                              <p>
                                <strong>Passenger Name:</strong>{" "}
                                {ticketData.customerName}
                              </p>
                              <p>
                                <strong>Address:</strong>{" "}
                                {ticketData.address || "N/A"}
                              </p>
                              <p>
                                <strong>Mobile:</strong> {ticketData.phone}
                              </p>
                              <p>
                                <strong>Coach No:</strong>{" "}
                                {ticketData?.coachConfig?.coachNo}
                              </p>
                              <div className="flex gap-2">
                                <p>
                                  <strong>Ticket No:</strong>{" "}
                                  {ticketData.ticketNo}
                                </p>
                                <p>
                                  <strong>Gender:</strong> {ticketData.gender}
                                </p>
                              </div>

                              <div className="flex gap-2">
                                <p>
                                  <strong>From:</strong>{" "}
                                  {ticketData.boardingPoint}
                                </p>
                                <p>
                                  <strong>To:</strong>{" "}
                                  {ticketData.droppingPoint}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <p>
                                  <strong>Journey Dt:</strong>{" "}
                                  {ticketData?.coachConfig?.departureDate}
                                </p>
                                <p>
                                  <strong>Issue Dt:</strong>{" "}
                                  {new Date(
                                    ticketData.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <p>
                                  <strong>Reporting Time:</strong>{" "}
                                  {reportingTime || "N/A"}
                                </p>
                                <p>
                                  <strong>Dep. Time:</strong>{" "}
                                  {result?.boardingSchedule || "N/A"}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <p>
                                  <strong>Seat Fare(Tk):</strong>{" "}
                                  {ticketData.amount}
                                </p>
                                <p>
                                  <strong>Total Fare(Tk):</strong>{" "}
                                  {ticketData.paymentAmount}
                                </p>
                              </div>
                              <p>
                                <strong>Seat No:</strong>{" "}
                                {ticketData?.orderSeat
                                  ?.map((seat: any) => seat?.seat)
                                  .join(", ")}
                              </p>
                            </div>

                            {/* <p className="p-[2px] bg-secondary text-white inline-block text-[8px] font-semibold -rotate-90 absolute top-1/2 left-0"><span>PASSENGER COPY</span></p> */}
                          </div>
                          {/* Supervisor Section */}
                          <div className=" pl-14 col-span-2">
                            <div className="space-y-1 text-[6px] lg:text-xs">
                              <p>
                                <strong>Name:</strong> {ticketData.customerName}
                              </p>
                              <p>
                                <strong>Mobile:</strong> {ticketData.phone}
                              </p>
                              <p>
                                <strong>Coach No:</strong>{" "}
                                {ticketData?.coachConfig?.coachNo}
                              </p>
                              <p>
                                <strong>Ticket No:</strong>{" "}
                                {ticketData.ticketNo}
                              </p>
                              <p>
                                <strong>Gender:</strong> {ticketData.gender}
                              </p>
                              <p>
                                <strong>From:</strong>{" "}
                                {ticketData.boardingPoint}
                              </p>
                              <p>
                                <strong>To:</strong> {ticketData.droppingPoint}
                              </p>
                              <p>
                                <strong>Departure Time:</strong>{" "}
                                {result?.boardingSchedule || "N/A"}
                              </p>
                              <p>
                                <strong>Seat Fare(Tk):</strong>{" "}
                                {ticketData.amount}
                              </p>
                              <p>
                                <strong>Seat No:</strong>{" "}
                                {ticketData?.orderSeat
                                  ?.map((seat: any) => seat?.seat)
                                  .join(", ")}
                              </p>
                            </div>
                          </div>

                          {/* Office Section */}
                          <div className="pl-10 col-span-2">
                            <div className="space-y-1 text-[6px] lg:text-xs">
                              <p>
                                <strong>Name:</strong> {ticketData.customerName}
                              </p>
                              <p>
                                <strong>Mobile:</strong> {ticketData.phone}
                              </p>
                              <p>
                                <strong>Coach No:</strong>{" "}
                                {ticketData?.coachConfig?.coachNo}
                              </p>
                              <p>
                                <strong>Ticket No:</strong>{" "}
                                {ticketData.ticketNo}
                              </p>
                              <p>
                                <strong>Gender:</strong> {ticketData.gender}
                              </p>
                              <p>
                                <strong>From:</strong>{" "}
                                {ticketData.boardingPoint}
                              </p>
                              <p>
                                <strong>To:</strong> {ticketData.droppingPoint}
                              </p>
                              <p>
                                <strong>Departure Time:</strong>{" "}
                                {result?.boardingSchedule || "N/A"}
                              </p>
                              <p>
                                <strong>Seat Fare(Tk):</strong>{" "}
                                {ticketData.amount}
                              </p>
                              <p>
                                <strong>Seat No:</strong>{" "}
                                {ticketData?.orderSeat
                                  ?.map((seat: any) => seat?.seat)
                                  .join(", ")}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* <div className="text-center font-bold mt-2">
                          {ticketData.boardingPoint} -{" "}
                          {ticketData.droppingPoint}
                        </div> */}
                      </div>

                      {/* Return Trip Ticket (if exists) */}
                      {ticketData.returnOrderId && ticketData.order && (
                        <div className="rounded-lg  shadow-md">
                          <Heading size="h4" className="text-blue-600">
                            {translate(
                              "রিটার্ন টিকিটের তথ্য",
                              "Return Ticket Information"
                            )}
                          </Heading>

                          <div
                            className="border-2 mx-auto border-black bg-white p-1"
                            style={{ width: "100%", maxWidth: "8.5in" }}
                          >
                            <div className="flex justify-between">
                              {/* Client Section */}
                              <div
                                className="border-r-2 border-dashed border-black p-2 relative"
                                style={{ width: "50%" }}
                              >
                                <div className="absolute top-2 right-2">
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
                                <div className="space-y-1 text-[6px] lg:text-sm">
                                  <p>
                                    <strong>Passenger Name:</strong>{" "}
                                    {ticketData.customerName}
                                  </p>
                                  <p>
                                    <strong>Address:</strong>{" "}
                                    {ticketData.address || "N/A"}
                                  </p>
                                  <div className="flex gap-2">
                                    <p>
                                      <strong>Mobile:</strong>{" "}
                                      {ticketData.phone}
                                    </p>
                                    <p>
                                      <strong>Ticket No:</strong>{" "}
                                      {ticketData.ticketNo}
                                    </p>
                                  </div>
                                  <p>
                                    <strong>Gender:</strong> {ticketData.gender}
                                  </p>
                                  <div className="flex gap-2">
                                    <p>
                                      <strong>From:</strong>{" "}
                                      {ticketData.boardingPoint}
                                    </p>
                                    <p>
                                      <strong>To:</strong>{" "}
                                      {ticketData.droppingPoint}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <p>
                                      <strong>Journey Dt:</strong>{" "}
                                      {
                                        ticketData.orderSeat[0]?.coachConfig
                                          ?.departureDate
                                      }
                                    </p>
                                    <p>
                                      <strong>Issue Dt:</strong>{" "}
                                      {new Date(
                                        ticketData.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <p>
                                      <strong>Reporting Time:</strong>{" "}
                                      {reportingTime || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Departure Time:</strong>{" "}
                                      {result?.boardingSchedule || "N/A"}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <p>
                                      <strong>Seat Fare(Tk):</strong>{" "}
                                      {ticketData.amount}
                                    </p>
                                    <p>
                                      <strong>Total Fare(Tk):</strong>{" "}
                                      {ticketData.paymentAmount}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <p>
                                      <strong>Seat No:</strong>{" "}
                                      {ticketData?.orderSeat
                                        ?.map((seat: any) => seat?.seat)
                                        .join(", ")}
                                    </p>
                                    <p>
                                      <strong>Coach No:</strong>{" "}
                                      {ticketData?.coachConfig?.coachNo}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* Supervisor Section */}
                              <div
                                className="border-r-2 border-dashed border-black p-2"
                                style={{ width: "25%" }}
                              >
                                <div className="space-y-1 text-[6px] lg:text-sm">
                                  <p>
                                    <strong>Name:</strong>{" "}
                                    {ticketData.customerName}
                                  </p>
                                  <p>
                                    <strong>Mobile:</strong> {ticketData.phone}
                                  </p>
                                  <p>
                                    <strong>Ticket No:</strong>{" "}
                                    {ticketData.ticketNo}
                                  </p>
                                  <p>
                                    <strong>Gender:</strong> {ticketData.gender}
                                  </p>
                                  <p>
                                    <strong>From:</strong>{" "}
                                    {ticketData.boardingPoint}
                                  </p>
                                  <p>
                                    <strong>To:</strong>{" "}
                                    {ticketData.droppingPoint}
                                  </p>
                                  <p>
                                    <strong>Departure Time:</strong>{" "}
                                    {result?.boardingSchedule || "N/A"}
                                  </p>
                                  <p>
                                    <strong>Seat Fare(Tk):</strong>{" "}
                                    {ticketData.amount}
                                  </p>
                                  <p>
                                    <strong>Seat No:</strong>{" "}
                                    {ticketData?.orderSeat
                                      ?.map((seat: any) => seat?.seat)
                                      .join(", ")}
                                  </p>
                                  <p>
                                    <strong>Coach No:</strong>{" "}
                                    {ticketData?.coachConfig?.coachNo}
                                  </p>
                                </div>
                              </div>

                              {/* Office Section */}
                              <div className="p-2" style={{ width: "25%" }}>
                                <div className="space-y-1 text-[6px] lg:text-sm">
                                  <p>
                                    <strong>Name:</strong>{" "}
                                    {ticketData.customerName}
                                  </p>
                                  <p>
                                    <strong>Mobile:</strong> {ticketData.phone}
                                  </p>
                                  <p>
                                    <strong>Ticket No:</strong>{" "}
                                    {ticketData.ticketNo}
                                  </p>
                                  <p>
                                    <strong>Gender:</strong> {ticketData.gender}
                                  </p>
                                  <p>
                                    <strong>From:</strong>{" "}
                                    {ticketData.boardingPoint}
                                  </p>
                                  <p>
                                    <strong>To:</strong>{" "}
                                    {ticketData.droppingPoint}
                                  </p>
                                  <p>
                                    <strong>Departure Time:</strong>{" "}
                                    {result?.boardingSchedule || "N/A"}
                                  </p>
                                  <p>
                                    <strong>Seat Fare(Tk):</strong>{" "}
                                    {ticketData.amount}
                                  </p>
                                  <p>
                                    <strong>Seat No:</strong>{" "}
                                    {ticketData?.orderSeat
                                      ?.map((seat: any) => seat?.seat)
                                      .join(", ")}
                                  </p>
                                  <p>
                                    <strong>Coach No:</strong>{" "}
                                    {ticketData?.coachConfig?.coachNo}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-center font-bold mt-2">
                              {ticketData.boardingPoint} -{" "}
                              {ticketData.droppingPoint}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-center gap-4 mt-6 absolute pb-2 lg:pb-0 -bottom-28 right-0">
                        {!ticketData?.cancelRequest && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant={"destructive"}
                                className="flex items-center gap-2 text-xs px-2 lg:px-5 h-7 lg:h-9 lg:text-lg "
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
                                                    disabled={
                                                      seat?.status ===
                                                      "CancelRequest"
                                                    }
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
                          <div className="flex  items-center gap-3">
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
                                      className="transition-all duration-150 text-xs px-2 lg:px-5 lg:text-lg h-7 lg:h-9"
                                    >
                                      <Loader /> Download
                                    </Button>
                                  ) : (
                                    <Button className="text-xs px-2 lg:px-5 lg:text-lg h-7 lg:h-9">
                                      Download
                                    </Button>
                                  );
                                }
                              }
                            </PDFDownloadLink>

                            <Button
                              onClick={invoicePrintHandler}
                              className="flex items-center gap-2 text-xs px-2 lg:px-5 lg:text-lg h-7 lg:h-9"
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

export default FindTicketPayment;
