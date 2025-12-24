import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleSection: {
    textAlign: "center",
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 25,
    alignSelf: "center",
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  subHeading: {
    fontSize: 10,
    marginVertical: 2,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    flex: 1,
    fontSize: 8,
    fontWeight: "bold",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    padding: 2,
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    flex: 1,
    fontSize: 7,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    padding: 2,
  },
  footerTable: {
    marginTop: 20,
    alignSelf: "flex-end",
    width: "60%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  footerRow: {
    flexDirection: "row",
    fontSize: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "right",
    padding: 2,
  },
  footerLabel: {
    flex: 2,
    fontWeight: "bold",
    textAlign: "left",
    paddingLeft: 5,
  },
  footerValue: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
    flexDirection: "column",
    gap: 2,
  },
});

const PdfProfitAndLoss = ({
  profitData,
  logo,
  dateRange,
  selectedRegistrationNo,
}: any) => {
  const { appName } = appConfiguration;

  return (
    <Document>
      <Page size="LEGAL" orientation="landscape" style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Image source={logo?.companyLogo} style={styles.logo} />
          <Text style={styles.heading}>{appName}</Text>
          <Text style={styles.subHeading}>Bus-wise Report</Text>
        </View>

        {/* Registration No and Date */}
        <View style={styles.header}>
          <Text style={styles.subHeading}>
            Bus No: {selectedRegistrationNo}
          </Text>
          <Text style={styles.subHeading}>Date: {dateRange}</Text>
        </View>

        {/* Table Section */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            {[
              "Date",
              "Trip No",
              "Bus No",
              "Up Date",
              "Down Date",
              "Passenger Up",
              "Passenger Down",
              "Passenger Total",
              "Up Income",
              "Down Income",
              "Up-Down Total Amount",
              "Road Expenses",
              "Total Balance",
              "Iconic Express GP",
              "Trip Wise Profit",
            ].map((header, index) => (
              <Text key={index} style={styles.tableHeader}>
                {header}
              </Text>
            ))}
          </View>

          {/* Table Rows */}
          {/* Table Rows */}
          {profitData?.length > 0 ? (
            profitData.map((row: any, index: any) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>
                  {row.date ? format(new Date(row.date), "dd-MM-yyyy") : "N/A"}
                </Text>
                <Text style={styles.tableCell}>{row.id ?? "N/A"}</Text>
                <Text style={styles.tableCell}>
                  {row.registrationNo ?? "N/A"}
                </Text>
                <Text style={styles.tableCell}>
                  {format(new Date(row.upDate), "dd-MM-yyyy") ?? "N/A"}
                </Text>
                <Text style={styles.tableCell}>
                  {format(new Date(row.downDate), "dd-MM-yyyy") ?? "N/A"}
                </Text>
                <Text style={styles.tableCell}>
                  {row.passengerUpWay ?? "0"}
                </Text>
                <Text style={styles.tableCell}>
                  {row.passengerDownWay ?? "0"}
                </Text>
                <Text style={styles.tableCell}>
                  {row.totalPassenger ?? "0"}
                </Text>
                <Text style={styles.tableCell}>
                  {row.upWayIncome?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.tableCell}>
                  {row.downWayIncome?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.tableCell}>
                  {(row.upWayIncome + row.downWayIncome)?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.tableCell}>
                  {row.totalExpense?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.tableCell}>
                  {row.cashOnHand?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.tableCell}>
                  {row.gp?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.tableCell}>
                  {(row.cashOnHand - row.gp)?.toFixed(2) ?? "0.00"}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  {
                    flex: 15,
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: "bold",
                  },
                ]}
              >
                No data available
              </Text>
            </View>
          )}

          {/* Totals Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Totals</Text>
            {[...Array(9)].map((_, i) => (
              <Text key={i} style={styles.tableCell}>
                {"\u00A0"}
              </Text>
            ))}
            <Text style={styles.tableCell}>
              {profitData
                ?.reduce(
                  (acc: any, row: any) =>
                    acc + (row.upWayIncome + row.downWayIncome || 0),
                  0
                )
                .toFixed(2) ?? "0.00"}
            </Text>
            <Text style={styles.tableCell}>
              {profitData
                ?.reduce(
                  (acc: any, row: any) => acc + (row.totalExpense || 0),
                  0
                )
                .toFixed(2) ?? "0.00"}
            </Text>
            <Text style={styles.tableCell}>
              {profitData
                ?.reduce((acc: any, row: any) => acc + (row.cashOnHand || 0), 0)
                .toFixed(2) ?? "0.00"}
            </Text>
            <Text style={styles.tableCell}>
              {profitData
                ?.reduce((acc: any, row: any) => acc + (row.gp || 0), 0)
                .toFixed(2) ?? "0.00"}
            </Text>
            <Text style={styles.tableCell}>
              {profitData
                ?.reduce(
                  (acc: any, row: any) => acc + (row.cashOnHand - row.gp || 0),
                  0
                )
                .toFixed(2) ?? "0.00"}
            </Text>
          </View>
        </View>

        {/* Footer Table */}
        <View style={styles.footerTable}>
          {[
            {
              label: "Total Up & Down Income",
              value: `${
                profitData
                  ?.reduce(
                    (acc: any, row: any) =>
                      acc + (row.upWayIncome + row.downWayIncome || 0),
                    0
                  )
                  .toFixed(2) ?? "0.00"
              }`,
            },
            {
              label: "Road Expenses",
              value: `${
                profitData
                  ?.reduce(
                    (acc: any, row: any) => acc + (row.totalExpense || 0),
                    0
                  )
                  .toFixed(2) ?? "0.00"
              }`,
            },
            {
              label: "Total Balance",
              value: `${
                profitData
                  ?.reduce(
                    (acc: any, row: any) => acc + (row.cashOnHand || 0),
                    0
                  )
                  .toFixed(2) ?? "0.00"
              }`,
            },
            {
              label: "GP",
              value: `${
                profitData
                  ?.reduce((acc: any, row: any) => acc + (row.gp || 0), 0)
                  .toFixed(2) ?? "0.00"
              }`,
            },
            {
              label: "Total Profit",
              value: `${
                profitData
                  ?.reduce(
                    (acc: any, row: any) =>
                      acc + (row.cashOnHand - row.gp || 0),
                    0
                  )
                  .toFixed(2) ?? "0.00"
              }`,
            },
          ].map((row, index) => (
            <View style={styles.footerRow} key={index}>
              <Text style={styles.footerLabel}>{row.label}</Text>
              <Text style={styles.footerValue}>{row.value}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PdfProfitAndLoss;
