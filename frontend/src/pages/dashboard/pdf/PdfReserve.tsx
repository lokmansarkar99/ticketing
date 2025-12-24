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
import { FC } from "react";

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
    width: 40,
    height: 25,
    marginBottom: 10,
    alignSelf: "center",
  },
});
interface IPdfReserveProps {
  reserveInfo: any;
  logo: any;
}

const PdfReserve: FC<IPdfReserveProps> = ({ reserveInfo, logo }) => {
  const { appName } = appConfiguration;
  const currentDate = format(new Date(), "MMMM dd, yyyy");
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {/* Logo and Heading */}
          <Image source={logo?.data?.companyLogo} style={styles.logo} />
          <Text style={styles.heading}>{appName}</Text>
          <Text style={styles.subHeading}>Date: {currentDate}</Text>
          <Text style={styles.title}>Counter Booking Seat Status Report</Text>

          {/* Table */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableHeader}>
                <Text>Registration No.</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Passenger Name</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Contact No.</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Amount</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Paid Amount</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Due Amount</Text>
              </View>
            </View>

            {/* Table Row */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>{reserveInfo?.registrationNo}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{reserveInfo?.passengerName}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{reserveInfo?.contactNo}৳</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{reserveInfo?.amount?.toFixed(2)}৳</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{reserveInfo?.paidAmount?.toFixed(2)}৳</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{reserveInfo?.dueAmount?.toFixed(2)}৳</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfReserve;
