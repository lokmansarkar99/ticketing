import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { FC } from "react";

interface IReportProps {
  result: any;
  logo: any;
  dateRange: any;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  section: {
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
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 2,
  },
  tableCol: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 7,
    textAlign: "center",
    paddingVertical: 2,
  },
  logo: {
    width: 50,
    height: 25,
    marginBottom: 10,
    alignSelf: "center",
  },
});

const PdfExpenseReport: FC<IReportProps> = ({ result, logo, dateRange }) => {
  const { appName } = appConfiguration;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {/* Logo */}
          <Image source={logo?.data?.companyLogo} style={styles.logo} />
          <Text style={styles.heading}>{appName}</Text>
          <Text style={styles.subHeading}>Date: {dateRange}</Text>
          <Text style={styles.title}>Expense Report</Text>

          {/* Table */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableHeader}>
                <Text>Index</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Note</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Category</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Sub-Category</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Date</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Total Amount</Text>
              </View>
            </View>

            {/* Table Rows */}
            {result?.map((singleExpense: any, index: number) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{singleExpense?.note || "N/A"}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{singleExpense?.dummyCategory || "Not Found"}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{singleExpense?.dummySubCategory || "Not Found"}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{singleExpense?.dummyDate || "N/A"}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{singleExpense?.totalAmount || "0.00"}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfExpenseReport;
