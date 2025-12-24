import { format } from "date-fns";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";

Font.registerHyphenationCallback((word: string) => {
  const parts = word.split(/([-\s_])/);
  return parts.flatMap((p, i) =>
    i % 2 === 1 ? [p] : (p.match(/.{1,10}/g) ?? [p])
  );
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 10,
    paddingBottom: 40,
  },
  headerDate: {
    fontSize: 8,
    position: "absolute",
    top: 10,
    left: 10,
  },
  footer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 8,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  heading: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "semibold",
  },
  subHeading: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: "center",
  },
  title: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    flexDirection: "column",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 7,
    textAlign: "center",
    paddingVertical: 2,
    paddingHorizontal: 2,
    wordBreak: "break-all",
  },
  logo: {
    width: 50,
    height: 25,
    marginBottom: 10,
    alignSelf: "center",
  },
});

const computeColumnWidths = (rows: any[]) => {
  const columns = [
    { key: "counterName", label: "Counter Name", maxWidth: 120 },
    { key: "orderBy", label: "Ordered By", maxWidth: 100 },
    { key: "cancelBy", label: "Cancel By", maxWidth: 100 },
    { key: "soldSeat", label: "Sold Seat", maxWidth: 30 },
    { key: "bookSeat", label: "Book Seat", maxWidth: 30 },
    { key: "returnSeat", label: "Return Seat", maxWidth: 30 },
    { key: "migrateSeat.date", label: "Migration Date", maxWidth: 80 },
    { key: "migrateSeat.seat", label: "Migrated Seat", maxWidth: 40 },
    { key: "migrateSeat.coach", label: "Migrated Coach", maxWidth: 40 },
    { key: "migrateSeat.jurneyDate", label: "Migrated Journey Date", maxWidth: 60 },
    { key: "passengerName", label: "Passenger Name", maxWidth: 100 },
    { key: "passengerPhone", label: "Passenger Phone", maxWidth: 80 },
    { key: "fare", label: "Fare", maxWidth: 40 },
    { key: "discount", label: "Discount", maxWidth: 40 },
    { key: "createdDate", label: "Time", maxWidth: 80 },
  ];

  const widths: Record<string, number> = {};

  columns.forEach(({ key, label, maxWidth }) => {
    const maxLen = Math.max(
      label.length,
      ...rows.map((row) => {
        const val = key.includes(".")
          ? key.split(".").reduce((acc, k) => acc?.[k], row)
          : row[key];
        return val ? val.toString().length : 0;
      })
    );

    let calculatedWidth = maxLen * 5 + 8; // tighter fit
    widths[key] = Math.min(calculatedWidth, maxWidth); // enforce maxWidth
  });

  return { widths, columns };
};


const PdfSeatStatusReport = ({ result, singleCms, userName }: any) => {
  const { appName } = appConfiguration;
  const currentDate = format(new Date(), "M/d/yy, h:mm a");

  const { widths, columns } = computeColumnWidths(result || []);

  // dynamic page width = sum of all column widths
  const totalWidth = Object.values(widths).reduce((a, b) => a + b, 0);
  const pageWidth = Math.max(595, totalWidth); // at least A4

  // Totals
  const totalSold = result?.reduce((acc: number, curr: any) => acc + (curr.soldSeat ? 1 : 0), 0);
  const totalBooked = result?.reduce((acc: number, curr: any) => acc + (curr.bookSeat ? 1 : 0), 0);
  const totalMigrated = result?.reduce((acc: number, curr: any) => acc + (curr.migrateSeat?.seat ? 1 : 0), 0);
  const totalFare = result?.reduce((acc: number, curr: any) => acc + (curr.fare || 0), 0);
  const totalDiscount = result?.reduce((acc: number, curr: any) => acc + (curr.discount || 0), 0);

  return (
    <Document>
      <Page size={{ width: pageWidth, height: 842 }} style={styles.page}>
        <Text style={styles.headerDate}>Date: {currentDate}</Text>

        <View style={styles.section}>
          <Image source={singleCms?.data?.companyLogo} style={styles.logo} />
          <Text style={styles.heading}>{appName}</Text>
          <Text style={styles.subHeading}>Current Booking and Sales Status</Text>
          <Text style={{ ...styles.title, textAlign: "right" }}>Download by: {userName}</Text>

          <View style={styles.table}>
            {/* Headers */}
            <View style={styles.tableRow}>
              {columns.map((col) => (
                <Text key={col.key} style={[styles.tableHeader, { width: widths[col.key] }]}>
                  {col.label}
                </Text>
              ))}
            </View>

            {/* Data rows */}
            {result?.map((status: any, index: number) => (
              <View style={styles.tableRow} key={index} wrap={false}>
                {columns.map((col) => {
                  let value: any;
                  if (col.key.includes(".")) {
                    value = col.key.split(".").reduce((acc, k) => acc?.[k], status);
                  } else {
                    value = status[col.key];
                  }

                  // Special formatting
                  if (col.key === "createdDate" && value) {
                    value = format(new Date(value), "M/d/yy, h:mm a");
                  }
                  if (col.key === "migrateSeat.date" && value) {
                    value = format(new Date(value), "M/d/yy, h:mm a");
                  }

                  return (
                    <Text key={col.key} style={[styles.tableCol, { width: widths[col.key] }]}>
                      {
                        value || ""
                      }
                    </Text>
                  );
                })}
              </View>
            ))}

            {/* Summary row */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, { width: widths.counterName + widths.orderBy + widths.cancelBy, fontWeight: "bold" }]}>
                Total
              </Text>
              <Text style={[styles.tableCol, { width: widths.soldSeat, fontWeight: "bold" }]}>{totalSold}</Text>
              <Text style={[styles.tableCol, { width: widths.bookSeat, fontWeight: "bold" }]}>{totalBooked}</Text>
              <Text style={[styles.tableCol, { width: widths.returnSeat }]}></Text>
              <Text style={[styles.tableCol, { width: widths["migrateSeat.date"] + widths["migrateSeat.seat"] + widths["migrateSeat.coach"] + widths["migrateSeat.jurneyDate"], fontWeight: "bold" }]}>
                Migrated: {totalMigrated}
              </Text>
              <Text style={[styles.tableCol, { width: widths.passengerName + widths.passengerPhone }]}></Text>
              <Text style={[styles.tableCol, { width: widths.fare, fontWeight: "bold" }]}>{totalFare}</Text>
              <Text style={[styles.tableCol, { width: widths.discount, fontWeight: "bold" }]}>{totalDiscount}</Text>
              <Text style={[styles.tableCol, { width: widths.createdDate, fontWeight: "bold" }]}>Net Amount:{totalFare - totalDiscount}</Text>
            </View>
          </View>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};

export default PdfSeatStatusReport;
