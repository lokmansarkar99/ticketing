import { Paragraph } from "@/components/common/typography/Paragraph";
import React from "react";

// Define types for the props
interface Seat {
  seat: string;
}

interface OrderDetails {
  customerName: string;
  phone: string;
  orderSeat: Seat[];
  user?: {
    userName: string;
  };
}

interface CounterData {
  counterName: string;
  totalSeat: number;
  totalAmount: number;
  commission: number;
  orderDetails: OrderDetails[];
}

interface CoachInfo {
  coachNo: string;
}

interface ReportData {
  data: {
    coachInfo: CoachInfo;
  };
}

interface TableActionsProps {
  ref: React.RefObject<HTMLDivElement>;
  title: string; // Title for the table
  filteredCounterData: CounterData;
  reportsData: ReportData;
  logo: string;
}

const PrintCounterReport: React.FC<TableActionsProps> = ({
  ref,
  title,
  filteredCounterData,
  reportsData,
  logo,
}) => {
  // Check if there is data to display
  const hasData =
    filteredCounterData &&
    filteredCounterData.orderDetails &&
    filteredCounterData.orderDetails.length > 0;
  return (
    <section
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
      }}
      className="flex flex-col justify-center items-center p-20"
    >
      {/* Client Section */}
      <header className="mb-6 text-center">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-32 h-auto mx-auto mb-4" />
        <Paragraph size={"sm"} className="font-bold pb-2">
          {title}
        </Paragraph>
      </header>

      {/* Conditional Rendering */}
      {hasData ? (
        <>
          {/* Expense Category Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Counter Name</th>
                  <th className="border px-4 py-2">Coach No</th>
                  <th className="border px-4 py-2">Total Seat</th>
                  <th className="border px-4 py-2">Total Taka</th>
                  <th className="border px-4 py-2">Commission (Tk)</th>
                  <th className="border px-4 py-2">Payable Amount (Tk)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="border px-4 py-2">
                    {filteredCounterData.counterName || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {reportsData?.data?.coachInfo?.coachNo || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {filteredCounterData.totalSeat || 0}
                  </td>
                  <td className="border px-4 py-2">
                    {filteredCounterData.totalAmount || 0}
                  </td>
                  <td className="border px-4 py-2">
                    {filteredCounterData.commission || 0}
                  </td>
                  <td className="border px-4 py-2">
                    {filteredCounterData.totalAmount -
                      filteredCounterData.commission || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Passenger Details */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Passenger Details</h3>
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Passenger Name</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Seats Booked</th>
                  <th className="border px-4 py-2">Sold By</th>
                </tr>
              </thead>
              <tbody>
                {filteredCounterData.orderDetails.map(
                  (order: OrderDetails, index: number) => (
                    <tr key={index} className="text-center">
                      <td className="border px-4 py-2">
                        {order.customerName || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {order.phone || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {order.orderSeat
                          .map((seat: Seat) => seat.seat)
                          .join(", ")}
                      </td>
                      <td className="border px-4 py-2">
                        {order.user?.userName || "N/A"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Paragraph size="sm" className="text-red-500 mt-6">
          There is nothing to print because no data is available.
        </Paragraph>
      )}
    </section>
  );
};

export default PrintCounterReport;
