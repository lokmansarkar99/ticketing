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
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FC, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import PdfSeatStatusReport from "../../pdf/PdfSeatStatus";
import SeatStatusExel from "../../exel/SeatStatusExel";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import formatter from "@/utils/helpers/formatter";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useReactToPrint } from "react-to-print";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import SeatStatusPrint from "../../printLabel/SeatStatusPrint";

interface ISeatStatus {
  bookingCoach: any;
}

interface Imigrate {
  date: string;
  seat: string;
  coach: string;
  jurneyDate: string;
}

export interface ISeatStatusReport {
  counterId: number;
  counterName: string;
  orderBy: string;
  cancelBy?: string;
  soldSeat?: string;
  bookSeat?: string;
  passengerName?: string;
  passengerPhone?: string;
  returnSeat: string;
  fare: number;
  discount: number;
  createdDate: Date;
  migrateSeat?: Imigrate;
}

const SeatStatus: FC<ISeatStatus> = ({ bookingCoach }) => {
  const { name: currentUser } = shareAuthentication()
  const { translate } = useCustomTranslator();
  const { CounterBookedSeat, orderSeat } = bookingCoach;
  const { data: singleCms } = useGetSingleCMSQuery(
    {}
  );
  
  const printSaleRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_seat_status_report`,
  });

  const result: ISeatStatusReport[] = [];


  orderSeat?.filter((s:any)=>s.status==="Success")?.forEach((item: any) => {
    if (item.order.counterId) {
      result.push({
        counterId: item?.order?.counterId,
        counterName: item?.order?.counter?.name,
        orderBy: item?.order?.user?.userName,
        bookSeat: "",
        soldSeat: item?.seat,
        fare: item?.fare,
        discount: item?.discount,
        createdDate: new Date(item.createdAt),
        passengerName: item?.order?.customerName,
        passengerPhone: item?.order?.phone,
        returnSeat: "",
        migrateSeat: {
          date: item?.migrateSeat?.createdAt,
          seat: item?.migrateSeat?.seat,
          coach: item?.migrateSeat?.order?.coachConfig?.coach?.coachNo,
          jurneyDate: item?.migrateSeat?.order?.coachConfig?.departureDate,
        }
      });
    }
  });
  orderSeat?.filter((s:any)=>s.status==="Cancelled")?.forEach((item: any) => {
    if (item.order.counterId) {
      result.push({
        counterId: item?.order?.counterId,
        counterName: item?.order?.counter?.name,
        orderBy: item?.order?.user?.userName,
        bookSeat: "",
        soldSeat: "",
        cancelBy:item?.cancelByUser?.userName,
        fare: item?.fare,
        discount: item?.discount,
        createdDate: new Date(item.createdAt),
        passengerName: item?.order?.customerName,
        passengerPhone: item?.order?.phone,
        returnSeat: item?.seat,
        migrateSeat: {
          date: item?.migrateSeat?.createdAt,
          seat: item?.migrateSeat?.seat,
          coach: item?.migrateSeat?.order?.coachConfig?.coach?.coachNo,
          jurneyDate: item?.migrateSeat?.order?.coachConfig?.departureDate,
        }
      });
    }
  });
  orderSeat?.filter((s:any)=>s.status==="Migrate")?.forEach((item: any) => {
    if (item.order.counterId) {
      result.push({
        counterId: item?.order?.counterId,
        counterName: item?.order?.counter?.name,
        orderBy: item?.order?.user?.userName,
        bookSeat: "",
        soldSeat: "",
        cancelBy:item?.cancelByUser?.userName,
        fare: item?.fare,
        discount: item?.discount,
        createdDate: new Date(item.createdAt),
        passengerName: item?.order?.customerName,
        passengerPhone: item?.order?.phone,
        returnSeat: item?.seat,
        migrateSeat: {
          date: item?.migrateSeat?.createdAt,
          seat: item?.migrateSeat?.seat,
          coach: item?.migrateSeat?.order?.coachConfig?.coach?.coachNo,
          jurneyDate: item?.migrateSeat?.order?.coachConfig?.departureDate,
        }
      });
    }
  });

  CounterBookedSeat.forEach((item: any) => {
    if (item.counter.id) {
      result.push({
        counterId: item.counter.id,
        counterName: item.counter.name,
        orderBy: item.user.userName,
        bookSeat: item.seat,
        soldSeat: "",
        fare: 0,
        returnSeat: "",
        discount: 0,
        createdDate: item.counter.createdAt,
        passengerName: "",
        passengerPhone: "",
      });
    }
  });

  return (
    <div>
      <ul className="flex space-x-3 w-full">
        <li>
          <SeatStatusExel result={result} />
        </li>

        <li>
          <PDFDownloadLink
            document={<PdfSeatStatusReport result={result} singleCms={singleCms} userName={currentUser} />}
            fileName="seat_status_report.pdf"
          >

            {
              //@ts-ignore
              (params) => {
                const { loading } = params;
                return loading ? (
                  <Button
                    disabled
                    className="transition-all duration-150"
                    variant="destructive"
                    size="sm"
                  >
                    <Loader /> Export To Pdf
                  </Button>
                ) : (
                  <Button variant="destructive" size="sm">
                    Export To Pdf
                  </Button>
                );
              }}
          </PDFDownloadLink>
        </li>
        <li>
          <Button onClick={handlePrint} variant="destructive">
            Print
          </Button>
        </li>
      </ul>
      <InfoWrapper
        className="my-2"
        heading={translate("কাউন্টারের অবস্থা", "Counter Booking Status")}
      >
        <section className="-mx-2">
          <div className="border rounded-md overflow-hidden">
            <Table className="overflow-hidden">
              <TableCaption className="mt-0 border-t">
                {translate(
                  "বর্তমান কাউন্টার বুকিং এবং বিক্রয় অবস্থা",
                  "Current counter booking and sales status"
                )}
              </TableCaption>
              {/* first table head start  */}
              <TableHeader>
                <TableRow>
                  {[
                    translate("কাউন্টারের নাম", "Counter Name"),
                    translate("অর্ডার করেছেন", "Ordered By"),
                    translate("বাতিল করেছেন", "Cancel By"),
                    translate("সিট", "Seat"),
                    translate("মাইগ্রেশন হিস্ট্রি", "Migration History"),
                    // translate("বুকড সিট নম্বর", "Booked Seat No."),
                    // translate("বিক্রি সিট নম্বর", "Sold Seat No."),
                    translate("যাত্রী নাম", "Passenger Name"),
                    translate("যাত্রী ফোন", "Passenger Phone"),
                    translate("ভাড়া", "Fare"),
                    translate("ডিসকাউন্ট", "Discount"),
                    translate("সময়", "Time"),
                  ].map((header, index) => {
                    let colSpan = 1;
                    if (header === "সিট" || header === "Seat") {
                      colSpan = 3;
                    } else if (header === "মাইগ্রেশন হিস্ট্রি" || header === "Migration History") {
                      colSpan = 4;
                    }
                    return (
                      <TableHead
                        className="custom-table border-r !leading-4 text-center tracking-tight !text-xs"
                        key={index}
                        colSpan={colSpan}
                      >
                        {header}
                      </TableHead>
                    )
                  })}
                </TableRow>
              </TableHeader>
              {/* first table head end  */}

              {/* second table head start  */}
              <TableHeader>
                <TableRow>
                  {[
                    "empty 3 calls",
                    translate("অর্ডার করেছেন", "Sold"),
                    translate("বাতিল করেছেন", "Booked"),
                    translate("সিট", "Return"),
                    translate("মাইগ্রেশন হিস্ট্রি", "Migration Date"),
                    translate("বুকড সিট নম্বর", "Seat"),
                    translate("বিক্রি সিট নম্বর", "Coach"),
                    translate("যাত্রী নাম", "Journey Date"),
                    "empty 5 calls",
                  ].map((header, index) => {
                    let colSpan = 1;
                    if (header === "empty 3 calls") {
                      colSpan = 3;
                    } else if (header === "empty 5 calls") {
                      colSpan = 5;
                    }
                    return (
                      <TableHead
                        className="custom-table border-r !leading-4 text-center tracking-tight !text-xs"
                        key={index}
                        colSpan={colSpan}
                      >
                        {
                          header === "empty 3 calls" || header === "empty 5 calls" ? "" : header
                        }
                      </TableHead>
                    )
                  })}
                </TableRow>
              </TableHeader>
              {/* second table head end  */}

              <TableBody>
                {result.length > 0 &&
                  result.map((status, index) => (
                    <TableRow className="text-center border-r" key={index}>
                      {/* Counter Name */}
                      <TableCell className="custom-table border-r">
                        {status.counterName}
                      </TableCell>
                      {/* Order By */}
                      <TableCell className="custom-table border-r">
                        {status.orderBy}
                      </TableCell>
                      {/* Cancel By */}
                      <TableCell className="custom-table border-r">
                        {status.cancelBy}
                      </TableCell>

                      {/* seat start  ************************************/}
                      <TableCell className="custom-table border-r">
                        {status?.soldSeat}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {status?.bookSeat}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {status?.returnSeat}
                      </TableCell>
                      {/* seat end  ************************************/}

                      {/* Migration History start ************************************/}
                      <TableCell className="custom-table border-r">
                        {
                         status?.migrateSeat?.date?  formatter({ type: "date&time", dateTime: status?.migrateSeat?.date }):""
                        }
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {status?.migrateSeat?.seat}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {status?.migrateSeat?.coach}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {status?.migrateSeat?.jurneyDate}
                      </TableCell>
                      {/* Migration History end ************************************/}

                      {/* passengerName */}
                      <TableCell className="custom-table border-r">
                        {status?.passengerName}
                      </TableCell>

                      {/* passengerPhone */}
                      <TableCell className="custom-table border-r">
                        {status?.passengerPhone}
                      </TableCell>

                      {/* Seat Fare */}
                      <TableCell className="custom-table border-r">
                        {status?.fare}
                      </TableCell>

                      {/* Discount */}
                      <TableCell className="custom-table border-r">
                        {status?.discount}
                      </TableCell>

                      {/* Time */}
                      <TableCell className="custom-table">
                        {status?.createdDate
                          ? formatter({ type: "date&time", dateTime: status.createdDate })
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}

                {/* ===== Summary Row ===== */}
                {result.length > 0 && (
                  <TableRow className="text-center font-bold bg-gray-100">
                    <TableCell className="custom-table border-r" colSpan={3}>
                      Total
                    </TableCell>

                    {/* Sold Total */}
                    <TableCell className="custom-table border-r">
                      {result.reduce((acc, curr) => acc + (curr.soldSeat ? 1 : 0), 0)}
                    </TableCell>

                    {/* Booked Total */}
                    <TableCell className="custom-table border-r">
                      {result.reduce((acc, curr) => acc + (curr.bookSeat ? 1 : 0), 0)}
                    </TableCell>

                    {/* Return - leave empty */}
                    <TableCell className="custom-table border-r"></TableCell>

                    {/* Migration total */}
                    <TableCell className="custom-table border-r" colSpan={4}>
                      Total Migrate Seats:
                      {result.reduce((acc, curr) => acc + (curr.migrateSeat?.seat ? 1 : 0), 0)}
                    </TableCell>

                    {/* Passenger name + phone (skip colSpan=2) */}
                    <TableCell className="custom-table border-r" colSpan={2}></TableCell>

                    {/* Fare Total */}
                    <TableCell className="custom-table border-r">
                      {result.reduce((acc, curr) => acc + (curr.fare || 0), 0)}
                    </TableCell>

                    {/* Discount Total */}
                    <TableCell className="custom-table border-r">
                      {result.reduce((acc, curr) => acc + (curr.discount || 0), 0)}
                    </TableCell>

                    {/* Time col - leave empty */}
                    <TableCell className="custom-table">
                      Net Amount:
                      {
                        result.reduce((acc, curr) => acc + (curr.fare || 0), 0) - result.reduce((acc, curr) => acc + (curr.discount || 0), 0)
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </div>
        </section>
      </InfoWrapper>

      {/* for print  */}
      <div className="invisible hidden -left-full">
        {result.length > 0 && (
          <SeatStatusPrint
            ref={printSaleRef}
            categoryData={result as ISeatStatusReport[] || []}
            logo={singleCms?.data}
          />
        )}
      </div>
    </div>
  );
};

export default SeatStatus;
