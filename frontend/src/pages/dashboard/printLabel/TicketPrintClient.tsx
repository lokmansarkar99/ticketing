// import { Heading } from "@/components/common/typography/Heading";
import { Paragraph } from "@/components/common/typography/Paragraph";
import React from "react";
import QRCode from "react-qr-code";

interface ITickitPrintClientProps {
  logo: any;
  saleData?: any; // Optional prop for sale data
}

const TickitPrintClient = React.forwardRef<
  HTMLDivElement,
  ITickitPrintClientProps
>(({ saleData }, ref) => {
  const boardingPoint =
    saleData?.order?.boardingPoint || saleData?.boardingPoint;
  const viaRoute =
    saleData?.order?.coachConfig?.coach?.CoachViaRoute ||
    saleData?.coachConfig?.coach?.CoachViaRoute ||
    [];
  const result = {
    boardingSchedule: viaRoute.find(
      (route: { counter: { name: any } }) =>
        route.counter.name === boardingPoint
    )?.boardingTime,

    departureDate: saleData?.coachConfig?.departureDate,
  };


  // Calculate reporting time (15 minutes before departure)
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

  // Get the reporting time
  const reportingTime = calculateReportingTime(result?.boardingSchedule);


  const seatNo = (
    saleData?.order?.orderSeat ||
    saleData?.orderSeat ||
    []
  ).filter((s: any) => s.date === saleData?.date);

  const seatFare = seatNo?.length
    ? saleData?.paymentAmount / seatNo?.length
    : "N/A";

  const qrMinimalData = {
    t: saleData?.order?.ticketNo || saleData?.ticketNo || "N/A",
    p: saleData?.order?.phone || saleData?.phone || "N/A",
    s: seatNo?.map((seat: any) => seat?.seat).join(", ") || "N/A",
  };

  return (
    <div
      ref={ref}
      style={{
        width: "10.5in",
        height: "8.7in",
      }}
    >
      <h1 className="text-center underline">Up Ticket</h1>
      <section
        style={{
          width: "10.5in",
          height: "3.7in",
        }}
        className="flex justify-between mx-auto border-2 border-black relative"
      >
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
          <div className="absolute top-5 right-5">
            <QRCode
              value={JSON.stringify(qrMinimalData)}
              style={{
                background: "white",
                padding: "1px",
                width: "80px",
                height: "80px",
              }}
            />
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
          <div className="relative z-10 left-3 top-16">
            <Paragraph size="sm">
              Passenger Name:{" "}
              {saleData?.order?.customerName || saleData?.customerName || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Address: {saleData?.order?.address || saleData?.address || "N/A"}
            </Paragraph>
            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                Mobile: {saleData?.order?.phone || saleData?.phone || "N/A"}
              </Paragraph>
              <Paragraph size="sm">
                Ticket No:{" "}
                {saleData?.order?.ticketNo || saleData?.ticketNo || "N/A"}
              </Paragraph>
            </div>
            <Paragraph size="sm">
              Coach No:{" "}
              {saleData?.order?.coachConfig?.coach?.coachNo ||
                saleData?.coachConfig?.coachNo ||
                "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Gender: {saleData?.order?.gender || saleData?.gender || "N/A"}
            </Paragraph>

            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                From: {saleData?.boardingPoint || boardingPoint || "N/A"}
              </Paragraph>
              <Paragraph size="sm">
                To:{" "}
                {saleData?.order?.droppingPoint ||
                  saleData?.droppingPoint ||
                  "N/A"}
              </Paragraph>
            </div>
            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                Journey Dt: {saleData?.order?.date || saleData?.date || "N/A"}
              </Paragraph>
              <Paragraph size="sm">
                Issue Dt:{" "}
                {saleData?.order?.createdAt || saleData?.createdAt
                  ? new Date(
                      saleData?.order?.createdAt || saleData?.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </Paragraph>
            </div>
            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                Reporting Time: {reportingTime || "N/A"}
              </Paragraph>
              <Paragraph size="sm">
                Departure Time: {result?.boardingSchedule || "N/A"}
              </Paragraph>
            </div>

            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                Seat Fare(Tk):{" "}
                {saleData?.order?.paymentAmount / seatNo?.length ||
                  seatFare ||
                  "N/A"}
              </Paragraph>
              <Paragraph size="sm">
                Total Fare(Tk):{" "}
                {saleData?.order?.paymentAmount || saleData?.amount || "N/A"}
              </Paragraph>
            </div>
            <Paragraph size="sm">
              Seat No:{" "}
              {seatNo?.map((seat: any) => seat?.seat).join(", ") || "N/A"}
            </Paragraph>
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

        {/* Supervisor Section */}
        <section
          style={{
            width: "3.1in",
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

          <div className="relative z-10 left-3 top-5">
            <Paragraph size="sm">
              Name:{" "}
              {saleData?.order?.customerName || saleData?.customerName || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Mobile: {saleData?.order?.phone || saleData?.phone || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Coach No:{" "}
              {saleData?.order?.coachConfig?.coach?.coachNo ||
                saleData?.coachConfig?.coachNo ||
                "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Ticket No:{" "}
              {saleData?.order?.ticketNo || saleData?.ticketNo || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Gender: {saleData?.order?.gender || saleData?.gender || "N/A"}
            </Paragraph>

            <Paragraph size="sm">
              From: {saleData?.boardingPoint || boardingPoint || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              To:{" "}
              {saleData?.order?.droppingPoint ||
                saleData?.droppingPoint ||
                "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Departure Time: {result?.boardingSchedule || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Seat Fare(Tk):{" "}
              {saleData?.order?.paymentAmount / seatNo?.length ||
                seatFare ||
                "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Total Fare(Tk):{" "}
              {saleData?.order?.paymentAmount || saleData?.amount || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Seat No:{" "}
              {seatNo?.map((seat: any) => seat?.seat).join(", ") || "N/A"}
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

        {/* Office Section */}
        <section
          style={{
            width: "3.1in",
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

          <div className="relative z-10 left-3 top-5">
            <Paragraph size="sm">
              Name:{" "}
              {saleData?.order?.customerName || saleData?.customerName || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Mobile: {saleData?.order?.phone || saleData?.phone || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Coach No:{" "}
              {saleData?.order?.coachConfig?.coach?.coachNo ||
                saleData?.coachConfig?.coachNo ||
                "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Ticket No:{" "}
              {saleData?.order?.ticketNo || saleData?.ticketNo || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Gender: {saleData?.order?.gender || saleData?.gender || "N/A"}
            </Paragraph>

            <Paragraph size="sm">
              From: {saleData?.boardingPoint || boardingPoint || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              To:{" "}
              {saleData?.order?.droppingPoint ||
                saleData?.droppingPoint ||
                "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Departure Time: {result?.boardingSchedule || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Seat Fare(Tk):{" "}
              {saleData?.order?.paymentAmount / seatNo?.length ||
                seatFare ||
                "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Total Fare(Tk):{" "}
              {saleData?.order?.paymentAmount || saleData?.amount || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Seat No:{" "}
              {seatNo?.map((seat: any) => seat?.seat).join(", ") || "N/A"}
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
    </div>
  );
});

export default TickitPrintClient;
