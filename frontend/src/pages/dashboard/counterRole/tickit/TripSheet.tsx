import { useReactToPrint } from "react-to-print";
import InfoWrapper from "@/components/common/wrapper/InfoWrapper";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FC, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import TripSheetPrint from "../../printLabel/TripSheetPrint";
import React from "react";
import { Paragraph } from "@/components/common/typography/Paragraph";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfTripSheet from "../../pdf/PdfTripSheet";
import { Loader } from "@/components/common/Loader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import SalesReportCalculation from "./SalesReportCalculation";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { Signature } from "./Signature";
import BlankTripSheet from "./BlankTripSheet";

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

interface ITripSheet {
  bookingCoach: any;
}

const TripSheet: FC<ITripSheet> = ({ bookingCoach }: any) => {
  const currentDateTime = new Date().toLocaleString();
  const { data: singleCms } = useGetSingleCMSQuery({});
  const logo = singleCms?.data?.companyLogo ?? "";
  const { permission } = shareAuthentication();

  const {
    orderSeat,
    driver,
    schedule,
    coachType,
    registrationNo,
    coachNo,
    coach,
    departureDate,
    helper,
    supervisor,
  } = bookingCoach;

  const printRef = useRef(null);
  const promiseResolveRef = useRef<any>(null);
  // Memoize the data to avoid resetting unnecessarily
  const printData = React.useMemo(() => bookingCoach, [bookingCoach]);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {
      promiseResolveRef.current = null;
    },
  });

  useEffect(() => {
    if (printData && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [printData]);

  const [selectedTables, setSelectedTables] = useState({
    tripSheet: true,
    coachDetails: true,
    passengerInfo: true,
    counterSales: true,
    signature: true,
    blankSheet: false,
  });

 const handleCheckboxChange = (
  tableName:
    | "tripSheet"
    | "coachDetails"
    | "passengerInfo"
    | "counterSales"
    | "signature"
    | "blankSheet"
) => {
  setSelectedTables((prev) => {
    if (tableName === "blankSheet") {
      const isNowChecked = !prev.blankSheet;

      if (isNowChecked) {
        // Blank sheet selected → disable all others except essentials
        return {
          tripSheet: true,
          coachDetails: true,
          passengerInfo: false,
          counterSales: false,
          signature: true,
          blankSheet: true,
        };
      } else {
        // Blank sheet deselected → restore normal view
        return {
          ...prev,
          blankSheet: false,
          passengerInfo: true,
          counterSales: true,
          signature: true,
        };
      }
    }

    // If blankSheet is active → don't allow turning on any other section
    if (prev.blankSheet) {
      return prev;
    }

    // Normal toggle
    return {
      ...prev,
      [tableName]: !prev[tableName],
    };
  });
};

  // Generate seat allocation data
  const seatsAllocation: TripStatus[] = orderSeat
    ?.filter((s: any) => s.status === "Success")
    ?.map((o: any) => ({
      seat: o.seat,
      passengerName: o.order?.customerName,
      mobile: o.order?.phone,
      ticketNo: o.order?.ticketNo,
      fare: o?.unitPrice,
      fromStation: o?.fromStation?.name,
      toStation: o?.toStation?.name,
      issueCounterName: o.order?.counter?.name,
      orderBy: o.order?.user?.userName,
      remarks: o.remarks,
    }));

  // sort seats A–Z
  seatsAllocation.sort((a, b) =>
    a.seat.localeCompare(b.seat, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );

  // detect duplicate seats
  const seatCount: Record<string, number> = {};

  seatsAllocation.forEach((item) => {
    seatCount[item.seat] = (seatCount[item.seat] || 0) + 1;
  });

  // identify seats that appear more than once
  const duplicateSeats = new Set(
    Object.keys(seatCount).filter((seat) => seatCount[seat] > 1)
  );

  return (
    <div>
      <div className="flex justify-between mt-8">
        <div className="flex gap-5">
          <p className="text-xl font-bold text-red-400">Printing Options</p>
          <div className="flex justify-between gap-5">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedTables.passengerInfo}
                onChange={() => handleCheckboxChange("passengerInfo")}
              />
              <label>Trip Sheet</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedTables.signature}
                onChange={() => handleCheckboxChange("signature")}
              />
              <label>Signature</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedTables.counterSales}
                onChange={() => handleCheckboxChange("counterSales")}
              />
              <label>Counter Sales Report</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedTables.blankSheet}
                onChange={() => handleCheckboxChange("blankSheet")}
              />
              <label>Blank TripSheet</label>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <PDFDownloadLink
            document={
              <PdfTripSheet
                singleCms={singleCms}
                bookingCoach={bookingCoach}
                selectedTables={selectedTables}
              />
            }
            fileName="trip_sheet_report.pdf"
          >
            {
              //@ts-ignore
              (params) => {
                const { loading } = params;
                return loading ? (
                  <Button
                    disabled
                    className="transition-all duration-150 px-5"
                    variant="destructive"
                    size="sm"
                  >
                    <Loader /> Pdf
                  </Button>
                ) : (
                  <Button variant="destructive" size="sm" className="px-5">
                    Pdf
                  </Button>
                );
              }
            }
          </PDFDownloadLink>
          <Button
            onClick={handlePrint}
            variant="primary"
            className="w-full flex justify-start px-4"
            size="sm"
          >
            Print
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 justify-items-center items-end w-full">
        <div></div>
        <img src={logo} alt="app logo" className="w-32" />
        <div className="flex flex-col justify-end -mr-28">
          <Paragraph size={"sm"}>
            Printing By: {bookingCoach?.order?.user?.userName}
          </Paragraph>
          <Paragraph size={"sm"}>Date & Time: {currentDateTime}</Paragraph>
        </div>
      </div>
      <InfoWrapper className="my-2" heading="Trip Sheet">
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
                    {
                      orderSeat?.filter((s: any) => s.status === "Success")
                        ?.length
                    }
                  </TableCell>
                  <TableCell className="custom-table border-r">
                    {coach?.seatPlan?.noOfSeat -
                      orderSeat?.filter((s: any) => s.status === "Success")
                        ?.length}
                  </TableCell>
                  <TableCell className="custom-table">
                    {departureDate}, {schedule}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {selectedTables.passengerInfo && (
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
                    <TableRow
                      className={`text-center border-r ${
                        duplicateSeats.has(data?.seat) ? "bg-secondary/50" : ""
                      }`}
                      key={index}
                    >
                      <TableCell className="custom-table border-r">
                        {data?.seat}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {data?.passengerName}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {data?.mobile}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {data?.ticketNo}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {data?.fare}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {data?.ticketNo && data?.fromStation}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {data?.ticketNo && data?.toStation}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {data?.issueCounterName && data?.ticketNo
                          ? data?.issueCounterName
                          : !data?.issueCounterName && data?.ticketNo
                          ? "Online"
                          : ""}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {data?.orderBy && data?.ticketNo
                          ? data?.orderBy
                          : !data?.orderBy && data?.ticketNo
                          ? "Online"
                          : ""}
                      </TableCell>
                      <TableCell className="custom-table">
                        {data?.remarks}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}
        {selectedTables.blankSheet && (
          <section className="-mx-2">
            <BlankTripSheet />
          </section>
        )}
        {selectedTables.signature && (
          <section className="-mx-2 mb-7">
            <Signature />
          </section>
        )}
      </InfoWrapper>
      {permission?.aifs === true && selectedTables.counterSales && (
        <div>
          <SalesReportCalculation orderSeat={orderSeat} />
        </div>
      )}
      <div className="invisible hidden -left-full">
        {/* Print Section */}
        {printData && (
          <TripSheetPrint
            ref={printRef}
            bookingCoach={printData}
            selectedTables={selectedTables}
          />
        )}
      </div>
    </div>
  );
};

export default TripSheet;
