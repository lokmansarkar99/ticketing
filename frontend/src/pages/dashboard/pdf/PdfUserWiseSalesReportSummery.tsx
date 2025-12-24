import { format } from "date-fns";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";

// Hyphenation: break on dash, underscore, spaces, and also split long words
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
        paddingBottom: 40,
    },
    section: {
        marginBottom: 10,
    },
    headerDate: {
        fontSize: 8,
        position: "absolute",
        top: 10,
        left: 10,
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
    },
    logo: {
        width: 50,
        height: 25,
        marginBottom: 10,
        alignSelf: "center",
    },
    footer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        fontSize: 8,
    },
});

const PdfUserWiseSalesReportSummery = ({ result, singleCms, userName, selectedUser, startDate, endDate }: any) => {
    const { appName } = appConfiguration;
    const currentDate = format(new Date(), "M/d/yy, h:mm a");

    // Totals
    const totalSeats = result?.reduce((sum: number, s: any) => sum + (s.soldSeatQty || 0), 0);
    const totalFare = result?.reduce((sum: number, s: any) => sum + (s.fare || 0), 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Top-left current date */}
                <Text style={styles.headerDate}>Date: {currentDate}</Text>
                <View style={styles.section}>
                    <Image source={singleCms?.data?.companyLogo} style={styles.logo} />
                    <Text style={styles.heading}>{appName}</Text>
                    <Text style={styles.subHeading}>User Wise Sales Report Summery</Text>
                    <Text style={styles.subHeading}>
                        From: {startDate} To: {endDate}
                    </Text>
                    <View style={styles.titleWraper}>
                        <Text style={styles.subHeading}>User: {selectedUser}</Text>
                        <Text style={styles.title}>Download by: {userName}</Text>
                    </View>

                    <View style={styles.table}>
                        {/* Table Header */}
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableHeader, { flex: 0.4 }]}>SL</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Travel Date</Text>
                            <Text style={[styles.tableHeader, { flex: 2 }]}>Coach No</Text>
                            {/* <Text style={[styles.tableHeader, { flex: 2 }]}>Route</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Schedule</Text> */}
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Sold Seat Qty</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Fare</Text>
                        </View>

                        {/* Table Rows */}
                        {result?.map((sale: any, index: number) => (
                            <View style={styles.tableRow} key={sale.id} wrap={false}>
                                <Text style={{ flex: 0.4, ...styles.tableCol }}>{index + 1}</Text>
                                <Text style={{ flex: 1, ...styles.tableCol }}>{sale?.travelDate}</Text>
                                <Text style={{ flex: 2, ...styles.tableCol }}>{sale?.coachNo}</Text>
                                {/* <Text style={{ flex: 2, ...styles.tableCol }}>{sale?.route}</Text>
                                <Text style={{ flex: 1, ...styles.tableCol }}>{sale?.schedule || "N/A"}</Text> */}
                                <Text style={{ flex: 1, ...styles.tableCol }}>{sale?.soldSeatQty}</Text>
                                <Text style={{ flex: 1, ...styles.tableCol }}>{sale?.fare}</Text>
                            </View>
                        ))}

                        {/* Summary Row */}
                        <View style={[styles.tableRow, { borderTop: "1pt solid black" }]} wrap={false}>
                            <Text
                                style={{
                                    flex: 3.4,
                                    ...styles.tableCol,
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    paddingLeft: 20,
                                }}
                            >
                                Total:
                            </Text>
                            <Text style={{ flex: 1, ...styles.tableCol, fontWeight: "bold" }}>
                                {totalSeats}
                            </Text>
                            <Text style={{ flex: 1, ...styles.tableCol, fontWeight: "bold" }}>
                                {totalFare}
                            </Text>
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

export default PdfUserWiseSalesReportSummery;
