import { FC } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
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
import PdfStatusReport from "../../pdf/PdfStatus";
import StatusExel from "../../exel/StatusExel";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";

interface IStatus {
  bookingCoach: any;
}

interface StatusData {
  counterId: number;
  counterName: string;
  orderBy: string;
  phone: string;
  bookedCount: number;
  bookedSeat: string[];
  soldCount: number;
  soldSeat: string[];
}

const Status: FC<IStatus> = ({ bookingCoach }) => {
  const { translate } = useCustomTranslator();
  const { CounterBookedSeat, orderSeat } = bookingCoach;
  const result: StatusData[] = [];
  const { data: singleCms } = useGetSingleCMSQuery(
    {}
  );


  orderSeat?.filter((s:any)=>s.status==="Success")?.forEach((item: any) => {
    if (item.order.counterId) {
      const findStatus = result.find(
        (i) => i.counterId === item.order.counterId
      );
      if (findStatus) {
        findStatus.soldCount += 1;
        findStatus.soldSeat.push(item.seat);
      } else {
        result.push({
          counterId: item.order.counterId,
          counterName: item.order.counter.name,
          orderBy: item.order.user.userName,
          phone: item.order.user?.contactNo,
          bookedCount: 0,
          bookedSeat: [],
          soldCount: 1,
          soldSeat: [item.seat],
        });
      }
    }
  });

  CounterBookedSeat.forEach((item: any) => {
    if (item.counter.id) {
      const findStatus = result.find((i) => i.counterId === item.counter.id);
      if (findStatus) {
        findStatus.bookedCount += 1;
        findStatus.bookedSeat.push(item.seat);
      } else {
        result.push({
          counterId: item.counter.id,
          counterName: item.counter.name,
          orderBy: item.user?.userName,
          phone: item.user?.contactNo,
          bookedCount: 1,
          bookedSeat: [item.seat],
          soldCount: 0,
          soldSeat: [],
        });
      }
    }
  });


  return (
    <div>
      <ul className="flex space-x-3 w-full">
        <li>
          <StatusExel result={result} />
        </li>

        <li>
          <PDFDownloadLink
            document={<PdfStatusReport result={result} singleCms={singleCms}/>}
            fileName="counter_booking_status_report.pdf"
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
                  size="xs"
                >
                  <Loader /> Pdf
                </Button>
              ) : (
                <Button variant="destructive" size="xs">
                  Pdf
                </Button>
              );
            }}
          </PDFDownloadLink>
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
              <TableHeader>
                <TableRow>
                  {[
                    translate("কাউন্টারের নাম", "Counter Name"),
                    translate("অর্ডার করেছেন", "Ordered By"),
                    translate("ফোন", "Phone"),
                    translate("বুকড সংখ্যা", "Booked Count"),
                    translate("বুকড সিট নম্বর", "Booked Seat No."),
                    translate("বিক্রি সংখ্যা", "Sold Count"),
                    translate("বিক্রি সিট নম্বর", "Sold Seat No."),
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
                {result.length > 0 &&
                  result.map((status, index) => (
                    <TableRow className="text-center border-r" key={index}>
                      <TableCell className="custom-table border-r">
                        {status.counterName}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {status.orderBy}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {status.phone}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {status.bookedCount}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {status.bookedSeat.join(", ")}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {status.soldCount}
                      </TableCell>
                      <TableCell className="custom-table">
                        {status.soldSeat.join(", ")}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </InfoWrapper>
    </div>
  );
};

export default Status;