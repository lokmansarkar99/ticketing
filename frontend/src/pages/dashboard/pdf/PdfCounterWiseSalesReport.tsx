import { format } from "date-fns";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";

Font.registerHyphenationCallback((word: string) => {
    // Break after underscores and also split long chunks
    if (word.includes('_')) {
        // keep "_" as its own piece and allow breaking inside segments
        return word.split('_').flatMap((seg, i) =>
            i ? ['_', ...seg.match(/.{1,10}/g) ?? ['']] : seg.match(/.{1,10}/g) ?? ['']
        );
    }
    // Fallback: if a single word is very long, break every 10 chars
    return word.length > 10 ? word.match(/.{1,10}/g) ?? [word] : [word];
});

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        paddingHorizontal: 10,
        paddingVertical: 10,
        paddingBottom: 40,
    },
    headerDate: {
        fontSize: 8,
        position: "absolute",
        top: 10,
        left: 10,
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
    titleWraper: {
        display: "flex", flexDirection: "row", justifyContent: "space-between"
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
    footer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        fontSize: 8,
    },
});

const PdfCounterWiseSalesReport = ({ result, singleCms, userName, startDate, endDate }: any) => {
    const { appName } = appConfiguration;
    const currentDate = format(new Date(), "M/d/yy, h:mm a");

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Top-left current date */}
                <Text style={styles.headerDate}>Date: {currentDate}</Text>
                <View style={styles.section}>
                    <Image source={singleCms?.data?.companyLogo} style={styles.logo} />
                    <Text style={styles.heading}>{appName}</Text>
                    <Text style={styles.subHeading}>
                        From: {startDate} To: {endDate}
                    </Text>
                    <View style={styles.titleWraper}>
                        <Text style={styles.title}>All Counter User Wise Sales Report</Text>
                        <Text style={styles.title}>Download by: {userName}</Text>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableHeader, { flex: 0.4 }]}>SL</Text>
                            <Text style={[styles.tableHeader, { flex: 2 }]}>Counter Name</Text>
                            <Text style={[styles.tableHeader, { flex: 2 }]}>User Name</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Total Sold	</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Total Cancel</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Actual Sold</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Total Fare</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Total Refund</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Total Commission</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Deposit</Text>
                        </View>

                        {result?.map((sale: any, index: number) => (
                            <View style={styles.tableRow} key={sale.id} wrap={false}>
                                <View style={{ flex: 0.4, ...styles.tableCol }}><Text>{index + 1}</Text></View>
                                <View style={{ flex: 2, ...styles.tableCol }}><Text>{sale?.counter}</Text></View>
                                <View style={{ flex: 2, ...styles.tableCol }}><Text>{sale?.userName}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.totalSold}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.totalCancel}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.actualSold}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.totalFare}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.refundAmount}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.totalCommission}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.deposit}</Text></View>
                            </View>
                        ))}

                        {/* Summary Row */}
                        <View style={[styles.tableRow, { borderTop: "1pt solid black" }]} wrap={false}>
                            <View style={{
                                flex: 4.4,
                                ...styles.tableCol,
                                textAlign: "right",
                                fontWeight: "bold",
                                paddingRight: 2,
                            }}><Text>Total: </Text></View>
                            <View style={{ flex: 1, ...styles.tableCol, fontWeight: "bold" }}><Text>{result?.reduce((sum: number, s: any) => sum + (s.totalSold || 0), 0)}</Text></View>
                            <View style={{ flex: 1, ...styles.tableCol, fontWeight: "bold" }}><Text>{result?.reduce((sum: number, s: any) => sum + (s.totalCancel || 0), 0)}</Text></View>
                            <View style={{ flex: 1, ...styles.tableCol, fontWeight: "bold" }}><Text>{result?.reduce((sum: number, s: any) => sum + (s.actualSold || 0), 0)}</Text></View>
                            <View style={{ flex: 1, ...styles.tableCol, fontWeight: "bold" }}><Text>{result?.reduce((sum: number, s: any) => sum + (s.totalFare || 0), 0)}</Text></View>
                            <View style={{ flex: 1, ...styles.tableCol, fontWeight: "bold" }}><Text>{result?.reduce((sum: number, s: any) => sum + (s.refundAmount || 0), 0)}</Text></View>
                            <View style={{ flex: 1, ...styles.tableCol, fontWeight: "bold" }}><Text>{result?.reduce((sum: number, s: any) => sum + (s.totalCommission || 0), 0)}</Text></View>
                            <View style={{ flex: 1, ...styles.tableCol, fontWeight: "bold" }}><Text>{result?.reduce((sum: number, s: any) => sum + (s.deposit || 0), 0)}</Text></View>
                        </View>
                    </View>
                </View>
                {/* Footer with pagination */}
                <Text
                    style={styles.footer}
                    render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
                    fixed
                />
            </Page>
        </Document>
    );
};

export default PdfCounterWiseSalesReport;