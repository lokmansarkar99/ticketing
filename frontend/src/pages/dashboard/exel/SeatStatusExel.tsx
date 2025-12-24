// import { Button } from "@/components/ui/button";
// import { CSVLink } from "react-csv";
// import { appConfiguration } from "@/utils/constants/common/appConfiguration";

// interface ISeatStatusReport {
//   counterId: number;
//   counterName: string;
//   orderBy: string;
//   cancelBy?: string;
//   soldSeat?: string;
//   bookSeat?: string;
//   passengerName?: string;
//   passengerPhone?: string;
//   fare: number;
//   discount: number;
//   createdDate: Date;
// }

// interface SeatStatusExelProps {
//   result: ISeatStatusReport[];
// }

// const SeatStatusExel: React.FC<SeatStatusExelProps> = ({ result }) => {
//   // Format data for the CSV file
//   const formattedData = result.map((item) => ({
//     "Counter ID": item?.counterId,
//     "Counter Name": item?.counterName,
//     "Ordered By": item?.orderBy,
//     "Booked Seat": item?.bookSeat,
//     "Sold Seat": item?.soldSeat,
//     "Passenger Name": item?.passengerName,
//     "Passenger Phone": item?.passengerPhone,
//     Fare: item?.fare || 0,
//     Discount: item?.discount || 0,
//     "Created Date": item?.createdDate.toLocaleString(),
//   }));

//   return (
//     <CSVLink
//       data={formattedData}
//       filename={`${appConfiguration.appName}_SeatStatusReport.csv`}
//       className="text-sm"
//     >
//       <Button variant="outline" size="sm">
//         Export to Excel
//       </Button>
//     </CSVLink>
//   );
// };

// export default SeatStatusExel;


import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { format } from "date-fns";
import { ISeatStatusReport } from "../counterRole/tickit/SeatStatus";

// interface ISeatStatusReport {
//   counterId: number;
//   counterName: string;
//   orderedBy: string;
//   cancelBy?: string;
//   soldSeat?: number;
//   bookedSeat?: number;
//   returnSeat?: number;
//   migrateSeat?: {
//     date?: string;
//     seat?: string;
//     coach?: string;
//     jurneyDate?: string;
//   };
//   passengerName?: string;
//   passengerPhone?: string;
//   fare: number;
//   discount: number;
//   createdDate: Date;
// }
// interface Imigrate {
//   date: string;
//   seat: string;
//   coach: string;
//   jurneyDate: string;
// }

// export interface ISeatStatusReport {
//   counterId: number;
//   counterName: string;
//   orderBy: string;
//   cancelBy?: string;
//   soldSeat?: string;
//   bookSeat?: string;
//   passengerName?: string;
//   passengerPhone?: string;
//   returnSeat: string;
//   fare: number;
//   discount: number;
//   createdDate: Date;
//   migrateSeat?: Imigrate;
// }

interface SeatStatusExelProps {
  result: ISeatStatusReport[];
}

const SeatStatusExel: React.FC<SeatStatusExelProps> = ({ result }) => {
  // Totals
  const totalSold = result?.reduce((sum, row) => sum + (row.soldSeat ? 1 : 0), 0);
  const totalBooked = result?.reduce((sum, row) => sum + (row.bookSeat ? 1 : 0), 0);
  const totalReturn = result?.reduce((sum, row) => sum + (row.returnSeat ? 1 : 0), 0);
  const totalFare = result?.reduce((sum, row) => sum + (row.fare || 0), 0) || 0;
  const totalDiscount = result?.reduce((sum, row) => sum + (row.discount || 0), 0) || 0;
  const netAmount = totalFare - totalDiscount;

  // Format data for the CSV file
  const formattedData = result.map((row) => ({
    "Counter Name": row.counterName,
    "Ordered By": row.orderBy,
    "Cancel By": row.cancelBy || "-",
    "Sold Seat": row.soldSeat || 0,
    "Booked Seat": row.bookSeat || 0,
    "Return Seat": row.returnSeat || 0,
    "Migration Date": row.migrateSeat?.date || "-",
    "Migration Seat": row.migrateSeat?.seat || "-",
    "Migration Coach": row.migrateSeat?.coach || "-",
    "Journey Date": row.migrateSeat?.jurneyDate || "-",
    "Passenger Name": row.passengerName || "-",
    "Passenger Phone": row.passengerPhone || "-",
    "Fare (৳)": row.fare?.toFixed(2),
    "Discount (৳)": row.discount?.toFixed(2),
    "Time": row.createdDate
      ? format(new Date(row.createdDate), "M/d/yy, h:mm a")
      : "N/A",
  }));

  // Add totals row at the end
  formattedData.push({
    "Counter Name": "Total",
    "Ordered By": "-",
    "Cancel By": "-",
    "Sold Seat": totalSold,
    "Booked Seat": totalBooked,
    "Return Seat": totalReturn,
    "Migration Date": "-",
    "Migration Seat": "-",
    "Migration Coach": "-",
    "Journey Date": "-",
    "Passenger Name": "-",
    "Passenger Phone": "-",
    "Fare (৳)": totalFare.toFixed(2),
    "Discount (৳)": totalDiscount.toFixed(2),
    "Time": `Net Amount: ${netAmount.toFixed(2)}৳`,
  });

  return (
    <CSVLink
      data={formattedData}
      filename={`${appConfiguration.appName}_SeatStatusReport.csv`}
      className="text-sm"
    >
      <Button variant="outline" size="sm">
        Export to Excel
      </Button>
    </CSVLink>
  );
};

export default SeatStatusExel;
