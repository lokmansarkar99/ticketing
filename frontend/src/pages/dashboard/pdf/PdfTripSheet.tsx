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
import { dynamicSeatAllocationForReport } from "@/utils/helpers/dynamicAllocationForReport";

interface IReport {
  counterName: string;
  sold: number;
  fare: number;
  totalCommission: number;
  user: {
    userName: string;
    commission: number;
    sold: number;
  }[];
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
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0", // Light background to distinguish total row
  },
  totalCol: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 2,
  },
  logo: {
    width: 50,
    height: 25,
    marginBottom: 10,
    alignSelf: "center",
  },
  margin: {
    marginTop: 10,
  },

  signatureTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    marginTop: 20,
  },

  sigRow: {
    flexDirection: "row",
  },

  sigCell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 6,
    fontSize: 9,
    justifyContent: "center",
    textAlign: "right",
  },
  sigCellLast: {
    borderRightWidth: 0,
  },

  blankTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    marginTop: 20,
  },

  blankRow: {
    flexDirection: "row",
  },

  blankCell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    height: 25,
    justifyContent: "center",
    fontSize: 8,
    textAlign: "center",
  },

  blankCellLast: {
    borderRightWidth: 0,
  },

  blankHeader: {
    fontWeight: "bold",
    backgroundColor: "#f4f4f4",
  },
});

interface TripStatus {
  seat: string;
  passengerName: string;
  mobile: string;
  ticketNo: string;
  fare: string;
  fromStation: string;
  toStation: string;
  issueCounterName?: string;
  orderBy?: string;
  remarks?: string;
}

