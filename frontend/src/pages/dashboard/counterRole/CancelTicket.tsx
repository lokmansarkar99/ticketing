
import { getAmountInBookingFromByClass } from "@/utils/helpers/getAmountInBookingFromByClass";
import { FC } from "react";

interface cancelTicketProps {
  bookingCoach: any;
  cancelTickets: any;
  stationId: any;
  setSelectedIds: any;
  selectedIds: any;
}
const CancelTicket: FC<cancelTicketProps> = ({
  cancelTickets,
  setSelectedIds,
  selectedIds,
  bookingCoach,
}) => {
  const totalSeats = selectedIds.length;
  const stationId = cancelTickets?.[0];

  const handleSeatSelection = (seatId: number) => {
    setSelectedIds((prev: any) =>
      prev.includes(seatId)
        ? prev.filter((id: any) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const dynamicStation = {
    fromStationId: stationId?.fromStation?.id,
    toStationId: stationId?.toStation?.id,
  };
  const selectedTickets = cancelTickets?.filter((ticket: any) =>
    selectedIds.includes(ticket.id)
  );

  const totalFare = selectedTickets.reduce((acc: number, ticket: any) => {
    let fare = 0;

    // Special handling for S_Class with L/U seats
    if (bookingCoach?.coach?.coachClass === "S_Class") {
      // Flatten all segment fares once
      const segmentFares =
        bookingCoach?.coach?.route?.Segment?.flatMap(
          (seg: any) => seg?.SegmentFare || []
        ) || [];

      // Find the matching fare object
      const fareData = segmentFares.find(
        (f: any) =>
          f.fromStationId === stationId?.fromStation?.id &&
          f.toStationId === stationId?.toStation?.id
      );

      if (ticket.seat.startsWith("L")) {
        fare = fareData?.b_class_amount ?? 0;
      } else if (ticket.seat.startsWith("U")) {
        fare = fareData?.sleeper_class_amount ?? 0;
      } else {
        fare = getAmountInBookingFromByClass(
          bookingCoach.coach,
          bookingCoach.coach.coachType,
          bookingCoach.coach.coachClass,
          dynamicStation
        );
      }
    } else {
      // Default case for other classes
      fare = getAmountInBookingFromByClass(
        bookingCoach.coach,
        bookingCoach.coach.coachType,
        bookingCoach.coach.coachClass,
        dynamicStation
      );
    }

    return acc + fare;
  }, 0);

  const totalDiscount =
    selectedTickets.length * (Number(bookingCoach.discount) || 0);

const handleSeatNo = (ticketNo: string) => {
  // 1. Save ticket number
  localStorage.setItem("pendingQuickSearch", ticketNo);

  // 2. Trigger global event to open modal + search
  window.dispatchEvent(new CustomEvent("openQuickTicketSearch"));
};

  return (
    <div>
      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-[#1f2128]">
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                SEAT NO
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                TICKET NO
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                FARE (TAKA)
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                DISCOUNT
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                CANCELLATION CHARGE
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                CANCEL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-[#1f2128]">
            {cancelTickets?.map((ticket: any) => {
              // Flatten SegmentFare arrays once per render (for this ticket)
              const segmentFares =
                bookingCoach?.coach?.route?.Segment?.flatMap(
                  (seg: any) => seg?.SegmentFare || []
                ) || [];

              // Find the matching fare data
              const fareData = segmentFares.find(
                (f: any) =>
                  f.fromStationId === dynamicStation?.fromStationId &&
                  f.toStationId === dynamicStation?.toStationId
              );

              // Determine fare based on seat and class
              let fare = 0;
              if (bookingCoach?.coach?.coachClass === "S_Class") {
                if (ticket.seat.startsWith("L")) {
                  fare = fareData?.b_class_amount ?? 0;
                } else if (ticket.seat.startsWith("U")) {
                  fare = fareData?.sleeper_class_amount ?? 0;
                } else {
                  fare = getAmountInBookingFromByClass(
                    bookingCoach.coach,
                    bookingCoach.coach.coachType,
                    bookingCoach.coach.coachClass,
                    dynamicStation
                  );
                }
              } else {
                fare = getAmountInBookingFromByClass(
                  bookingCoach.coach,
                  bookingCoach.coach.coachType,
                  bookingCoach.coach.coachClass,
                  dynamicStation
                );
              }

              return (
                <tr key={ticket.id}>
                  <td className="px-4 py-2 whitespace-nowrap">{ticket.seat}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {ticket.order.ticketNo}
                    <button
                      onClick={() => handleSeatNo(ticket?.order?.ticketNo)}
                      className="bg-primary px-1 text-white rounded-lg ml-1"
                      type="button"
                    >
                      Print
                    </button>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{fare}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {bookingCoach?.discount}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">0.0</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(ticket.id)}
                      onChange={() => handleSeatSelection(ticket.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-100 dark:bg-[#1f2128]">
            <tr>
              <td className="px-4 py-2 text-center font-semibold">Total</td>
              <td></td>
              <td className="px-4 py-2 text-center font-semibold">
                {totalFare.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center font-semibold">
                {totalDiscount.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center font-semibold">0.0</td>
              <td className="px-4 py-2 text-center font-semibold">
                {totalSeats}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CancelTicket;
