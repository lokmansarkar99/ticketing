import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

interface ITripWiseReportPDFProps {
  reportData: any;
  logo: any;

  selectedTripNo: any;
}

// Define column widths for each table
const mainTableColumnCount = 7;
const mainColWidth = `${(100 / mainTableColumnCount).toFixed(2)}%`; // ~14.29%

const incomeTableColumnCount = 6;
const incomeColWidth = `${(100 / incomeTableColumnCount).toFixed(2)}%`; // ~16.67%

const expenseTableColumnCount = 3;
const expenseColWidth = `${(100 / expenseTableColumnCount).toFixed(2)}%`; // ~33.33%

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 20,
    fontSize: 10,
    color: "#000000",
    fontFamily: "Helvetica",
  },
  headerContainer: {
    marginBottom: 20,
    textAlign: "center",
  },
  logo: {
    width: 80,
    marginBottom: 5,
    alignSelf: "center",
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 1.2,
  },
  subTitle: {
    fontSize: 12,
    lineHeight: 1.2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#cccccc",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  headerCell: {
    borderRightWidth: 1,
    borderRightColor: "#cccccc",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    padding: 4,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 9,
    lineHeight: 1.2,
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: "#cccccc",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    padding: 4,
    textAlign: "center",
    fontSize: 9,
    lineHeight: 1.2,
  },
  noBorderRight: {
    borderRightWidth: 0,
  },
  boldBg: {
    backgroundColor: "#f7f7f7",
    fontWeight: "bold",
  },
  sideBySideContainer: {
    flexDirection: "row",
    gap: 2, // Adjust gap if needed
    marginBottom: 30,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  incomeTableContainer: {
    width: "68%", // Increased width for income table
  },
  expenseTableContainer: {
    width: "30%", // Reduced width for expense table
  },
  summaryTable: {
    alignSelf: "flex-end",
    width: "40%",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  summaryRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  summaryLabel: {
    fontWeight: "bold",
    padding: 4,
    fontSize: 9,
    lineHeight: 1.2,
    flexGrow: 1,
  },
  summaryValue: {
    padding: 4,
    textAlign: "right",
    width: 60,
    borderLeftWidth: 1,
    borderLeftColor: "#cccccc",
    fontSize: 9,
    lineHeight: 1.2,
  },
});

// Helper to create style with fixed width for each cell
const cellStyleWithWidth = (width: string) => ({
  width,
});

function getCellStyles(baseStyles: any[], width: string, isLast?: boolean) {
  const finalStyles = [...baseStyles, cellStyleWithWidth(width)];
  if (isLast) finalStyles.push(styles.noBorderRight);
  return finalStyles;
}

const TripWiseReportPDF = React.forwardRef<
  HTMLDivElement,
  ITripWiseReportPDFProps
