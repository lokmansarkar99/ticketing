import React from "react";
import { Paragraph } from "@/components/common/typography/Paragraph";
import QRCode from "react-qr-code";
import { useGetSingleOrderDetailsQuery } from "@/store/api/counter/counterSalesBookingApi";
import { Loader } from "@/components/common/Loader";

interface ITickitPrintSingleProps {
  tickitData: any;
}

const TickitPrintSingle = React.forwardRef<
  HTMLDivElement,
  ITickitPrintSingleProps
>(({ tickitData: tickitInfo }, ref) => {
  const { data: orderData, isLoading: orderLoading } =
    useGetSingleOrderDetailsQuery(tickitInfo?.orderId);
  const calculateReportingTime = (schedule: string | undefined): string => {
    if (!schedule || typeof schedule !== "string") {
      console.error("Invalid schedule provided:", schedule);
      return "Invalid time"; // Fallback for invalid schedule
    }

    const [time, period] = schedule.split(" ");
    if (!time || !period) {
      console.error("Malformed schedule:", schedule);
      return "Invalid time"; // Fallback for malformed input
    }

    const [hours, minutes] = time.split(":").map(Number);

    // Convert to 24-hour format if necessary
    let departureHours = period === "PM" && hours !== 12 ? hours + 12 : hours;
    if (period === "AM" && hours === 12) departureHours = 0; // Handle midnight case

    // Create a Date object for the schedule time
    const departureTime = new Date();
    departureTime.setHours(departureHours, minutes, 0, 0);

    // Subtract 15 minutes
    const reportingTime = new Date(departureTime.getTime() - 15 * 60 * 1000);

    // Format the reporting time back to a readable string
    const reportingHours = reportingTime.getHours() % 12 || 12; // Convert to 12-hour format
    const reportingMinutes = reportingTime
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const reportingPeriod = reportingTime.getHours() >= 12 ? "PM" : "AM";

    return `${reportingHours}:${reportingMinutes} ${reportingPeriod}`;
  };
  // Generate the QR code data
  const qrData = JSON.stringify({
    phone: orderData?.data?.phone || "N/A",
    ticketNo: orderData?.data?.ticketNo || "404NOTFOUND",
    seats:
      orderData?.data?.orderSeat?.map((seat: any) => seat?.seat).join(", ") ||
      "N/A",
    customerName: orderData?.data?.customerName,
    address: orderData?.data?.address,
    gender: orderData?.data?.gender,
    age: orderData?.data?.age,
    boardingPoint: orderData?.data?.boardingPoint,
    droppingPoint: orderData?.data?.droppingPoint,
    departureDate: orderData?.data?.orderSeat?.[0]?.coachConfig?.departureDate,
    createdAt: orderData?.data?.createdAt,
    schedule: orderData?.data?.orderSeat?.[0]?.coachConfig?.schedule,
    amount: orderData?.data?.amount,
    paymentAmount: orderData?.data?.paymentAmount,
    coachNo: orderData?.data?.orderSeat?.[0]?.coachConfig?.coachNo,
  });

  if (orderLoading) {
    return <Loader />;
  }

  return (
    <section
      ref={ref}
      style={{
        width: "8.5in",
        height: "3.7in",
      }}
      className="flex justify-between mx-auto border-2 border-black relative"
    >
      {/* Supervisor Section */}
      <section
        style={{
          width: "2.1in",
          height: "100%",
        }}
        className="border-r-2 border-dashed border-black relative z-10"
      >
        {/* Logo */}
        {/* <img
          src={appConfiguration?.logo}
          alt="Logo"
          className="w-20 h-auto mb-2 mx-auto"
        /> */}

        {/* Background Image */}
        {/* <div
          style={{
            backgroundImage: `url(${bus})`,
            backgroundSize: "80%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.1,
            zIndex: 0,
          }}
        ></div> */}

        <div className="relative z-10 left-7 top-11">
          <Paragraph size="sm">Name: {orderData?.data?.customerName}</Paragraph>
          <Paragraph size="sm">Mobile: {orderData?.data?.phone}</Paragraph>
          <Paragraph size="sm">
            Ticket No: {orderData?.data?.ticketNo}
          </Paragraph>
          <Paragraph size="sm">Gender: {orderData?.data?.gender}</Paragraph>

          <Paragraph size="sm">
            From: {orderData?.data?.boardingPoint}
          </Paragraph>
          <Paragraph size="sm">To: {orderData?.data?.droppingPoint}</Paragraph>
          <Paragraph size="sm">
            Departure Time:{" "}
            {orderData?.data?.coachConfig?.coach?.schedule}
          </Paragraph>
          <Paragraph size="sm">
            Seat Fare(Tk): {orderData?.data?.paymentAmount}
          </Paragraph>
          <Paragraph size="sm">
            Seat No:{" "}
            {orderData?.data?.orderSeat
              ?.map((seat: any) => seat?.seat)
              .join(", ")}
          </Paragraph>
          <Paragraph size="sm">
            Coach No: {orderData?.data?.coachConfig?.coach?.coachNo}
          </Paragraph>
        </div>

        {/* Rotated Text */}
        {/* <div className="absolute z-20 bg-[#BE02D3] px-3 rounded-br-md rounded-bl-md -left-9 top-[45%] -rotate-90">
          <Paragraph size="sm" className="text-white font-semibold">
            Guide Copy
          </Paragraph>
        </div>

        <div className="bg-[#BE02D3] h-[44px] mt-1 w-full pl-2">
          <p className="font-semibold  text-sm text-white">
            For Online Ticket
          </p>
          <p className="text-xs text-white">
            https://iconic-beta.netlify.app/
          </p>
        </div> */}
      </section>

      {/* Client Section */}
      <section
        style={{
          width: "4.3in",
          height: "100%",
        }}
        className="border-r-2 border-dashed border-black relative"
      >
        {/* <div>
          <img
            src={appConfiguration?.logo}
            alt="Logo"
            className="w-20 h-auto mx-auto"
          />
          <Paragraph size={"sm"} className="font-bold pb-2 text-center">
            {" "}
            Hot line: 01945518927
          </Paragraph>
        </div> */}
        <div className="absolute top-10 right-5">
          <QRCode value={qrData} size={60} />
        </div>
        {/* <div
          style={{
            backgroundImage: `url(${bus})`,
            backgroundSize: "50%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.1,
            backgroundColor: "rgba(190, 2, 211, 0.1)",
            zIndex: 0,
          }}
        ></div> */}
        {/* Content */}
        <div className="relative z-10 left-7 top-16">
          <Paragraph size="sm">
            Passenger Name: {orderData?.data?.customerName}
          </Paragraph>
          <Paragraph size="sm">Address: {orderData?.data?.address}</Paragraph>
          <div className="flex gap-2 items-center">
            <Paragraph size="sm">Mobile: {orderData?.data?.phone}</Paragraph>
            <Paragraph size="sm">
              Ticket No: {orderData?.data?.ticketNo}
            </Paragraph>
          </div>
          <Paragraph size="sm">Gender: {orderData?.data?.gender}</Paragraph>

          <div className="flex gap-2 items-center">
            <Paragraph size="sm">
              From: {orderData?.data?.boardingPoint}
            </Paragraph>
            <Paragraph size="sm">
              To: {orderData?.data?.droppingPoint}
            </Paragraph>
          </div>
          <div className="flex gap-2 items-center">
            <Paragraph size="sm">
              Journey Dt:{" "}
              {orderData?.data?.date}
            </Paragraph>
            <Paragraph size="sm">
              Issue Dt:{" "}
              {orderData?.data?.createdAt
                ? new Date(orderData.data.createdAt).toLocaleDateString()
                : "N/A"}
            </Paragraph>
          </div>
          <div className="flex gap-2 items-center">
            <Paragraph size="sm">
              Reporting Time:{" "}
              {calculateReportingTime(
                orderData?.data?.coachConfig?.coach?.schedule
              )}
            </Paragraph>
            <Paragraph size="sm">
              Departure Time:{" "}
              {orderData?.data?.coachConfig?.coach?.schedule}
            </Paragraph>
          </div>

          <div className="flex gap-2 items-center">
            <Paragraph size="sm">
              Seat Fare(Tk): {orderData?.data?.amount}
            </Paragraph>
            <Paragraph size="sm">
              Total Fare(Tk): {orderData?.data?.paymentAmount}
            </Paragraph>
          </div>
          <div className="flex gap-2 items-center">
            <Paragraph size="sm">
              Seat No:{" "}
              {orderData?.data?.orderSeat
                ?.map((seat: any) => seat?.seat)
                .join(", ")}
            </Paragraph>
            <Paragraph size="sm">
              Coach No: {orderData?.data?.coachConfig?.coach?.coachNo}
            </Paragraph>
          </div>
        </div>
        {/* Rotated Text */}
        {/* <div className="absolute z-20 bg-[#BE02D3] px-3 rounded-br-md rounded-bl-md -left-9 top-[45%] -rotate-90">
          <Paragraph size="sm" className="text-white font-semibold">
            Client Copy
          </Paragraph>
        </div> */}
        {/* <div className="bg-[#BE02D3] h-11 mt-1 w-full pl-2">
          <p className="font-semibold  text-sm text-white">
            Please keep your luggage under your own responsibility. Thank you.
            For Online Ticket:https://iconic-beta.netlify.app/
          </p>
        </div> */}
      </section>

      {/* Office Section */}
      <section
        style={{
          width: "2.1in",
          height: "100%",
        }}
        className="relative"
      >
        {/* Logo */}
        {/* <img
          src={appConfiguration?.logo}
          alt="Logo"
          className="w-20 h-auto mb-2 mx-auto"
        /> */}

        {/* Background Image */}
        {/* <div
          style={{
            backgroundImage: `url(${bus})`,
            backgroundSize: "80%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.1,
            zIndex: 0,
          }}
        ></div> */}

        <div className="relative z-10 left-7 top-11">
          <Paragraph size="sm">Name: {orderData?.data?.customerName}</Paragraph>
          <Paragraph size="sm">Mobile: {orderData?.data?.phone}</Paragraph>
          <Paragraph size="sm">
            Ticket No: {orderData?.data?.ticketNo}
          </Paragraph>
          <Paragraph size="sm">Gender: {orderData?.data?.gender}</Paragraph>

          <Paragraph size="sm">
            From: {orderData?.data?.boardingPoint}
          </Paragraph>
          <Paragraph size="sm">To: {orderData?.data?.droppingPoint}</Paragraph>
          <Paragraph size="sm">
            Departure Time:{" "}
            {orderData?.data?.coachConfig?.coach?.schedule}
          </Paragraph>
          <Paragraph size="sm">
            Seat Fare(Tk): {orderData?.data?.paymentAmount}
          </Paragraph>
          <Paragraph size="sm">
            Seat No:{" "}
            {orderData?.data?.orderSeat
              ?.map((seat: any) => seat?.seat)
              .join(", ")}
          </Paragraph>
          <Paragraph size="sm">
            Coach No: {orderData?.data?.coachConfig?.coach?.coachNo}
          </Paragraph>
        </div>

        {/* Rotated Text */}
        {/* <div className="absolute z-20 bg-[#BE02D3] px-3 rounded-br-md rounded-bl-md -left-9 top-[45%] -rotate-90">
          <Paragraph size="sm" className="text-white font-semibold">
            Office Copy
          </Paragraph>
        </div>
        <div className="bg-[#BE02D3] h-[44px] mt-1 w-full pl-2">
          <p className="font-semibold  text-sm text-white">
            For Online Ticket
          </p>
          <p className="text-xs text-white">
            https://iconic-beta.netlify.app/
          </p>
        </div> */}
      </section>
    </section>
  );
});

export default TickitPrintSingle;
