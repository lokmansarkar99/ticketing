import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import * as QRCode from "qrcode";
import React from "react";

// Styles - Matching OrderPrintView
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f3f4f6",
    padding: 0,
    fontSize: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
    borderRadius: 16,
  },
  container: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 1050,
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
    padding: 16,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // prevent vertical stretch of children
    flex: 1,
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
    justifyContent: "space-between",
    marginTop: 36,
  },
  busImage: {
    width: 85,
  },
  qrCode: {
    width: 84,
    height: 86,
    backgroundColor: "white",
    padding: 1,
    borderRadius: 4,
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

const PdfTicketFromFind = ({
  ticketData,
  logo,
  qrData,
}: {
  ticketData: any;
  logo: any;
  qrData: any;
}) => {
  const boardingPoint = ticketData?.boardingPoint;
  const viaRoute = ticketData?.coachConfig?.coach?.CoachViaRoute || [];
  const result = {
    boardingSchedule: viaRoute?.find(
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

  const [qrCodeBase64, setQrCodeBase64] = React.useState<string | null>(null);

  React.useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrCodeUrl = await QRCode.toDataURL(
          ticketData?.orderSeat
            ?.map((seat: { seat: any }) => seat?.seat)
            .join(", ")
        );
        setQrCodeBase64(qrCodeUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQRCode();
  }, [qrData, ticketData?.orderSeat]);

  if (!qrCodeBase64) return null;

  const seatNo = ticketData?.orderSeat?.filter(
    (s: any) => s.date === ticketData?.date
  );

  // const status = (ticketData?.orderSeat || []).find(
  //   (s: any) => s.status
  // )?.status;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


  // const formatTime = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

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
                Ticket No: {ticketData?.ticketNo}
              </Text>
            </View>

            {/* Body */}
            <View style={styles.leftBody}>
              <View style={styles.infoSection}>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Journey Date:</Text>{" "}
                  {ticketData?.date || "N/A"}
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
                  {ticketData?.customerName}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Phone:</Text>{" "}
                  {ticketData?.phone}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Email:</Text>{" "}
                  {ticketData?.email || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Coach No:</Text>{" "}
                  {ticketData?.coachConfig?.coachNo?.replace("COX", "\nCOX") ||
                    "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Boarding Point:</Text>{" "}
                  {ticketData?.boardingPoint || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Dropping Point:</Text>{" "}
                  {ticketData?.droppingPoint || "N/A"}
                </Text>
                {/* <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Bus Type:</Text>{" "}
                  {ticketData?.coachConfig?.coachType || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Class:</Text>{" "}
                  {ticketData?.coachConfig?.coachClass || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Class:</Text> {status || "N/A"}
                </Text> */}
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Seat:</Text>{" "}
                  {ticketData.orderSeat
                    .map((seat: any) => seat.seat)
                    .join(", ")}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Seat Fare (Tk):</Text>{" "}
                  {seatNo?.[0]?.unitPrice || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Total Fare (Tk):</Text>{" "}
                  {ticketData?.paymentAmount || "N/A"}
                </Text>
              </View>

              {/* Route Box */}
              {/* <View style={styles.routeBox}>
                <Text>{ticketData?.boardingPoint}</Text>
                <Text style={{ transform: "rotate(90deg)" }}>➝</Text>
                <Text>{ticketData?.droppingPoint}</Text>
              </View> */}

              {/* QR Code + Bus icon */}
              <View style={styles.qrSection}>
                {logo?.companyLogo && (
                  <Image src={logo.companyLogo} style={styles.busImage} />
                )}
                {qrCodeBase64 && (
                  <Image src={qrCodeBase64} style={styles.qrCode} />
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
                {ticketData?.date || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Issue Date:</Text>{" "}
                {ticketData?.createdAt
                  ? formatDate(ticketData.createdAt)
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
                {ticketData?.customerName}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Phone:</Text> {ticketData?.phone}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Email:</Text>{" "}
                {ticketData?.email || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Coach No:</Text>{" "}
                {ticketData?.coachConfig?.coachNo || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Boarding Point:</Text>{" "}
                {ticketData?.boardingPoint || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Dropping Point:</Text>{" "}
                {ticketData?.droppingPoint || "N/A"}
              </Text>
              {/* <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Bus Type:</Text>{" "}
                {ticketData?.coachConfig?.coachType || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Class:</Text>{" "}
                {ticketData?.coachConfig?.coachClass || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Class:</Text> {status || "N/A"}
              </Text> */}
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
                {ticketData?.paymentAmount || "N/A"}
              </Text>
              <Text
                style={[
                  styles.rightBodyText,
                  { marginTop: 8, fontWeight: "bold" },
                ]}
              >
                Ticket No: {ticketData?.ticketNo}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfTicketFromFind;
