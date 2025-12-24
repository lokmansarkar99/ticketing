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
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { dynamicSeatAllocationForReport } from "@/utils/helpers/dynamicAllocationForReport";
import { FC, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import TripSheetPrint from "../../printLabel/TripSheetPrint";
import React from "react";
import { Paragraph } from "@/components/common/typography/Paragraph";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfTripSheet from "../../pdf/PdfTripSheet";
import { Loader } from "@/components/common/Loader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";

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
  const { logo } = appConfiguration;
  const currentDateTime = new Date().toLocaleString();
  const { data: singleCms } = useGetSingleCMSQuery(
    {}
  );

  const {
    orderSeat,
    seatAvailable,
    coachClass,
    driver,
    destinationCounter,
    fromCounter,
    route,
    schedule,
    coachType,
    registrationNo,
    coachNo,
    departureDate,
    helper,
    supervisor
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
    tableName: "tripSheet" | "coachDetails" | "passengerInfo"
  ) => {
    setSelectedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  // Generate seat allocation data
  const seatsAllocation = dynamicSeatAllocationForReport(coachClass).map(
    (seat: { seat: string }) => {
      const matchedOrder = orderSeat.find(
        (order: any) => order.seat === seat.seat
      );


      return {
        seat: seat.seat,
        passengerName: matchedOrder?.order?.customerName,
        mobile: matchedOrder?.order?.phone,
        ticketNo: matchedOrder?.order?.ticketNo,
        fare: matchedOrder?.order?.amount,
        fromStation: fromCounter?.name,
        toStation: destinationCounter?.name,
        issueCounterName: matchedOrder?.order?.counter?.name,
        orderBy: matchedOrder?.order?.user?.userName,
        remarks: matchedOrder?.remarks,
      } as TripStatus;
    }
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
                checked={selectedTables.tripSheet}
                onChange={() => handleCheckboxChange("tripSheet")}
              />
              <span>Bus Info</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedTables.coachDetails}
                onChange={() => handleCheckboxChange("coachDetails")}
              />
              <label>Coach Details</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedTables.passengerInfo}
                onChange={() => handleCheckboxChange("passengerInfo")}
              />
              <label>Trip Sheet</label>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
        <PDFDownloadLink
            document={<PdfTripSheet singleCms={singleCms} bookingCoach={bookingCoach} selectedTables={selectedTables}/>}
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
            }}
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
        <img src={logo} alt="app logo" className="w-60" />
        <div className="flex flex-col justify-end -mr-28">
          <Paragraph size={"sm"}>
            Printing By: {bookingCoach?.order?.user?.userName}
          </Paragraph>
          <Paragraph size={"sm"}>Date & Time: {currentDateTime}</Paragraph>
        </div>
      </div>
      <InfoWrapper className="my-2" heading="Trip Sheet">
        {selectedTables.tripSheet && (
          <section className="-mx-2 mb-7">
            <div className="border rounded-md overflow-hidden">
              <Table className="overflow-hidden">
                <TableHeader>
                  <TableRow>
                    {["Registration No", "Driver","Driver Phone", "Guide","Guide Phone", "Helper", "Helper Phone"].map(
                      (header, index) => (
                        <TableHead
                          className="custom-table border-r !leading-4 text-center tracking-tight !text-xs"
                          key={index}
                        >
                          {header}
                        </TableHead>
                      )
                    )}
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
                    <TableCell className="custom-table border-r">{supervisor?.userName}</TableCell>
                    <TableCell className="custom-table border-r">{supervisor?.contactNo}</TableCell>
                    <TableCell className="custom-table border-r">{helper?.name}</TableCell>
                    <TableCell className="custom-table">{helper?.contactNo}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>
        )}

        {selectedTables.coachDetails && (
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
                      {route?.routeName}
                    </TableCell>
                    <TableCell className="custom-table border-r">
                      {fromCounter?.address}
                    </TableCell>
                    <TableCell className="custom-table border-r">
                      {destinationCounter?.address}
                    </TableCell>
                    <TableCell className="custom-table border-r">
                      {orderSeat?.length}
                    </TableCell>
                    <TableCell className="custom-table border-r">
                      {seatAvailable}
                    </TableCell>
                    <TableCell className="custom-table">
                      {departureDate}, {schedule}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>
        )}
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
                    <TableRow className="text-center border-r" key={index}>
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
      </InfoWrapper>
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