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
    padding: 24,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,
  },
  infoSection: {
    gap: 6,
    paddingBottom: 16,
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
  },
  qrSection: {
    flex: 1,
    // paddingRight: 12,
    gap: 4,
    alignItems: "flex-end",
    justifyContent: "space-around",
    marginTop: 36,
  },
  busImage: {
    width: 86,
    // height: 86,
    // borderWidth: 1,
    // borderColor: "#d1d5db",
    // borderRadius: 4,
  },
  qrCode: {
    width: 84,
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

const PdfPrintTickitOnline = ({ logo, qrData }: { logo: any; qrData: any }) => {
  // Add null checks for all nested properties

  const order = qrData?.order || {};
  const coachConfig = order?.coachConfig || {};
  const coach = coachConfig?.coach || {};
  const viaRoute = coach?.CoachViaRoute || [];

  const boardingPoint = order?.boardingPoint || "";
  const boardingSchedule = viaRoute.find(
    (route: any) => route?.station?.name === boardingPoint
  )?.schedule;

  // Calculate reporting time (15 minutes before departure)
  const calculateReportingTime = (schedule: string | undefined): string => {
    if (!schedule || typeof schedule !== "string") {
      return "N/A";
    }

    try {
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
    } catch (error) {
      console.error("Error calculating reporting time:", error);
      return "N/A";
    }
  };

  const reportingTime = calculateReportingTime(boardingSchedule);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const seatNo =
    order?.orderSeat?.filter((s: any) => s?.date === qrData?.date) || [];

  const [qrCodeBase64, setQrCodeBase64] = React.useState<string | null>(null);

  React.useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Generate QR code as Base64
        const qrCodeUrl = await QRCode.toDataURL(
          JSON.stringify(seatNo.map((seat: any) => seat?.seat).join(", ") || {})
        );
        setQrCodeBase64(qrCodeUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
        setQrCodeBase64(null);
      }
    };

    generateQRCode();
  }, [qrData, seatNo]);

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


  // If no data, show a message
  if (!qrData) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>No ticket data available</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size={{ width: 595.28, height: 370 }} style={styles.page}>
        <View style={styles.container}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerText}>Iconic Express</Text>
              <Text style={styles.headerTextSmall}>
                Ticket No: {order?.ticketNo || "N/A"}
              </Text>
            </View>

            {/* Body */}
            <View style={styles.leftBody}>
              <View style={styles.infoSection}>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Journey Date:</Text>{" "}
                  {formatDate(order?.date)}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Departure Time:</Text>{" "}
                  {boardingSchedule || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Reporting Time:</Text>{" "}
                  {reportingTime || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Name:</Text>{" "}
                  {order?.customerName || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Phone:</Text>{" "}
                  {order?.phone || "N/A"}
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
                  <Text style={styles.boldText}>Seat:</Text>{" "}
                  {order.orderSeat.map((seat: any) => seat.seat).join(", ")}
                </Text>
                {/* <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Coach No:</Text> {coach?.coachNo || "N/A"}
                </Text> */}
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Coach No:</Text>{" "}
                  {coach?.coachNo?.replace("COX", "\nCOX") || "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Seat Fare (Tk):</Text>{" "}
                  {seatNo.length > 0
                    ? order?.paymentAmount / seatNo.length
                    : "N/A"}
                </Text>
                <Text style={styles.rightBodyText}>
                  <Text style={styles.boldText}>Total Fare (Tk):</Text>{" "}
                  {order?.paymentAmount || "N/A"}
                </Text>
              </View>

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
                {formatDate(order?.date)}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Departure Time:</Text>{" "}
                {boardingSchedule || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Reporting Time:</Text>{" "}
                {reportingTime || "N/A"}
              </Text>
              <Text style={[styles.rightBodyText, { marginTop: 8 }]}>
                <Text style={styles.boldText}>Issue Date:</Text>{" "}
                {order?.createdAt ? formatDate(order.createdAt) : "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Name:</Text>{" "}
                {order?.customerName || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Phone:</Text>{" "}
                {order?.phone || "N/A"}
              </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Coach No:</Text>{" "}
                {coach?.coachNo || "N/A"}
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
                  <Text style={styles.boldText}>Seat:</Text>{" "}
                  {order.orderSeat.map((seat: any) => seat.seat).join(", ")}
                </Text>
              <Text style={styles.rightBodyText}>
                <Text style={styles.boldText}>Seat No:</Text>{" "}
                {seatNo.map((seat: any) => seat?.seat).join(", ") || "N/A"}
              </Text>
              <Text
                style={[
                  styles.rightBodyText,
                  { marginTop: 8, fontWeight: "bold" },
                ]}
              >
                Ticket No: {order?.ticketNo || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfPrintTickitOnline;
