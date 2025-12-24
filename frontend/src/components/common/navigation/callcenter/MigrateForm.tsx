import { getAmountInBookingFromByClass } from "@/utils/helpers/getAmountInBookingFromByClass";
import { ArrowBigRight } from "lucide-react";
import { FC } from "react";

interface MigrateTicketProps {
  bookingCoach: any;
  migrateCoach: any;
  migrateTickets: any;
  bookingStationId: any;
  migrateStationId: any;
  setSelectedIds: any;
  selectedIds: any;
  selectedSeats: any;
}

const MigrateTicket: FC<MigrateTicketProps> = ({
  migrateTickets,
  setSelectedIds,
  selectedIds,
  bookingCoach,
  migrateCoach,
  // bookingStationId,
  // migrateStationId,
  selectedSeats,
}) => {
  const handleSeatSelection = (seatId: number) => {
    setSelectedIds((prev: any) =>
      prev.includes(seatId)
        ? prev.filter((id: any) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const selectedTickets = migrateTickets?.filter((ticket: any) =>
    selectedIds.includes(ticket.id)
  );

  const migrateSeats = selectedSeats.filter(
    (seat: any) => seat.coachType === "migrate"
  );

  // Pair old seats with new seats (assuming one-to-one mapping)
  const pairedSeats = selectedTickets.map((ticket: any, index: number) => ({
    oldSeat: ticket,
    newSeat: migrateSeats[index] || null, // Pair with corresponding new seat or null if not available
  }));

  const totalFare = pairedSeats.reduce(
    (acc: number, pair: { oldSeat: any; newSeat: any }) => {
      let oldFare = 0;
      let newFare = 0;

      // --- OLD SEAT FARE ---
      if (pair.oldSeat) {
        oldFare = Number(pair.oldSeat.fare ?? pair.oldSeat.unitPrice ?? 0);
      }

      // --- NEW SEAT FARE ---
      if (pair.newSeat) {
        newFare = Number(pair.newSeat.currentAmount ?? 0);

        // Optional fallback if currentAmount is missing or 0
        if (!newFare && pair.newSeat.coach && pair.newSeat.coachType) {
          newFare = getAmountInBookingFromByClass(
            pair.newSeat.coach,
            pair.newSeat.coachType,
            pair.newSeat.coachClass,
            {
              fromStationId: pair.oldSeat?.fromStation?.id,
              destinationStationId: pair.oldSeat?.toStation?.id,
            }
          );
        }
      }

      // Use newFare if available, otherwise oldFare
      return acc + (newFare || oldFare);
    },
    0
  );

  const totalDiscount = pairedSeats.reduce(
    (acc: number, pair: { oldSeat: any; newSeat: any }) => {
      const oldDiscount = Number(bookingCoach?.discount) || 0;
      const newDiscount = pair.newSeat
        ? Number(migrateCoach?.discount) || 0
        : 0;
      return acc + (newDiscount || oldDiscount); // Use newDiscount if new seat exists
    },
    0
  );


  return (
    <div>
      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-[#1f2128]">
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Old Seat
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                <ArrowBigRight />
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                New Seat
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                FARE (TAKA)
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                DISCOUNT
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                M. Confirm
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-[#1f2128]">
            {pairedSeats.map(
              (pair: { oldSeat: any; newSeat: any }, index: number) => {
                let oldFare = 0;
                let newFare = 0;
                let oldDiscount = 0;
                let newDiscount = 0;

                // --- OLD SEAT LOGIC ---
                if (pair.oldSeat) {
                  if (pair.oldSeat.fare) {
                    oldFare = pair.oldSeat.fare;
                  } else if (pair.oldSeat.unitPrice) {
                    oldFare = pair.oldSeat.unitPrice;
                  }

                  // If discount available in old booking
                  oldDiscount = Number(pair.oldSeat?.order?.discount || 0);
                }

                // --- NEW SEAT LOGIC ---
                if (pair.newSeat) {
                  // Use computed fare if available
                  newFare = Number(pair.newSeat.currentAmount ?? 0);
                  newDiscount = Number(pair.newSeat.previousAmount ?? 0);

                  // If for some reason currentAmount is 0, fallback to calculation
                  if (
                    newFare === 0 &&
                    pair.newSeat.coachType &&
                    pair.newSeat.coachConfigId
                  ) {
                    // Fallback logic (optional)
                    newFare = getAmountInBookingFromByClass(
                      pair.newSeat.coach,
                      pair.newSeat.coachType,
                      pair.newSeat.coachClass,
                      {
                        fromStationId: pair.oldSeat?.fromStation?.id,
                        destinationStationId: pair.oldSeat?.toStation?.id,
                      }
                    );
                  }
                }

                return (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      {pair.oldSeat?.seat ?? "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      <ArrowBigRight />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      {pair.newSeat ? pair.newSeat.seat : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      {(pair.newSeat ? newFare : oldFare).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      {(pair.newSeat ? newDiscount : oldDiscount).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(pair.oldSeat.id)}
                        onChange={() => handleSeatSelection(pair.oldSeat.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
          <tfoot className="bg-gray-100 dark:bg-[#1f2128]">
            <tr>
              <td className="px-4 py-2 text-center font-semibold">Total</td>
              <td></td>
              <td></td>
              <td className="px-4 py-2 text-center font-semibold">
                {totalFare.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center font-semibold">
                {totalDiscount.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center font-semibold">
                {selectedIds.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default MigrateTicket;