>(({ reportData, logo, selectedTripNo }, ref) => {
  const {
    upWayCoachInfo = [],
    downWayCoachInfo = [],
    collectionReport = [],
    expenseReport = [],
    totalIncome = 0,
    totalExpense = 0,
    totalAmount = 0,
    gp = 0,
  } = reportData?.data || {};
  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const mainHeaders = [
    "Coach",
    "Coach No",
    "Route Name",
    "Registration No",
    "Supervisor Name",
    "Driver Name",
    "Helper Name",
  ];
  const incomeHeaders = [
    "Counter Name",
    "Counter Master",
    "Qty",
    "Fare",
    "Discount",
    "Total Price",
  ];
  const expenseHeaders = ["Expense Name", "Amount", "Total Amount"];

  return (
    //@ts-ignore
    <Document ref={ref}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          {logo?.companyLogoBangla && (
            <Image style={styles.logo} src={logo?.companyLogo} />
          )}
          <Text wrap={false} style={styles.title}>
            {reportData?.appName || ""}
          </Text>
          <Text wrap={false} style={styles.subTitle}>
            Trip No Wise Report
          </Text>
        </View>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <Text wrap={false}>Trip No: {selectedTripNo}</Text>
          <Text wrap={false}>Date: {today}</Text>
        </View>

        {/* Main Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {mainHeaders.map((h, i) => (
              <Text
                key={i}
                wrap={false}
                style={getCellStyles(
                  [styles.headerCell],
                  mainColWidth,
                  i === mainHeaders.length - 1
                )}
              >
                {h}
              </Text>
            ))}
          </View>
          {[upWayCoachInfo, downWayCoachInfo].map((info, i) => (
            <View style={styles.tableRow} key={i}>
              <Text
                wrap={false}
                style={getCellStyles([styles.cell], mainColWidth)}
              >
                {i === 0 ? "Up Way Coach" : "Down Way Coach"}
              </Text>
              <Text
                wrap={false}
                style={getCellStyles([styles.cell], mainColWidth)}
              >
                {info?.coachNo || "N/A"}
              </Text>
              <Text
                wrap={false}
                style={getCellStyles([styles.cell], mainColWidth)}
              >
                {info?.route?.routeName || "N/A"}
              </Text>
              <Text
                wrap={false}
                style={getCellStyles([styles.cell], mainColWidth)}
              >
                {info?.registrationNo || "N/A"}
              </Text>
              <Text
                wrap={false}
                style={getCellStyles([styles.cell], mainColWidth)}
              >
                {info?.supervisor?.userName || "N/A"}
              </Text>
              <Text
                wrap={false}
                style={getCellStyles([styles.cell], mainColWidth)}
              >
                {info?.driver?.name || "N/A"}
              </Text>
              <Text
                wrap={false}
                style={getCellStyles([styles.cell], mainColWidth, true)}
              >
                {info?.helper?.name || "N/A"}
              </Text>
            </View>
          ))}
        </View>

        {/* Side by side tables */}
        <View style={styles.sideBySideContainer}>
          {/* Income Table */}
          <View style={[styles.table, styles.incomeTableContainer]}>
            {/* Title Row for Income */}
            <View style={styles.tableRow}>
              <Text
                wrap={false}
                style={[
                  styles.cell,
                  styles.boldBg,
                  { borderBottomColor: "#cccccc", borderBottomWidth: 1 },
                  cellStyleWithWidth("100%"),
                  styles.noBorderRight,
                ]}
              >
                Receive / Income
              </Text>
            </View>
            {/* Income Header Row */}
            <View style={styles.tableRow}>
              {incomeHeaders.map((h, i) => (
                <Text
                  wrap={false}
                  key={i}
                  style={getCellStyles(
                    [styles.headerCell],
                    incomeColWidth,
                    i === incomeHeaders.length - 1
                  )}
                >
                  {h}
                </Text>
              ))}
            </View>
            {collectionReport.map((row: any, index: any) => (
              <View style={styles.tableRow} key={index}>
                <Text
                  wrap={false}
                  style={getCellStyles([styles.cell], incomeColWidth)}
                >
                  {row.counterName || "N/A"}
                </Text>
                <Text
                  wrap={false}
                  style={getCellStyles([styles.cell], incomeColWidth)}
                >
                  {row.counterMasterName || "N/A"}
                </Text>
                <Text
                  wrap={false}
                  style={getCellStyles([styles.cell], incomeColWidth)}
                >
                  {row.noOfPassenger || 0}
                </Text>
                <Text
                  wrap={false}
                  style={getCellStyles([styles.cell], incomeColWidth)}
                >
                  {row.fare || 0}
                </Text>
                <Text
                  wrap={false}
                  style={getCellStyles([styles.cell], incomeColWidth)}
                >
                  00.00
                </Text>
                <Text
                  wrap={false}
                  style={getCellStyles([styles.cell], incomeColWidth, true)}
                >
                  {row.amount || 0}
                </Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text
                wrap={false}
                style={[
                  styles.cell,
                  { fontWeight: "bold", backgroundColor: "#f7f7f7" },
                  cellStyleWithWidth(`${(100 / 6) * 5}%`), // Span 5 columns
                ]}
              >
                Total Income
              </Text>
              <Text
                wrap={false}
                style={[
                  styles.cell,
                  styles.noBorderRight,
                  { fontWeight: "bold", backgroundColor: "#f7f7f7" },
                  cellStyleWithWidth(incomeColWidth),
                ]}
              >
                {totalIncome}
              </Text>
            </View>
          </View>

          {/* Expense Table */}
          <View style={[styles.table, styles.expenseTableContainer]}>
            {/* First Header Row (Expense 2 col + Total Amount 1 col) */}
            <View style={styles.tableRow}>
              <Text
                wrap={false}
                style={[
                  styles.cell,
                  styles.boldBg,
                  cellStyleWithWidth(
                    `${Number(expenseColWidth.replace("%", "")) * 2}%`
                  ),
                ]}
              >
                Expense
              </Text>
              <Text
                wrap={false}
                style={[
                  styles.cell,
                  styles.boldBg,
                  styles.noBorderRight,
                  cellStyleWithWidth(expenseColWidth),
                ]}
              >
                Total Amount
              </Text>
            </View>
            {/* Second Header Row (3 columns) */}
            <View style={styles.tableRow}>
              {expenseHeaders.map((h, i) => (
                <Text
                  wrap={false}
                  key={i}
                  style={getCellStyles(
                    [styles.headerCell],
                    expenseColWidth,
                    i === expenseHeaders.length - 1
                  )}
                >
                  {h}
                </Text>
              ))}
            </View>
            {expenseReport.map((row: any, index: any) => (
              <View style={styles.tableRow} key={index}>
                <Text
                  wrap={false}
                  style={getCellStyles([styles.cell], expenseColWidth)}
                >
                  {row.expenseCategory || "N/A"}
                </Text>
                <Text
                  wrap={false}
                  style={getCellStyles([styles.cell], expenseColWidth)}
                >
                  {row.amount || 0}
                </Text>
                <Text
                  wrap={false}
                  style={getCellStyles([styles.cell], expenseColWidth, true)}
                >
                  {row.amount || 0}
                </Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text
                wrap={false}
                style={[
                  styles.cell,
                  { fontWeight: "bold", backgroundColor: "#f7f7f7" },
                  cellStyleWithWidth(expenseColWidth),
                ]}
              >
                Total Expense
              </Text>
              <Text
                wrap={false}
                style={[
                  styles.cell,
                  { fontWeight: "bold", backgroundColor: "#f7f7f7" },
                  cellStyleWithWidth(expenseColWidth),
                ]}
              >
                {totalExpense}
              </Text>
              <Text
                wrap={false}
                style={[
                  styles.cell,
                  styles.noBorderRight,
                  { fontWeight: "bold", backgroundColor: "#f7f7f7" },
                  cellStyleWithWidth(expenseColWidth),
                ]}
              >
                {totalAmount}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary Table */}
        <View style={styles.summaryTable}>
          {[
            { label: "Balance", value: totalIncome - totalExpense },
            { label: "GP", value: gp },
            { label: "Gross Income", value: totalIncome - totalExpense - gp },
          ].map((row, index) => (
            <View style={styles.summaryRow} key={index}>
              <Text wrap={false} style={styles.summaryLabel}>
                {row.label}
              </Text>
              <Text wrap={false} style={styles.summaryValue}>
                {row.value.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
});

export default TripWiseReportPDF;
