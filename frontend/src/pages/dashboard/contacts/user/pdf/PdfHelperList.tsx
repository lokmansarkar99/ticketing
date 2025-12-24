import { format } from "date-fns";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";

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

    statusSuccess: {
        color: "green",
    },
    statusCancelled: {
        color: "red",
    },
});

const PdfHelperList = ({ result, singleCms }: any) => {
    const { appName } = appConfiguration;
    const currentDate = format(new Date(), "MMMM dd, yyyy");

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Image source={singleCms?.data?.companyLogo} style={styles.logo} />
                    <Text style={styles.heading}>{appName}</Text>
                    <Text style={styles.subHeading}>
                        Date: {currentDate}
                    </Text>
                    <Text style={styles.title}>Helper List</Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableHeader}><Text>Index</Text></View>
                            <View style={styles.tableHeader}><Text>Full Name</Text></View>
                            <View style={styles.tableHeader}><Text>Contact No</Text></View>
                            <View style={styles.tableHeader}><Text>Status</Text></View>
                        </View>

                        {result?.map((sale: any, index: number) => (
                            <View style={styles.tableRow} key={sale.id}>
                                <View style={styles.tableCol}><Text>{index + 1}</Text></View>
                                <View style={styles.tableCol}><Text>{sale?.name}</Text></View>
                                <View style={styles.tableCol}><Text>{sale?.contactNo}</Text></View>
                                <View style={styles.tableCol}><Text>{sale?.active ? "Active" : "Deactive"}</Text></View>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default PdfHelperList;