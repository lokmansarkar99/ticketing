import React from "react";
import { Paragraph } from "@/components/common/typography/Paragraph";
import QRCode from "react-qr-code";

interface ITickitPrintProps {
  tickitData: any;
}

const TickitPrint = React.forwardRef<HTMLDivElement, ITickitPrintProps>(
  ({ tickitData: tickitInfo }, ref) => {
    const boardingPoint = tickitInfo?.data?.boardingPoint;
    const viaRoute = tickitInfo?.data?.coachConfig?.coach?.CoachViaRoute || [];
    const result = {
      boardingSchedule: viaRoute.find(
        (route: { counter: { name: any } }) =>
          route.counter.name === boardingPoint
      )?.boardingTime,

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

    // return order
    const returnBoardingPoint = tickitInfo?.data?.returnOrder?.boardingPoint;
    const returnViaRoute =
      tickitInfo?.data?.returnOrder?.coachConfig?.coach?.CoachViaRoute || [];
    const returnResult = {
      boardingSchedule: returnViaRoute.find(
        (route: { station: { name: any } }) =>
          route.station.name === returnBoardingPoint
      )?.schedule,

      departureDate: tickitInfo?.data?.returnOrder?.coachConfig?.departureDate,
    };

    const returnReportingTime = calculateReportingTime(
      returnResult?.boardingSchedule
    );

    // Generate the QR code data
    const qrData = JSON.stringify({
      phone: tickitInfo?.data?.phone || "N/A",
      ticketNo: tickitInfo?.data?.ticketNo || "404NOTFOUND",
      seats:
        tickitInfo?.data?.orderSeat
          ?.map((seat: any) => seat?.seat)
          .join(", ") || "N/A",
      unitPrice: tickitInfo?.data?.orderSeat?.map(
        (price: any) => price?.unitPrice
      ),
      customerName: tickitInfo?.data?.customerName,
      address: tickitInfo?.data?.address,
      gender: tickitInfo?.data?.gender,
      age: tickitInfo?.data?.age,
      boardingPoint: tickitInfo?.data?.boardingPoint,
      droppingPoint: tickitInfo?.data?.droppingPoint,
      departureDate:
        tickitInfo?.data?.orderSeat?.[0]?.coachConfig?.departureDate,
      createdAt: tickitInfo?.data?.createdAt,
      schedule: tickitInfo?.data?.orderSeat?.[0]?.coachConfig?.schedule,
      amount: tickitInfo?.data?.amount,
      paymentAmount: tickitInfo?.data?.paymentAmount,
      coachNo: tickitInfo?.data?.orderSeat?.[0]?.coachConfig?.coachNo,
    });

    // return
    const returnQrData = JSON.stringify({
      phone: tickitInfo?.data?.returnOrder?.phone || "N/A",
      ticketNo: tickitInfo?.data?.returnOrder?.ticketNo || "404NOTFOUND",
      seats:
        tickitInfo?.data?.returnOrder?.orderSeat
          ?.map((seat: any) => seat?.seat)
          .join(", ") || "N/A",
      unitPrice: tickitInfo?.data?.returnOrder?.orderSeat?.map(
        (price: any) => price?.unitPrice
      ),
      customerName: tickitInfo?.data?.returnOrder?.customerName,
      address: tickitInfo?.data?.returnOrder?.address,
      gender: tickitInfo?.data?.returnOrder?.gender,
      age: tickitInfo?.data?.returnOrder?.age,
      boardingPoint: tickitInfo?.data?.returnOrder?.boardingPoint,
      droppingPoint: tickitInfo?.data?.returnOrder?.droppingPoint,
      departureDate:
        tickitInfo?.data?.returnOrder?.orderSeat?.[0]?.coachConfig
          ?.departureDate,
      createdAt: tickitInfo?.data?.returnOrder?.createdAt,
      schedule:
        tickitInfo?.data?.returnOrder?.orderSeat?.[0]?.coachConfig?.schedule,
      amount: tickitInfo?.data?.returnOrder?.amount,
      paymentAmount: tickitInfo?.data?.returnOrder?.paymentAmount,
      coachNo:
        tickitInfo?.data?.returnOrder?.orderSeat?.[0]?.coachConfig?.coachNo,
    });

    return (
      <div
        ref={ref}
        style={{
          width: "8.5in",
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
            <div className="relative z-10 left-3 top-16">
              <Paragraph size="sm">
                Passenger Name: {tickitInfo?.data?.customerName}
              </Paragraph>
              <Paragraph size="sm">
                Address: {tickitInfo?.data?.address}
              </Paragraph>
              <div className="flex gap-2 items-center">
                <Paragraph size="sm">
                  Mobile: {tickitInfo?.data?.phone}
                </Paragraph>
                <Paragraph size="sm">
                  Ticket No: {tickitInfo?.data?.ticketNo}
                </Paragraph>
              </div>
              <Paragraph size="sm">
                Coach No: {tickitInfo?.data?.coachConfig?.coachNo}
              </Paragraph>
              <Paragraph size="sm">
                Gender: {tickitInfo?.data?.gender}
              </Paragraph>

              <div className="flex gap-2 items-center">
                <Paragraph size="sm">
                  From: {tickitInfo?.data?.boardingPoint}
                </Paragraph>
                <Paragraph size="sm">
                  To: {tickitInfo?.data?.droppingPoint}
                </Paragraph>
              </div>
              <div className="flex gap-2 items-center">
                <Paragraph size="sm">
                  Journey Dt: {tickitInfo?.data?.date || "N/A"}
                </Paragraph>
                <Paragraph size="sm">
                  Issue Dt:{" "}
                  {tickitInfo?.data?.createdAt
                    ? new Date(tickitInfo.data.createdAt).toLocaleDateString()
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
                  {tickitInfo?.data?.orderSeat?.[0]?.unitPrice || 0}
                </Paragraph>
                <Paragraph size="sm">
                  Total Fare(Tk): {tickitInfo?.data?.paymentAmount || 0}
                </Paragraph>
              </div>
              <Paragraph size="sm">
                Seat No:{" "}
                {tickitInfo?.data?.orderSeat
                  ?.map((seat: any) => seat?.seat)
                  .join(", ")}
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

            <div className="relative z-10 left-2 top-5">
              <Paragraph size="sm">
                Name: {tickitInfo?.data?.customerName}
              </Paragraph>
              <Paragraph size="sm">Mobile: {tickitInfo?.data?.phone}</Paragraph>
              <Paragraph size="sm">
                Coach No: {tickitInfo?.data?.coachConfig?.coachNo}
              </Paragraph>
              <Paragraph size="sm">
                Ticket No: {tickitInfo?.data?.ticketNo}
              </Paragraph>
              <Paragraph size="sm">
                Gender: {tickitInfo?.data?.gender}
              </Paragraph>

              <Paragraph size="sm">
                From: {tickitInfo?.data?.boardingPoint}
              </Paragraph>
              <Paragraph size="sm">
                To: {tickitInfo?.data?.droppingPoint}
              </Paragraph>
              <Paragraph size="sm">
                Departure Time: {result?.boardingSchedule || "N/A"}
              </Paragraph>
              <Paragraph size="sm">
                Seat Fare(Tk): {tickitInfo?.data?.orderSeat?.[0]?.unitPrice}
              </Paragraph>
              <Paragraph size="sm">
                Total Fare(Tk): {tickitInfo?.data?.paymentAmount || 0}
              </Paragraph>
              <Paragraph size="sm">
                Seat No:{" "}
                {tickitInfo?.data?.orderSeat
                  ?.map((seat: any) => seat?.seat)
                  .join(", ")}
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

            <div className="relative z-10 left-2 top-5">
              <Paragraph size="sm">
                Name: {tickitInfo?.data?.customerName}
              </Paragraph>
              <Paragraph size="sm">Mobile: {tickitInfo?.data?.phone}</Paragraph>
              <Paragraph size="sm">
                Coach No: {tickitInfo?.data?.coachConfig?.coachNo}
              </Paragraph>
              <Paragraph size="sm">
                Ticket No: {tickitInfo?.data?.ticketNo}
              </Paragraph>
              <Paragraph size="sm">
                Gender: {tickitInfo?.data?.gender}
              </Paragraph>

              <Paragraph size="sm">
                From: {tickitInfo?.data?.boardingPoint}
              </Paragraph>
              <Paragraph size="sm">
                To: {tickitInfo?.data?.droppingPoint}
              </Paragraph>
              <Paragraph size="sm">
                Departure Time: {result?.boardingSchedule || "N/A"}
              </Paragraph>
              <Paragraph size="sm">
                Seat Fare(Tk): {tickitInfo?.data?.orderSeat?.[0]?.unitPrice}
              </Paragraph>
              <Paragraph size="sm">
                Total Fare(Tk): {tickitInfo?.data?.paymentAmount}
              </Paragraph>
              <Paragraph size="sm">
                Seat No:{" "}
                {tickitInfo?.data?.orderSeat
                  ?.map((seat: any) => seat?.seat)
                  .join(", ")}
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

        {/* return order */}
        {tickitInfo?.data?.returnOrder && (
          <>
            <h1 className="text-center underline my-5">Return Ticket</h1>
            <section
              style={{
                width: "8.5in",
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
                <div className="absolute top-10 right-5">
                  <QRCode value={returnQrData} size={60} />
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
                    Passenger Name:{" "}
                    {tickitInfo?.data?.returnOrder?.customerName}
                  </Paragraph>
                  <Paragraph size="sm">
                    Address: {tickitInfo?.data?.returnOrder?.address}
                  </Paragraph>
                  <div className="flex gap-2 items-center">
                    <Paragraph size="sm">
                      Mobile: {tickitInfo?.data?.returnOrder?.phone}
                    </Paragraph>
                    <Paragraph size="sm">
                      Ticket No: {tickitInfo?.data?.returnOrder?.ticketNo}
                    </Paragraph>
                  </div>
                  <Paragraph size="sm">
                    Gender: {tickitInfo?.data?.returnOrder?.gender}
                  </Paragraph>

                  <div className="flex gap-2 items-center">
                    <Paragraph size="sm">
                      From: {tickitInfo?.data?.returnOrder?.boardingPoint}
                    </Paragraph>
                    <Paragraph size="sm">
                      To: {tickitInfo?.data?.returnOrder?.droppingPoint}
                    </Paragraph>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Paragraph size="sm">
                      Journey Dt: {tickitInfo?.data?.returnOrder?.date || "N/A"}
                    </Paragraph>
                    <Paragraph size="sm">
                      Issue Dt:{" "}
                      {tickitInfo?.data?.returnOrder?.createdAt
                        ? new Date(
                            tickitInfo.data.returnOrder?.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </Paragraph>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Paragraph size="sm">
                      Reporting Time: {returnReportingTime || "N/A"}
                    </Paragraph>
                    <Paragraph size="sm">
                      Departure Time: {returnResult?.boardingSchedule || "N/A"}
                    </Paragraph>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Paragraph size="sm">
                      Seat Fare(Tk):{" "}
                      {tickitInfo?.data?.returnOrder?.orderSeat?.[0]?.unitPrice}
                    </Paragraph>
                    <Paragraph size="sm">
                      Total Fare(Tk):{" "}
                      {tickitInfo?.data?.returnOrder?.paymentAmount}
                    </Paragraph>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Paragraph size="sm">
                      Seat No:{" "}
                      {tickitInfo?.data?.returnOrder?.orderSeat
                        ?.map((seat: any) => seat?.seat)
                        .join(", ")}
                    </Paragraph>
                    <Paragraph size="sm">
                      Coach No:{" "}
                      {tickitInfo?.data?.returnOrder?.coachConfig?.coachNo}
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
                  <Paragraph size="sm">
                    Name: {tickitInfo?.data?.returnOrder?.customerName}
                  </Paragraph>
                  <Paragraph size="sm">
                    Mobile: {tickitInfo?.data?.returnOrder?.phone}
                  </Paragraph>
                  <Paragraph size="sm">
                    Ticket No: {tickitInfo?.data?.returnOrder?.ticketNo}
                  </Paragraph>
                  <Paragraph size="sm">
                    Gender: {tickitInfo?.data?.returnOrder?.gender}
                  </Paragraph>

                  <Paragraph size="sm">
                    From: {tickitInfo?.data?.returnOrder?.boardingPoint}
                  </Paragraph>
                  <Paragraph size="sm">
                    To: {tickitInfo?.data?.returnOrder?.droppingPoint}
                  </Paragraph>
                  <Paragraph size="sm">
                    Departure Time: {result?.boardingSchedule || "N/A"}
                  </Paragraph>
                  <Paragraph size="sm">
                    Seat Fare(Tk):{" "}
                    {tickitInfo?.data?.returnOrder?.orderSeat?.[0]?.unitPrice}
                  </Paragraph>
                  <Paragraph size="sm">
                    Total Fare(Tk):{" "}
                    {tickitInfo?.data?.returnOrder?.paymentAmount}
                  </Paragraph>
                  <Paragraph size="sm">
                    Seat No:{" "}
                    {tickitInfo?.data?.returnOrder?.orderSeat
                      ?.map((seat: any) => seat?.seat)
                      .join(", ")}
                  </Paragraph>
                  <Paragraph size="sm">
                    Coach No:{" "}
                    {tickitInfo?.data?.returnOrder?.coachConfig?.coachNo}
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
                  <Paragraph size="sm">
                    Name: {tickitInfo?.data?.returnOrder?.customerName}
                  </Paragraph>
                  <Paragraph size="sm">
                    Mobile: {tickitInfo?.data?.returnOrder?.phone}
                  </Paragraph>
                  <Paragraph size="sm">
                    Ticket No: {tickitInfo?.data?.returnOrder?.ticketNo}
                  </Paragraph>
                  <Paragraph size="sm">
                    Gender: {tickitInfo?.data?.returnOrder?.gender}
                  </Paragraph>

                  <Paragraph size="sm">
                    From: {tickitInfo?.data?.returnOrder?.boardingPoint}
                  </Paragraph>
                  <Paragraph size="sm">
                    To: {tickitInfo?.data?.returnOrder?.droppingPoint}
                  </Paragraph>
                  <Paragraph size="sm">
                    Departure Time: {returnResult?.boardingSchedule || "N/A"}
                  </Paragraph>
                  <Paragraph size="sm">
                    Seat Fare(Tk):{" "}
                    {tickitInfo?.data?.returnOrder?.orderSeat?.[0]?.unitPrice}
                  </Paragraph>
                  <Paragraph size="sm">
                    Total Fare(Tk):{" "}
                    {tickitInfo?.data?.returnOrder?.paymentAmount}
                  </Paragraph>
                  <Paragraph size="sm">
                    Seat No:{" "}
                    {tickitInfo?.data?.returnOrder?.orderSeat
                      ?.map((seat: any) => seat?.seat)
                      .join(", ")}
                  </Paragraph>
                  <Paragraph size="sm">
                    Coach No:{" "}
                    {tickitInfo?.data?.returnOrder?.coachConfig?.coachNo}
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
          </>
        )}
      </div>
    );
  }
);

export default TickitPrint;
