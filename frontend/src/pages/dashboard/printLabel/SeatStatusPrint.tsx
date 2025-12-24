import React from "react";
import { Paragraph } from "@/components/common/typography/Paragraph";
import { format } from "date-fns";

interface ISeatStatusPrintProps {
  categoryData: any;
  logo: { companyLogoBangla: string };
}

const SeatStatusPrint = React.forwardRef<HTMLDivElement, ISeatStatusPrintProps>(
  ({ categoryData, logo }, ref) => {
    const currentDate = format(new Date(), "MMMM dd, yyyy");

    // Totals
    const totalSold = categoryData?.reduce((sum: number, row: any) => sum + (row.soldSeat ? 1 : 0), 0) || 0;
    const totalBooked = categoryData?.reduce((sum: number, row: any) => sum + (row.bookedSeat || 0), 0) || 0;
    const totalReturn = categoryData?.reduce((sum: number, row: any) => sum + (row.returnSeat || 0), 0) || 0;
    const totalFare = categoryData?.reduce((sum: number, row: any) => sum + (row.fare || 0), 0) || 0;
    const totalDiscount = categoryData?.reduce((sum: number, row: any) => sum + (row.discount || 0), 0) || 0;

    return (
      <section
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
        }}
        className="flex flex-col justify-center items-center"
      >
        {/* Header */}
        <header className="mb-6 text-center">
          <img
            src={logo?.companyLogoBangla}
            alt="Logo"
            className="w-32 h-auto mx-auto mb-4"
          />
          <Paragraph size={"sm"} className="font-bold pb-2">
            Seat Status Report
          </Paragraph>
          <Paragraph size={"sm"}>Date: {currentDate}</Paragraph>
        </header>

        {/* Table */}
        <div className="w-full px-6">
          <table className="table-auto w-full border-collapse border border-black text-sm">
            <thead>
              {/* Row 1 */}
              <tr>
                <th rowSpan={2} className="border border-black px-2 py-1">Counter Name</th>
                <th rowSpan={2} className="border border-black px-2 py-1">Ordered By</th>
                <th rowSpan={2} className="border border-black px-2 py-1">Cancel By</th>

                <th colSpan={3} className="border border-black px-2 py-1">Seat</th>
                <th colSpan={4} className="border border-black px-2 py-1">Migration History</th>

                <th rowSpan={2} className="border border-black px-2 py-1">Passenger Name</th>
                <th rowSpan={2} className="border border-black px-2 py-1">Phone</th>
                <th rowSpan={2} className="border border-black px-2 py-1">Fare</th>
                <th rowSpan={2} className="border border-black px-2 py-1">Discount</th>
                <th rowSpan={2} className="border border-black px-2 py-1">Time</th>
              </tr>
              {/* Row 2 */}
              <tr>
                <th className="border border-black px-2 py-1">Sold</th>
                <th className="border border-black px-2 py-1">Booked</th>
                <th className="border border-black px-2 py-1">Return</th>

                <th className="border border-black px-2 py-1">Migration Date</th>
                <th className="border border-black px-2 py-1">Seat</th>
                <th className="border border-black px-2 py-1">Coach</th>
                <th className="border border-black px-2 py-1">Journey Date</th>
              </tr>

            </thead>
            <tbody>

              {categoryData?.map((row: any, index: number) => (
                <tr key={index} className="text-sm">
                  <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">{row.counterName}</td>
                  <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">{row.orderedBy}</td>
                  <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">{row.cancelBy}</td>

                  <td className="border border-black px-2 py-1">{row.soldSeat}</td>
                  <td className="border border-black px-2 py-1">{row.bookedSeat}</td>
                  <td className="border border-black px-2 py-1">{row.returnSeat}</td>
                  <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">{row?.migrateSeat?.date}</td>
                  <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">{row?.migrateSeat?.seat}</td>
                  <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">{row?.migrateSeat?.coach}</td>
                  <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">{row?.migrateSeat?.jurneyDate}</td>

                  <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">{row.passengerName}</td>
                  <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">{row.passengerPhone}</td>
                  <td className="border border-black px-2 py-1">{row.fare?.toFixed(2)}৳</td>
                  <td className="border border-black px-2 py-1">{row.discount?.toFixed(2)}৳</td>
                  <td className="border border-black px-2 py-1">
                    {row.createdDate ? format(new Date(row.createdDate), "M/d/yy, h:mm a") : "N/A"}
                  </td>
                </tr>
              ))}

              {/* Totals */}
              <tr className="font-bold">
                <td className="border border-black px-2 py-1" colSpan={3}>Total</td>
                <td className="border border-black px-2 py-1">{totalSold}</td>
                <td className="border border-black px-2 py-1">{totalBooked}</td>
                <td className="border border-black px-2 py-1">{totalReturn}</td>
                <td className="border border-black px-2 py-1" colSpan={4}>-</td>
                <td className="border border-black px-2 py-1" colSpan={2}>-</td>
                <td className="border border-black px-2 py-1">{totalFare.toFixed(2)}৳</td>
                <td className="border border-black px-2 py-1">{totalDiscount.toFixed(2)}৳</td>
                <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">
                  Net Amount: {(totalFare - totalDiscount).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  }
);

export default SeatStatusPrint;
