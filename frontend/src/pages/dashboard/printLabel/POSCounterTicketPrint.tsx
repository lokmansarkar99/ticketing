import { Paragraph } from "@/components/common/typography/Paragraph";
import React from "react";
import QRCode from "react-qr-code";

interface IPOSCounterTicketPrintProps {
  tickitData: any;
}

const POSCounterTicketPrint = React.forwardRef<
  HTMLDivElement,
  IPOSCounterTicketPrintProps
>(({ tickitData: tickitInfo }, ref) => {
  const boardingPoint = tickitInfo?.data?.boardingPoint;
  const viaRoute = tickitInfo?.data?.coachConfig?.coach?.CoachViaRoute || [];
  const result = {
    boardingSchedule: viaRoute.find(
      (route: { station: { name: any } }) =>
        route.station.name === boardingPoint
    )?.schedule,
    departureDate: tickitInfo?.data?.coachConfig?.departureDate,
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

  const generateQRData = () => {
    return JSON.stringify({
      phone: tickitInfo?.data?.phone || "N/A",
      ticketNo: tickitInfo?.data?.ticketNo || "N/A",
      seats: tickitInfo?.data?.orderSeat?.map((seat: any) => seat?.seat).join(", ") || "N/A",
      customerName: tickitInfo?.data?.customerName,
      boardingPoint: tickitInfo?.data?.boardingPoint,
      droppingPoint: tickitInfo?.data?.droppingPoint,
      amount: tickitInfo?.data?.amount,
      departureTime: tickitInfo?.data?.orderSeat?.[0]?.schedule,
      coachNo: tickitInfo?.data?.orderSeat?.[0]?.coachConfig?.coachNo
    });
  };

  const seatNo = tickitInfo?.data?.orderSeat?.filter(
    (s: any) => s.date === tickitInfo?.data?.date
  );

  const returnSeatNo = tickitInfo?.data?.orderSeat?.filter(
    (s: any) => s.date === tickitInfo?.data?.returnDate
  );

  return (
    <section
      ref={ref}
      style={{
        width: "80mm",
        minHeight: "200mm",
        maxHeight: "200mm",
        overflow: "hidden"
      }}
      className="mx-auto border border-black relative p-1 text-xs"
    >
      {/* Header Section */}
      <div className="flex justify-center items-center py-1">
        {/* Add your logo here if needed */}
      </div>

      {/* Main Content */}
      <div className="border-t border-dashed border-black flex flex-col">
        {/* Supervisor Section */}
        <div className="w-full p-1 border-b border-dashed border-black">
          <Paragraph className="font-bold text-center">
           <span className="font-semibold">Ticket No:</span> {tickitInfo?.data?.ticketNo}
          </Paragraph>
          <div className="grid grid-cols-2 gap-1">
            <Paragraph><span className="font-semibold">Name:</span> {tickitInfo?.data?.customerName}</Paragraph>
            <Paragraph><span className="font-semibold">Mobile:</span> {tickitInfo?.data?.phone}</Paragraph>
            <Paragraph><span className="font-semibold">From:</span> {tickitInfo?.data?.boardingPoint}</Paragraph>
            <Paragraph><span className="font-semibold">To:</span> {tickitInfo?.data?.droppingPoint}</Paragraph>
            <Paragraph><span className="font-semibold">Seat:</span> {seatNo?.map((s: any) => s.seat).join(", ")}</Paragraph>
            <Paragraph><span className="font-semibold">Coach:</span> {tickitInfo?.data?.coachConfig?.coachNo}</Paragraph>
            <Paragraph><span className="font-semibold">Time:</span> {result?.boardingSchedule || "N/A"}</Paragraph>
            <Paragraph><span className="font-semibold">Fare:</span> {tickitInfo?.data?.orderSeat[0]?.unitPrice}৳</Paragraph>
          </div>
        </div>

        {/* Client Section */}
        <div className="w-full p-1 border-b border-dashed border-black relative">
          <div className="absolute top-1 right-1">
            <QRCode value={generateQRData()} size={40} />
          </div>
          
          <Paragraph className="font-bold text-center">
            PASSENGER COPY
          </Paragraph>
          
          <div className="grid grid-cols-2 gap-1">
            <Paragraph><span className="font-semibold">Name:</span> {tickitInfo?.data?.customerName}</Paragraph>
            <Paragraph><span className="font-semibold">Mobile:</span> {tickitInfo?.data?.phone}</Paragraph>
            <Paragraph><span className="font-semibold">From:</span> {tickitInfo?.data?.boardingPoint}</Paragraph>
            <Paragraph><span className="font-semibold">To:</span> {tickitInfo?.data?.droppingPoint}</Paragraph>
            <Paragraph><span className="font-semibold">Date:</span> {new Date(seatNo?.[0]?.date).toLocaleDateString()}</Paragraph>
            <Paragraph><span className="font-semibold">Time:</span> {result?.boardingSchedule || "N/A"}</Paragraph>
            <Paragraph><span className="font-semibold">Report:</span> {reportingTime || "N/A"}</Paragraph>
            <Paragraph><span className="font-semibold">Seat:</span> {seatNo?.map((s: any) => s.seat).join(", ")}</Paragraph>
            <Paragraph><span className="font-semibold">Coach:</span> {tickitInfo?.data?.coachConfig?.coachNo}</Paragraph>
            <Paragraph><span className="font-semibold">Fare:</span> {tickitInfo?.data?.amount}৳</Paragraph>
          </div>

          {/* Return Trip Info */}
          {tickitInfo?.data?.orderType === "Round_Trip" && (
            <div className="mt-1 border-t border-dashed pt-1">
              <Paragraph className="font-bold text-center">
                RETURN TRIP
              </Paragraph>
              <div className="grid grid-cols-2 gap-1">
                <Paragraph><span className="font-semibold">Date:</span> {new Date(tickitInfo?.data?.returnDate).toLocaleDateString()}</Paragraph>
                <Paragraph><span className="font-semibold">From:</span> {tickitInfo?.data?.returnBoardingPoint}</Paragraph>
                <Paragraph><span className="font-semibold">To:</span> {tickitInfo?.data?.returnDroppingPoint}</Paragraph>
                <Paragraph><span className="font-semibold">Time:</span> {returnSeatNo?.[0]?.schedule}</Paragraph>
                <Paragraph><span className="font-semibold">Seat:</span> {returnSeatNo?.map((s: any) => s.seat).join(", ")}</Paragraph>
                <Paragraph><span className="font-semibold">Coach:</span> {returnSeatNo?.[0]?.coachConfig?.coachNo}</Paragraph>
              </div>
            </div>
          )}
        </div>

        {/* Office Section */}
        <div className="w-full p-1">
          <Paragraph className="font-bold text-center">
           <span className="font-semibold">Ticket No:</span> {tickitInfo?.data?.ticketNo}
          </Paragraph>
          <div className="grid grid-cols-2 gap-1">
            <Paragraph><span className="font-semibold">Name:</span> {tickitInfo?.data?.customerName}</Paragraph>
            <Paragraph><span className="font-semibold">Mobile:</span> {tickitInfo?.data?.phone}</Paragraph>
            <Paragraph><span className="font-semibold">From:</span> {tickitInfo?.data?.boardingPoint}</Paragraph>
            <Paragraph><span className="font-semibold">To:</span> {tickitInfo?.data?.droppingPoint}</Paragraph>
            <Paragraph><span className="font-semibold">Seat:</span> {seatNo?.map((s: any) => s.seat).join(", ")}</Paragraph>
            <Paragraph><span className="font-semibold">Coach:</span> {tickitInfo?.data?.coachConfig?.coachNo}</Paragraph>
            <Paragraph><span className="font-semibold">Time:</span> {result?.boardingSchedule || "N/A"}</Paragraph>
            <Paragraph><span className="font-semibold">Fare:</span> {tickitInfo?.data?.orderSeat[0]?.unitPrice}৳</Paragraph>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-dashed border-black text-center py-1">
        <Paragraph className="font-bold">
          {tickitInfo?.data?.boardingPoint} - {tickitInfo?.data?.droppingPoint}
        </Paragraph>
        <Paragraph className="text-[8px]">
          Keep luggage under your responsibility. iconic-beta.netlify.app
        </Paragraph>
      </div>
    </section>
  );
});

export default POSCounterTicketPrint;