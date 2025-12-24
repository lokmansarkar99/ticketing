import { Paragraph } from "@/components/common/typography/Paragraph";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { dynamicSeatAllocationForReport } from "@/utils/helpers/dynamicAllocationForReport";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import React from "react";

interface ITripSheetPrintProps {
  bookingCoach: any;
  selectedTables: {
    blankSheet: any;
    counterSales: any;
    signature: any;
    tripSheet: boolean;
    coachDetails: boolean;
    passengerInfo: boolean;
  };
}
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

const TripSheetPrint = React.forwardRef<HTMLDivElement, ITripSheetPrintProps>(
  ({ bookingCoach, selectedTables }, ref) => {
    const { logo } = appConfiguration;
    const { name } = shareAuthentication();
    const currentDateTime = new Date().toLocaleString();
    const {
      orderSeat,
      seatAvailable,
      driver,
      coach,
      coachType,
      registrationNo,
      coachNo,
      departureDate,
      helper,
      supervisor,
    } = bookingCoach;

    const seatsAllocation = dynamicSeatAllocationForReport(
      coach?.coachClass
    ).map((seat: { seat: string }) => {
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
    });

    // Prepare Counter Sales Report
    const report: IReport[] = [];
    if (selectedTables?.counterSales) {
      for (const seat of orderSeat) {
        if (seat?.order?.counter?.name) {
          const findCounter = report.find(
            (r) => r.counterName === seat.order.counter.name
          );

          const commission = seat?.order?.counter?.commssion || 0;
          const commissionType =
            seat?.order?.counter?.commissionType || "Fixed";
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
    return (
      <section ref={ref}>
        <section className="w-full h-full break-after-page text-black font-anek mx-auto px-[40px] pt-[30px] pb-[10px]">
          <div className="grid grid-cols-3 justify-items-center items-end w-full">
            <div></div>
            <img src={logo} alt="app logo" className="w-60" />
            <div className="flex flex-col justify-end -mr-14">
              <Paragraph size={"sm"}>Printing By: {name}</Paragraph>
              <Paragraph size={"sm"}>Date & Time: {currentDateTime}</Paragraph>
            </div>
          </div>
          {/* Trip Sheet Table */}
          {selectedTables.tripSheet && (
            <div>
              <section className="-mx-2 mb-7">
                <div className="border rounded-md overflow-hidden">
                  <Table className="overflow-hidden">
                    <TableHeader>
                      <TableRow>
                        {[
                          "Registration No",
                          "Driver",
                          "Driver Phone",
                          "Guide",
                          "Guide Phone",
                          "Helper",
                          "Helper Phone",
                        ].map((header, index) => (
                          <TableHead
                            className="custom-table border-r !leading-4 text-center tracking-tight !text-xs"
                            key={index}
                          >
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="text-center border-r">
                        <TableCell className="custom-table border-r">
                          {registrationNo}
                        </TableCell>
                        <TableCell className="custom-table border-r">
                          {driver?.name}
                        </TableCell>
                        <TableCell className="custom-table border-r">
                          {driver?.contactNo}
                        </TableCell>
                        <TableCell className="custom-table border-r">
                          {supervisor?.userName}
                        </TableCell>
                        <TableCell className="custom-table border-r">
                          {supervisor?.contactNo}
                        </TableCell>
                        <TableCell className="custom-table border-r">
                          {helper?.name}
                        </TableCell>
                        <TableCell className="custom-table">
                          {helper?.contactNo}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </section>
            </div>
          )}

          {/* Coach Details Table */}
          {selectedTables.coachDetails && (
            <div>
              <section className="-mx-2 mb-7">
                <div className="border rounded-md overflow-hidden">
                  <Table className="overflow-hidden">
                    <TableHeader>
                      <TableRow>
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
                          <TableHead
                            className="custom-table border-r !leading-4 text-center tracking-tight !text-xs"
                            key={index}
                          >
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="text-center border-r">
                        <TableCell className="custom-table border-r">
                          {coachNo}
                        </TableCell>
                        <TableCell className="custom-table border-r">
                          {coachType}
                        </TableCell>
                        <TableCell className="custom-table border-r">
                          {coach?.route?.routeName}
                        </TableCell>
                        <TableCell className="custom-table border-r">
                          {coach?.route?.fromStation?.name}
                        </TableCell>
                        <TableCell className="custom-table border-r">
                          {coach?.route?.toStation?.name}
                        </TableCell>
                        <TableCell className="custom-table border-r">
                          {orderSeat?.length}
                        </TableCell>
                        <TableCell className="custom-table border-r">
                          {seatAvailable}
                        </TableCell>
                        <TableCell className="custom-table">
                          {departureDate}, {coach?.schedule}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </section>
            </div>
          )}

          {/* Passenger Info Table */}
          {selectedTables.passengerInfo && (
            <div>
              <section className="-mx-2">
                <div className="border rounded-md overflow-hidden">
                  <Table className="overflow-hidden">
                    <TableCaption className="mt-0 border-t">
                      Current trip details and passenger information
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
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
                          <TableHead
                            className="custom-table border-r !leading-4 text-center tracking-tight !text-xs"
                            key={index}
                          >
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {seatsAllocation.map((data, index) => (
                        <TableRow className="text-center border-r" key={index}>
                          <TableCell className="custom-table border-r">
                            {data.seat}
                          </TableCell>
                          <TableCell className="custom-table border-r">
                            {data.passengerName}
                          </TableCell>
                          <TableCell className="custom-table border-r">
                            {data.mobile}
                          </TableCell>
                          <TableCell className="custom-table border-r">
                            {data.ticketNo}
                          </TableCell>
                          <TableCell className="custom-table border-r">
                            {data.fare}
                          </TableCell>
                          <TableCell className="custom-table border-r">
                            {data?.ticketNo && data.fromStation}
                          </TableCell>
                          <TableCell className="custom-table border-r">
                            {data?.ticketNo && data.toStation}
                          </TableCell>
                          <TableCell className="custom-table border-r">
                            {data.issueCounterName && data.ticketNo
                              ? data.issueCounterName
                              : !data.issueCounterName && data.ticketNo
                              ? "Online"
                              : ""}
                          </TableCell>
                          <TableCell className="custom-table border-r">
                            {data.orderBy && data.ticketNo
                              ? data.orderBy
                              : !data.orderBy && data.ticketNo
                              ? "Online"
                              : ""}
                          </TableCell>
                          <TableCell className="custom-table">
                            {data.remarks}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>
            </div>
          )}

          {selectedTables.counterSales && (
            <div>
              <section className="-mx-2 mb-7">
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {[
                          "Counter Name",
                          "Sold",
                          "Fare",
                          "User Name",
                          "User Commission",
                          "Total Commission",
                          "Receive Amount",
                        ].map((header, idx) => (
                          <TableHead
                            key={idx}
                            className="custom-table border-r !leading-4 text-center tracking-tight !text-xs"
                          >
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.map((counter, counterIndex) =>
                        counter.user.map((user, userIndex) => (
                          <TableRow
                            key={`${counterIndex}-${userIndex}`}
                            className="text-center border-r"
                          >
                            {/* Counter Info */}
                            {userIndex === 0 ? (
                              <>
                                <TableCell className="custom-table border-r">
                                  {counter.counterName}
                                </TableCell>
                                <TableCell className="custom-table border-r">
                                  {counter.sold}
                                </TableCell>
                                <TableCell className="custom-table border-r">
                                  {counter.fare}
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className="custom-table border-r"></TableCell>
                                <TableCell className="custom-table border-r"></TableCell>
                                <TableCell className="custom-table border-r"></TableCell>
                              </>
                            )}
                            {/* User Details */}
                            <TableCell className="custom-table border-r">
                              {user.userName}
                            </TableCell>
                            <TableCell className="custom-table border-r">
                              {(user.commission / user.sold).toFixed(2)} x{" "}
                              {user.sold} = {user.commission.toFixed(2)}
                            </TableCell>
                            {userIndex === 0 ? (
                              <TableCell className="custom-table border-r">
                                {counter.totalCommission.toFixed(2)}
                              </TableCell>
                            ) : (
                              <TableCell className="custom-table border-r"></TableCell>
                            )}
                            {userIndex === 0 ? (
                              <TableCell className="custom-table">
                                {(
                                  counter.fare - counter.totalCommission
                                ).toFixed(2)}
                              </TableCell>
                            ) : (
                              <TableCell className="custom-table"></TableCell>
                            )}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </section>
            </div>
          )}

          {/* Blank Sheet */}
          {selectedTables.blankSheet && (
            <div>
              <section className="-mx-2 mb-7">
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Array.from({ length: 10 }, (_, i) => (
                          <TableHead
                            key={i}
                            className="custom-table border-r !leading-4 text-center tracking-tight !text-xs"
                          >
                            {i === 0
                              ? "Counter Name"
                              : i === 1
                              ? "Dept. Time"
                              : i === 2
                              ? "Pass. Qty"
                              : i === 3
                              ? "Amount(TK)"
                              : i === 4
                              ? "Signature"
                              : i === 5
                              ? "Counter Name"
                              : i === 6
                              ? "Dept. Time"
                              : i === 7
                              ? "Pass. Qty"
                              : i === 8
                              ? "Amount(TK)"
                              : "Signature"}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 15 }, (_, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {Array.from({ length: 10 }, (_, colIndex) => (
                            <TableCell
                              key={colIndex}
                              className=" border-r !leading-4 text-center tracking-tight !text-xs"
                            >
                              &nbsp;
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>
            </div>
          )}

          {/* Signature Section */}
          {selectedTables.signature && (
            <div>
              <section className="-mx-2 mb-7">
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableBody>
                      {[
                        ["Terminal Fee:", "", "Total(TK):", ""],
                        ["Line Expenditure:", "", "Total Expenditure(TK):", ""],
                        ["Staff Salary:", "", "Deposit:", ""],
                        ["Oil:", "", "", ""],
                        ["Vehicle Expenditure:", "", "", ""],
                        ["Others:", "", "", ""],
                      ].map((row, i) => (
                        <TableRow key={i}>
                          {row.map((cell, idx) => (
                            <TableCell
                              key={idx}
                              className="border-r !leading-4 text-right tracking-tight !text-xs w-1/4"
                            >
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>
            </div>
          )}
        </section>
      </section>
    );
  }
);

export default TripSheetPrint;