const PdfTripSheet = ({ bookingCoach, selectedTables, singleCms }: any) => {
  const { appName } = appConfiguration;

  const currentDate = format(new Date(), "MMMM dd, yyyy");
  const {
    orderSeat,
    seatAvailable,
    coach,
    driver,
    coachType,
    registrationNo,
    coachNo,
    departureDate,
    helper,
    supervisor,
  } = bookingCoach;

  const seatsAllocation = dynamicSeatAllocationForReport(coach?.coachClass).map(
    (seat: { seat: string }) => {
      const matchedOrder = orderSeat.find(
        (order: any) => order.seat === seat.seat
      );

      return {
        seat: seat.seat,
        passengerName: matchedOrder?.order?.customerName,
        mobile: matchedOrder?.order?.phone,
        ticketNo: matchedOrder?.order?.ticketNo,
        fare: matchedOrder?.unitPrice,
        fromStation: matchedOrder?.fromStation?.name,
        toStation: matchedOrder?.toStation?.name,
        issueCounterName: matchedOrder?.order?.counter?.name,
        orderBy: matchedOrder?.order?.user?.userName,
        remarks: matchedOrder?.remarks,
      } as TripStatus;
    }
  );

  // Calculate total fare
  const totalFare = seatsAllocation
    .reduce((sum: number, data: TripStatus) => {
      const fareValue = data.fare ? parseFloat(data.fare) : 0;
      return sum + (isNaN(fareValue) ? 0 : fareValue);
    }, 0)
    .toFixed(2);

  const report: IReport[] = [];

  if (selectedTables?.counterSales) {
    for (const seat of orderSeat) {
      if (seat?.order?.counter?.name) {
        const findCounter = report.find(
          (r) => r.counterName === seat.order.counter.name
        );

        const commission = seat?.order?.counter?.commssion || 0;
        const commissionType = seat?.order?.counter?.commissionType || "Fixed";
        const finalCommission =
          commissionType === "Fixed"
            ? commission
            : seat?.fare * (commission / 100);

        if (!findCounter) {
          report.push({
            counterName: seat.order.counter.name,
            sold: 1,
            fare: seat.fare,
            totalCommission: finalCommission,
            user: [
              {
                userName: seat.order.user.userName,
                sold: 1,
                commission: finalCommission,
              },
            ],
          });
        } else {
          findCounter.sold += 1;
          findCounter.fare += seat.fare;
          findCounter.totalCommission += finalCommission;

          const findUser = findCounter.user.find(
            (user) => user.userName === seat.order.user.userName
          );

          if (!findUser) {
            findCounter.user.push({
              userName: seat.order.user.userName,
              sold: 1,
              commission: finalCommission,
            });
          } else {
            findUser.sold += 1;
            findUser.commission += finalCommission;
          }
        }
      }
    }
  }

  // Example particulars for PDF (if needed)
  // const particulars: Particular[] = [{ subject: "Fuel", amount: "500" }];
  // const particularTotal = particulars.reduce(
  //   (sum, p) => sum + Number(p.amount || 0),
  //   0
  // );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Section for Logo, Title, and Date */}
        <View style={styles.section}>
          <Image source={singleCms?.data?.companyLogo} style={styles.logo} />
          <Text style={styles.heading}>{appName}</Text>
          <Text style={styles.subHeading}>Date: {currentDate}</Text>
          <Text style={styles.title}>Trip Sheet Report</Text>
        </View>

        {/* Section for Trip Sheet */}
        {selectedTables.tripSheet && (
          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {[
                  "Registration No",
                  "Driver",
                  "Driver Phone",
                  "Guide",
                  "Guide Phone",
                  "Helper",
                  "Helper Phone",
                ].map((header, index) => (
                  <View style={styles.tableHeader} key={index}>
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text>{registrationNo}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{driver?.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{driver?.contactNo}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{supervisor?.userName}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{supervisor?.contactNo}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{helper?.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{helper?.contactNo}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Section for Coach Details */}
        {selectedTables.coachDetails && (
          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {[
                  "Coach No",
                  "Coach Type",
                  "Route Name",
                  "Starting Point",
                  "Ending Point",
                  "Total Sold",
                  "Total Available",
                  "Journey Date Time",
                ].map((header, index) => (
                  <View style={styles.tableHeader} key={index}>
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text>{coachNo}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{coachType}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{coach?.route?.routeName}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{coach?.route?.fromStation?.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{coach?.route?.toStation?.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{orderSeat?.length}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{seatAvailable}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>
                    {departureDate}, {coach?.schedule}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Section for Passenger Information */}
        {selectedTables.passengerInfo && (
          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {[
                  "Seat",
                  "Passenger Name",
                  "Mobile",
                  "Ticket No",
                  "Fare",
                  "From Station",
                  "To Station",
                  "Issue Counter",
                  "Ordered By",
                  "Remarks",
                ].map((header, index) => (
                  <View style={styles.tableHeader} key={index}>
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {seatsAllocation.map((data, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol}>
                    <Text>{data.seat}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{data.passengerName}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{data.mobile}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{data.ticketNo}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{data.fare}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{data.fromStation}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{data.toStation}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>
                      {data.issueCounterName && data.ticketNo
                        ? data.issueCounterName
                        : !data.issueCounterName && data.ticketNo
                        ? "Online"
                        : ""}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>
                      {data.orderBy && data.ticketNo
                        ? data.orderBy
                        : !data.orderBy && data.ticketNo
                        ? "Online"
                        : ""}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{data.remarks}</Text>
                  </View>
                </View>
              ))}
              {/* Total Row for Fare */}
              <View style={styles.totalRow}>
                <View style={styles.totalCol}>
                  <Text>-</Text>
                </View>
                <View style={styles.totalCol}>
                  <Text>-</Text>
                </View>
                <View style={styles.totalCol}>
                  <Text>-</Text>
                </View>
                <View style={styles.totalCol}>
                  <Text>Total:</Text>
                </View>
                <View style={styles.totalCol}>
                  <Text>{totalFare}</Text>
                </View>
                <View style={styles.totalCol}>
                  <Text>-</Text>
                </View>
                <View style={styles.totalCol}>
                  <Text>-</Text>
                </View>
                <View style={styles.totalCol}>
                  <Text>-</Text>
                </View>
                <View style={styles.totalCol}>
                  <Text>-</Text>
                </View>
                <View style={styles.totalCol}>
                  <Text>-</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {/* Blank TripSheet */}
        {selectedTables.blankSheet && (
          <View style={styles.blankTable}>
            {/* Header Row */}
            <View style={styles.blankRow}>
              {[
                "Counter Name",
                "Dept. Time",
                "Pass. Qty",
                "Amount(TK)",
                "Signature",
                "Counter Name",
                "Dept. Time",
                "Pass. Qty",
                "Amount(TK)",
                "Signature",
              ].map((header, i) => (
                <View
                  key={i}
                  style={{
                    ...styles.blankCell,
                    ...(i === 9 ? styles.blankCellLast : {}),
                    ...styles.blankHeader, // header style always applied
                  }}
                >
                  <Text>{header}</Text>
                </View>
              ))}
            </View>

            {/* 15 Empty Data Rows */}
            {Array.from({ length: 15 }, (_, rowIndex) => (
              <View key={rowIndex} style={styles.blankRow}>
                {Array.from({ length: 10 }, (_, colIndex) => (
                  <View
                    key={colIndex}
                    style={{
                      ...styles.blankCell,
                      ...(colIndex === 9 ? styles.blankCellLast : {}),
                    }}
                  >
                    <Text> </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
        {/* Signature Section */}
        {selectedTables.signature && (
          <View style={styles.signatureTable}>
            {[
              ["Terminal Fee:", "", "Total(TK):", ""],
              ["Line Expenditure:", "", "Total Expenditure(TK):", ""],
              ["Staff Salary:", "", "Deposite:", ""],
              ["Oil:", "", "", ""],
              ["Vehicle Expenditure:", "", "", ""],
              ["Others:", "", "", ""],
            ].map((row, i) => (
              <View key={i} style={styles.sigRow}>
                <View style={styles.sigCell}>
                  <Text>{row[0]}</Text>
                </View>
                <View style={styles.sigCell}>
                  <Text>{row[1]}</Text>
                </View>
                <View style={styles.sigCell}>
                  <Text>{row[2]}</Text>
                </View>
                <View style={[styles.sigCell, styles.sigCellLast]}>
                  <Text>{row[3]}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTables?.counterSales && (
          <View style={styles.section}>
            <Text style={styles.title}>Counter Sales Report</Text>

            <View style={styles.table}>
              {/* Header */}
              <View style={styles.tableRow}>
                {[
                  "Counter Name",
                  "Sold",
                  "Fare",
                  "User Name",
                  "User Commission",
                  "Total Commission",
                  "Receive Amount",
                ].map((header, i) => (
                  <View style={styles.tableHeader} key={i}>
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>

              {/* Data Rows */}
              {report.map((counter, counterIndex) => {
                const userRows = counter.user;

                return userRows.map((user, userIndex) => (
                  <View
                    style={styles.tableRow}
                    key={`${counterIndex}-${userIndex}`}
                  >
                    {userIndex === 0 && (
                      <>
                        <View style={styles.tableCol}>
                          <Text>{counter.counterName}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text>{counter.sold}</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text>{counter.fare}</Text>
                        </View>
                      </>
                    )}
                    {userIndex !== 0 && (
                      <>
                        <View style={styles.tableCol}>
                          <Text></Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text></Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text></Text>
                        </View>
                      </>
                    )}

                    {/* User Details */}
                    <View style={styles.tableCol}>
                      <Text>{user.userName}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text>
                        {(user.commission / user.sold).toFixed(2)} x {user.sold}{" "}
                        = {user.commission.toFixed(2)}
                      </Text>
                    </View>

                    {/* Total Commission */}
                    {userIndex === 0 ? (
                      <View style={styles.tableCol}>
                        <Text>{counter.totalCommission.toFixed(2)}</Text>
                      </View>
                    ) : (
                      <View style={styles.tableCol}>
                        <Text></Text>
                      </View>
                    )}

                    {/* Receive Amount */}
                    {userIndex === 0 ? (
                      <View style={styles.tableCol}>
                        <Text>
                          {(counter.fare - counter.totalCommission).toFixed(2)}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.tableCol}>
                        <Text></Text>
                      </View>
                    )}
                  </View>
                ));
              })}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PdfTripSheet;
