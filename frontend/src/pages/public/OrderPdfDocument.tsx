import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Styles - Matching OrderPrintView
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f3f4f6",
    padding: 0,
    fontSize: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
  container: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 850,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f4a3ff",
  },
  leftSection: {
    width: "66.66%",
    borderRightWidth: 2,
    borderRightColor: "#d1d5db",
    borderRightStyle: "dashed",
    borderBottomWidth: 2,
    borderBottomColor: "#d1d5db",
    borderBottomStyle: "dashed",
    borderLeftWidth: 2,
    borderLeftColor: "#d1d5db",
    borderLeftStyle: "dashed",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 16,
  },
  rightSection: {
    width: "33.33%",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#0ea5e9",
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTextSmall: {
    color: "white",
    fontSize: 12,
  },
  leftBody: {
    padding: 24,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoSection: {
    gap: 6,
  },
  bodyText: {
    color: "#374151",
    fontSize: 12,
  },
  boldText: {
    fontWeight: "bold",
  },
  routeBox: {
    color: "#0c4a6e",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
  },
  qrSection: {
  flex: 1,
    // paddingRight: 12,
    gap: 4,
    alignItems: "flex-end",
    justifyContent: "space-evenly",
  },
  busImage: {
    width: 86,
    height: 76,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
  },
  qrCode: {
    width: 86,
    height: 86,
    backgroundColor: "white",
    padding: 4,
    borderRadius: 4,
    marginLeft: 1,
  },
  rightBody: {
    padding: 16,
    gap: 4,
    fontSize: 10,
  },
  rightBodyText: {
    color: "#374151",
    fontSize: 10,
  },
});

// Types
interface IOrderSeat {
  id: number;
  seat: string;
  class: string;
  unitPrice: number;
  date: string;
  fromStationId: number;
  status: string;
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

interface OrderPdfDocumentProps {
  order: IOrder;
  qrCodeDataUrl?: string;
  busImgUrl?: string;
}

const OrderPdfDocument: React.FC<OrderPdfDocumentProps> = ({
  order,
  qrCodeDataUrl,
  busImgUrl,
}) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


  return (
    <Document>
      <Page size={{ width: 595.28, height: 365 }} style={styles.page}>
        <View style={styles.container}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerText}>Iconic Express</Text>
              <Text style={styles.headerTextSmall}>
                Ticket No:{order.ticketNo}
              </Text>
            </View>

            {/* Body */}
            <View style={styles.leftBody}>
              <View style={styles.infoSection}>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Journey Date:</Text>{" "}
                  {order?.date || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Departure Time:</Text>{" "}
                  {result?.boardingSchedule || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Reporting Time:</Text>{" "}
                  {reportingTime || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Name:</Text>{" "}
                  {order?.customerName}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Phone:</Text> {order?.phone}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Email:</Text>{" "}
                  {order?.email || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Coach No:</Text>{" "}
                  {order?.coachConfig?.coach?.coachNo?.replace(
                    "COX",
                    "\nCOX"
                  ) || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Boarding Point:</Text>{" "}
                  {order?.boardingPoint || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Dropping Point:</Text>{" "}
                  {order?.droppingPoint || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Bus Type:</Text>{" "}
                  {order?.coachConfig?.coachType || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Class:</Text>{" "}
                  {order?.coachConfig?.coachClass || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Status:</Text>{" "}
                  {status || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Seat:</Text>{" "}
                  {order.orderSeat.map((seat: any) => seat.seat).join(", ")}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Seat Fare (Tk):</Text>{" "}
                  {seatNo?.[0]?.unitPrice || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Total Fare (Tk):</Text>{" "}
                  {order?.paymentAmount || "N/A"}
                </Text>
              </View>

              {/* Route Box */}
              <View style={styles.routeBox}>
                <Text>{order.boardingPoint}</Text>
                <Text style={{ transform: "rotate(90deg)" }}>➝</Text>
                <Text>{order.droppingPoint}</Text>
              </View>

              {/* QR Code + Bus icon */}
              <View style={styles.qrSection}>
                {busImgUrl && <Image src={busImgUrl} style={styles.busImage} />}
                {qrCodeDataUrl && (
                  <Image src={qrCodeDataUrl} style={styles.qrCode} />
                )}
              </View>
            </View>
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerText}>Iconic Express</Text>
            </View>

            {/* Body */}
            <View style={styles.rightBody}>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Journey Date:</Text>{" "}
                {order?.date || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Issue Date:</Text>{" "}
                {order?.createdAt
                  ? formatDate(order.createdAt)
                  : "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Departure Time:</Text>{" "}
                {result?.boardingSchedule || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Reporting Time:</Text>{" "}
                {reportingTime || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Name:</Text>{" "}
                {order?.customerName}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Phone:</Text> {order?.phone}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Email:</Text>{" "}
                {order?.email || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Coach No:</Text>{" "}
                {order?.coachConfig?.coach?.coachNo || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Boarding Point:</Text>{" "}
                {order?.boardingPoint || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Dropping Point:</Text>{" "}
                {order?.droppingPoint || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Bus Type:</Text>{" "}
                {order?.coachConfig?.coachType || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Class:</Text>{" "}
                {order?.coachConfig?.coachClass || "N/A"}
              </Text>
               <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Status:</Text>{" "}
                  {status || "N/A"}
                </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Seat No:</Text>{" "}
                {seatNo?.map((seat: any) => seat?.seat).join(", ") || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Seat Fare (Tk):</Text>{" "}
                {seatNo?.[0]?.unitPrice || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Total Fare (Tk):</Text>{" "}
                {order?.paymentAmount || "N/A"}
              </Text>
              <Text
                style={[
                  styles.rightBodyText,
                  { marginTop: 8, fontWeight: "bold" },
                ]}
              >
                Ticket No: {order?.ticketNo}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default OrderPdfDocument;
