import { format } from "date-fns";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { dateFormatter } from "@/utils/helpers/dateFormatter";

const styles = StyleSheet.create({
  page: { flexDirection: "column", paddingHorizontal: 10, paddingVertical: 10 },
  section: { marginBottom: 10 },
  heading: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "semibold",
  },
  subHeading: { fontSize: 12, marginBottom: 5, textAlign: "center" },
  title: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { flexDirection: "row" },
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
  logo: { width: 50, height: 25, marginBottom: 10, alignSelf: "center" },
});

interface IUser {
  counter: {
    name: string;
  };
}
interface IFund {
  id: number;
  user: IUser;
  txId: string;
  paymentType: string;
  amount: number;
  status: string;
  date: string | Date;
}

interface PdfFundReportProps {
  result: IFund[];
  singleCms: any;
}

const PdfFundCounter: React.FC<PdfFundReportProps> = ({
  result,
  singleCms,
}) => {
  const { appName } = appConfiguration;
  const currentDate = format(new Date(), "MMMM dd, yyyy");
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image source={singleCms?.data?.companyLogo} style={styles.logo} />
          <Text style={styles.heading}>{appName}</Text>
          <Text style={styles.subHeading}>Date: {currentDate}</Text>
          <Text style={styles.title}>Fund Report</Text>

          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableHeader}>
                <Text>SN</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Counter Name</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Transaction ID</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Payment Type</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Amount</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Status</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>Payment Date</Text>
              </View>
            </View>

            {/* Table Data */}
            {result?.map((fund: IFund, index: number) => (
              <View style={styles.tableRow} key={fund?.id}>
                <View style={styles.tableCol}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{fund?.user?.counter?.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{fund?.txId}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{fund?.paymentType}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{fund?.amount?.toLocaleString()}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{fund?.status}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{dateFormatter(fund?.date)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfFundCounter;
