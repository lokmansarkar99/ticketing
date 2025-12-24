import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

// Define the styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    marginBottom: 10,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    padding: 4,
    textAlign: "center",
    fontSize: 10,
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#f1f1f1",
    fontSize: 10,
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 12,
  },
});

const PdfCounterReport = ({ filteredCounterData, reportsData, title }: any) => {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Title */}
        <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 10 }}>
          {title}
        </Text>

        {/* Table for Counter-wise Report */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.header]}>Counter Name</Text>
            <Text style={[styles.tableCell, styles.header]}>Coach No</Text>
            <Text style={[styles.tableCell, styles.header]}>Total Seat</Text>
            <Text style={[styles.tableCell, styles.header]}>Total Taka</Text>
            <Text style={[styles.tableCell, styles.header]}>
              Commission
            </Text>
            <Text style={[styles.tableCell, styles.header]}>
              Payable Amount
            </Text>
          </View>

          {/* Data Row */}
          {filteredCounterData && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {filteredCounterData.counterName || "N/A"}
              </Text>
              <Text style={styles.tableCell}>
                {reportsData?.data?.coachInfo?.coachNo || "N/A"}
              </Text>
              <Text style={styles.tableCell}>
                {filteredCounterData.totalSeat || 0}
              </Text>
              <Text style={styles.tableCell}>
                {filteredCounterData.totalAmount || 0}
              </Text>
              <Text style={styles.tableCell}>
                {filteredCounterData.commission || 0}
              </Text>
              <Text style={styles.tableCell}>
                {filteredCounterData.totalAmount -
                  filteredCounterData.commission || 0}
              </Text>
            </View>
          )}
        </View>

        {/* Additional Table for Passenger Details */}
        <Text style={{ fontSize: 14, marginTop: 20, marginBottom: 10 }}>
          Passenger Details
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.header]}>
              Passenger Name
            </Text>
            <Text style={[styles.tableCell, styles.header]}>Phone</Text>
            <Text style={[styles.tableCell, styles.header]}>Seats Booked</Text>
            <Text style={[styles.tableCell, styles.header]}>Sold By</Text>
          </View>

          {/* Data Rows */}
          {filteredCounterData?.orderDetails.map(
            (order: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {order.customerName || "N/A"}
                </Text>
                <Text style={styles.tableCell}>{order.phone || "N/A"}</Text>
                <Text style={styles.tableCell}>
                  {order.orderSeat.map((seat: any) => seat.seat).join(", ")}
                </Text>
                <Text style={styles.tableCell}>{order.user?.userName}</Text>
              </View>
            )
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {`Report generated on ${new Date().toLocaleDateString()}`}
        </Text>
      </Page>
    </Document>
  );
};

export default PdfCounterReport;
