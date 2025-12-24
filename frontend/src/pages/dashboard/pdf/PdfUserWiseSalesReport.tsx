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
        marginTop: 20, // push down because of header
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
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
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

const PdfUserWiseSalesReport = ({ result, singleCms, userName, counter, selectedUser, startDate, endDate }: any) => {
    const { appName } = appConfiguration;
    const currentDate = format(new Date(), "M/d/yy, h:mm a");

    // Totals
    const totalFare = result?.reduce((sum: number, s: any) => sum + (s.unitPrice || 0), 0);
    const totalDiscount = result?.reduce((sum: number, s: any) => sum + (s.discount || 0), 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Top-left current date */}
                <Text style={styles.headerDate}>Date: {currentDate}</Text>

                <View style={styles.section}>
                    <Image source={singleCms?.data?.companyLogo} style={styles.logo} />
                    <Text style={styles.heading}>{appName}</Text>
                    <Text style={styles.subHeading}>User Wise Sales Report</Text>
                    <Text style={styles.subHeading}>
                        From: {startDate} To: {endDate}
                    </Text>
                    <View style={styles.titleWraper}>
                        <View style={{ ...styles.titleWraper, justifyContent: "flex-start", gap: 10, alignItems: "center" }}>
                            <Text style={styles.subHeading}>User: {selectedUser}</Text>
                            <Text style={styles.subHeading}>Counter: {counter}</Text>
                        </View>
                        <Text style={styles.title}>Download by: {userName}</Text>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableHeader, { flex: 0.4 }]}>SL</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Travel Date</Text>
                            <Text style={[styles.tableHeader, { flex: 2 }]}>Coach No</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Class</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Seat</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Status</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Cancel By</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Fare</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Discount</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Actual Fare</Text>
                        </View>

                        {result?.map((sale: any, index: number) => (
                            <View style={styles.tableRow} key={sale.id} wrap={false}>
                                <View style={{ flex: 0.4, ...styles.tableCol }}><Text>{index + 1}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.coachConfig?.departureDate}</Text></View>
                                <View style={{ flex: 2, ...styles.tableCol }}><Text>{sale?.coachConfig?.coachNo}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.class}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.seat}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.status}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.cancelBy ? sale?.cancelBy : "N/A"}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.unitPrice}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.discount}</Text></View>
                                <View style={{ flex: 1, ...styles.tableCol }}><Text>{sale?.unitPrice - sale?.discount}</Text></View>
                            </View>
                        ))}

                        {/* Summary Row */}
                        <View style={[styles.tableRow, { borderTop: "1pt solid black" }]} wrap={false}>
                            <View style={{
                                flex: 7.4,
                                ...styles.tableCol,
                                textAlign: "right",
                                fontWeight: "bold",
                                paddingLeft: 30,
                            }}><Text>Total: </Text></View>
                            <View style={{ flex: 1, ...styles.tableCol, fontWeight: "bold" }}><Text>{totalFare}</Text></View>
                            <View style={{ flex: 1, ...styles.tableCol, fontWeight: "bold" }}><Text>{totalDiscount}</Text></View>
                            <View style={{ flex: 1, ...styles.tableCol, fontWeight: "bold" }}><Text>{totalFare - totalDiscount}</Text></View>
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

export default PdfUserWiseSalesReport;
