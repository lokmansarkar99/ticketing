import PageTransition from "@/components/common/effect/PageTransition";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Loader } from "@/components/common/Loader";
import { Heading } from "@/components/common/typography/Heading";
import { Paragraph } from "@/components/common/typography/Paragraph";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useGetTickitInfoQuery,
  useOrderCancelRequestMutation,
} from "@/store/api/bookingApi";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import QRCode from "react-qr-code";
import { Label } from "@/components/common/typography/Label";
import POSCounterTicketPrint from "../../printLabel/POSCounterTicketPrint";
import TickitPrint from "../../printLabel/TickitPrint";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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

interface ICounterFindTicketProps {}

const CounterFindTicket: FC<ICounterFindTicketProps> = () => {
  const { translate } = useCustomTranslator();
  const [ticketNumber, setTicketNumber] = useState("");
  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );
  const [searchTicketNumber, setSearchTicketNumber] = useState("");
  const [searching, setSearching] = useState<boolean>(false);
  const [saleData, setSaleData] = useState<any>();
  const [printType, setPrintType] = useState<string>("default");

  const { data, isLoading, error } = useGetTickitInfoQuery(searchTicketNumber, {
    skip: !searchTicketNumber,
  });

  const ticketData = data?.data;
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

  const generateQRData = (data: any) => {
    return JSON.stringify({
      phone: data?.phone || "N/A",
      ticketNo: data?.ticketNo || "N/A",
      seats:
        data?.orderSeat?.map((seat: any) => seat?.seat).join(", ") || "N/A",
      customerName: data?.customerName,
      boardingPoint: data?.boardingPoint,
      droppingPoint: data?.droppingPoint,
      amount: data?.amount,
      departureTime: data?.orderSeat?.[0]?.schedule,
      coachNo: data?.orderSeat?.[0]?.coachConfig?.coachNo,
    });
  };

  const handleTicketNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketNumber(e.target.value);
  };

  const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ticketNumber.trim()) {
      setSearchTicketNumber(ticketNumber);
      setSearching(true);
    }
  };

  useEffect(() => {
    if (data || error) {
      setSearching(false);
    }
  }, [data, error]);

  const printSaleRef = useRef(null);
  const posPrintRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () =>
      printType === "default" ? printSaleRef.current : posPrintRef.current,
    documentTitle: `${appConfiguration?.appName}_${saleData?.data?.ticketNo}`,
    onAfterPrint: () => {
      setSaleData({});
    },
  });

  const invoicePrintHandler = () => {
    if (data) {
      setSaleData(data);
    } else {
      console.error("Failed to fetch sale data");
    }
  };

  useEffect(() => {
    if (saleData && Object.keys(saleData).length > 0) {
      handlePrint();
    }
  }, [handlePrint, saleData]);

  const [cancelRequest, { isLoading: cancelLoading }] =
    useOrderCancelRequestMutation();

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
        translate("টিকিট বাতিলের সফল হয়েছে।", "Ticket canceled successful.")
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

  if (singleCmsLoading) {
    return <Loader />;
  }

  return (
    <section className="min-h-screen bg-cover bg-center bg-no-repeat">
      <PageWrapper>
        <div className="flex flex-col justify-center items-center">
          <PageTransition className="p-5 w-full border-primary/50 border-dashed backdrop-blur-[2px] duration-300">
            <div
              className="absolute inset-0 z-0 opacity-10 bg-cover bg-center min-h-screen"
              style={{
                backgroundImage: `url(${singleCms?.data?.findTicketBanner})`,
              }}
            />
            <div className="relative z-30">
              <Heading size="h4" className="text-center text-4xl">
                {translate("টিকিট খুঁজুন", "Find Ticket")}
              </Heading>

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

                {ticketData && (
                  <div className="px-4 pb-5">
                    <div className="mb-5 p-4 rounded-lg flex items-center gap-10 bg-white bg-opacity-80">
                      <RadioGroup
                        value={printType}
                        onValueChange={setPrintType}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="default" id="r1" />
                          <Label htmlFor="r1">
                            {translate(
                              "ডিফল্ট প্রিন্ট সিস্টেম",
                              "Default Print System"
                            )}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pos" id="r2" />
                          <Label htmlFor="r2">
                            {translate(
                              "POS (80mm) প্রিন্ট",
                              "POS (80mm) Print"
                            )}
                          </Label>
                        </div>
                      </RadioGroup>

                      <Button
                        onClick={invoicePrintHandler}
                        variant="primary"
                        className="w-full md:w-auto"
                      >
                        {translate("প্রিন্ট করুন", "Print")}
                      </Button>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 ">
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
                                                  <div className="flex flex-col items-center gap-1">
                                                    {/* Checkbox */}
                                                    <input
                                                      disabled={
                                                        seat?.status ===
                                                          "CancelRequest" ||
                                                        seat?.status ===
                                                          "Cancelled"
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

                                                    {/* Warning message */}
                                                    {(seat?.status ===
                                                      "CancelRequest" ||
                                                      seat?.status ===
                                                        "Cancelled") && (
                                                      <span className="text-red-600 text-xs">
                                                        Already canceled
                                                      </span>
                                                    )}
                                                  </div>
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
                      </div>
                    </div>

                    <div
                      className="border-2 mx-auto border-black bg-white p-1"
                      style={{ width: "100%", maxWidth: "8.5in" }}
                    >
                      <div className="flex justify-between">
                        {/* Supervisor Section */}
                        <div
                          className="border-r-2 border-dashed border-black p-2"
                          style={{ width: "25%" }}
                        >
                          <div className="space-y-1 text-sm">
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
                              <strong>Ticket No:</strong> {ticketData.ticketNo}
                            </p>
                            <p>
                              <strong>Gender:</strong> {ticketData.gender}
                            </p>
                            <p>
                              <strong>From:</strong> {ticketData.boardingPoint}
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

                        {/* Client Section */}
                        <div
                          className="border-r-2 border-dashed border-black p-2 relative"
                          style={{ width: "50%" }}
                        >
                          <div className="absolute top-2 right-2">
                            <QRCode
                              value={generateQRData(ticketData)}
                              size={60}
                            />
                          </div>
                          <div className="space-y-1 text-sm">
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
                                <strong>Mobile:</strong> {ticketData.phone}
                              </p>
                              <p>
                                <strong>Ticket No:</strong>{" "}
                                {ticketData.ticketNo}
                              </p>
                            </div>
                            <p>
                              <strong>Coach No:</strong>{" "}
                              {ticketData?.coachConfig?.coachNo}
                            </p>
                            <p>
                              <strong>Gender:</strong> {ticketData.gender}
                            </p>
                            <div className="flex gap-2">
                              <p>
                                <strong>From:</strong>{" "}
                                {ticketData.boardingPoint}
                              </p>
                              <p>
                                <strong>To:</strong> {ticketData.droppingPoint}
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
                            <p>
                              <strong>Seat No:</strong>{" "}
                              {ticketData?.orderSeat
                                ?.map((seat: any) => seat?.seat)
                                .join(", ")}
                            </p>
                          </div>
                        </div>

                        {/* Office Section */}
                        <div className="p-2" style={{ width: "25%" }}>
                          <div className="space-y-1 text-sm">
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
                              <strong>Ticket No:</strong> {ticketData.ticketNo}
                            </p>
                            <p>
                              <strong>Gender:</strong> {ticketData.gender}
                            </p>
                            <p>
                              <strong>From:</strong> {ticketData.boardingPoint}
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
                      <div className="text-center font-bold mt-2">
                        {ticketData.boardingPoint} - {ticketData.droppingPoint}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </PageTransition>
        </div>
      </PageWrapper>

      <div className="invisible hidden -left-full">
        {saleData && printType === "default" && (
          <TickitPrint ref={printSaleRef} tickitData={saleData} />
        )}
        {saleData && printType === "pos" && (
          <POSCounterTicketPrint ref={posPrintRef} tickitData={saleData} />
        )}
      </div>
    </section>
  );
};

export default CounterFindTicket;
