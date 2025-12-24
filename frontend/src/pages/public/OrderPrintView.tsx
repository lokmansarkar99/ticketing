import { forwardRef } from "react";
import QRCode from "react-qr-code";
import iconicBusImg from "/public/iconis.jpg";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";

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

interface IOrderSeat {
  id: number;
  seat: string;
  class: string;
  unitPrice: number;
  date: string;
  fromStationId: number;
  status: string;
}

interface OrderPrintViewProps {
  order: IOrder;
}

const OrderPrintView = forwardRef<HTMLDivElement, OrderPrintViewProps>(
  ({ order }, ref) => {
    const qrMinimalData = {
      t: order?.ticketNo || "N/A", // Ticket number
      p: order?.phone || "N/A", // Phone
      s: order?.orderSeat?.map((seat: any) => seat?.seat).join(", ") || "N/A",
    };
    const { translate } = useCustomTranslator();
    const boardingPoint = order?.boardingPoint;
    const viaRoute = order?.coachConfig?.coach?.CoachViaRoute || [];
    const result = {
      boardingSchedule: viaRoute.find(
        (route: { station: { name: any } }) =>
          route.station.name === boardingPoint
      )?.schedule,

      departureDate: order?.date,
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

    const seatNo = (order?.orderSeat || []).filter(
      (s: any) => s.date === order?.date
    );

    const status = (order?.orderSeat || []).find(
          (s: any) => s.status
        )?.status;


    return (
      <div
        ref={ref}
        className="flex justify-center items-center p-6 min-h-screen bg-gray-100"
      >
        {/* Ticket container */}
        <div className="flex rounded-2xl overflow-hidden  w-[850px] ">
          {/* Left Part */}
          <div className="w-2/3 border-r-2 border-dashed border-b-2 bg-[#f4a3ff] border-l-2 border-gray-300 rounded-tr-2xl rounded-br-2xl overflow-hidden">
            {/* Blue Header */}
            <div className="bg-gradient-to-r from-sky-400 to-sky-600 text-white px-6 py-3 flex justify-between items-center">
              <h2 className="text-xl font-bold">Iconic Express</h2>
              <p className="text-sm">Ticket No:{order.ticketNo}</p>
            </div>

            {/* Body */}
            <div className="flex justify-between">
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
                  <span className="font-semibold">Departure Time:</span>{" "}
                  {result?.boardingSchedule || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Reporting Time:</span>{" "}
                  {reportingTime || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Boarding Point:</span>{" "}
                  {order?.boardingPoint || boardingPoint || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Dropping Point:</span>{" "}
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
                    {translate("বাস", "Status")}:
                  </span>{" "}
                  {status}
                </p>

                <p>
                  <span className="font-semibold">
                    {translate("পেমেন্ট টাইপ", "Payment Type")}:
                  </span>{" "}
                  {order.paymentType}
                </p>
                <p>
                  <span className="font-semibold">Seat:</span>{" "}
                  {seatNo?.map((seat: any) => seat?.seat).join(", ") || "N/A"}
                </p>
                <p>
                  <span className="font-semibold"> Seat Fare(Tk): </span>{" "}
                  {order?.paymentAmount / seatNo?.length || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Total Fare(Tk):</span>{" "}
                  {order?.paymentAmount || order?.amount || "N/A"}
                </p>
              </div>
              {/* Route Box */}
              <div className="flex items-center">
                <div className="text-sky-800 text-center font-semibold px-3 py-2 rounded-md shadow-inner">
                  <p>{order.boardingPoint}</p>
                  <p className="text-center rotate-90">➝</p>
                  <span>{order.droppingPoint}</span>
                </div>
              </div>
              {/* QR Code + Bus icon placeholder */}
              <div className="pr-3 mt-3 sm:mt-0 space-y-2 flex justify-between md:flex-col md:justify-evenly items-center">
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
          <div className="w-1/3 bg-[#f4a3ff] rounded-tl-2xl rounded-bl-2xl border-b border-r overflow-hidden">
            {/* Blue Header */}
            <div className="bg-gradient-to-r from-sky-400 to-sky-600 text-white px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-bold">Iconic Express</h2>
            </div>

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
                <span className="font-semibold">Departure Time:</span>{" "}
                {result?.boardingSchedule || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Reporting Time:</span>{" "}
                {reportingTime || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Boarding Point:</span>{" "}
                {order?.boardingPoint || boardingPoint || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Dropping Point:</span>{" "}
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
                    {translate("বাস", "Status")}:
                  </span>{" "}
                  {status}
                </p>

              <p>
                <span className="font-semibold">
                  {translate("পেমেন্ট টাইপ", "Payment Type")}:
                </span>{" "}
                {order.paymentType}
              </p>
              <p>
                <span className="font-semibold">Seat:</span>{" "}
                {seatNo?.map((seat: any) => seat?.seat).join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-semibold"> Seat Fare(Tk): </span>{" "}
                {order?.paymentAmount / seatNo?.length || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Total Fare(Tk):</span>{" "}
                {order?.paymentAmount || order?.amount || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OrderPrintView.displayName = "OrderPrintView";

export default OrderPrintView;
