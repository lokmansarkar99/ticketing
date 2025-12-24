import { Button } from "@/components/ui/button";

export const CancelSameTicket = ({
  seats,
  setSelectedTicket,
  setOpenCancelModal,
  handleCancelTicket,
}: any) => {
  const handleSeatSelection = (seatId: number) => {
    if (seatId) {
      setSelectedTicket(seatId);
      setOpenCancelModal(false);
    }
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
                From Station
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                End Station
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                CANCEL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-[#1f2128]">
            {seats?.map((ticket: any) => {
              return (
                <tr key={ticket.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    {ticket.seat}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    {ticket.order.ticketNo}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    {ticket?.fromStation?.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    {ticket?.toStation?.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <Button
                      onClick={() => {
                        handleSeatSelection(ticket?.orderId);
                        handleCancelTicket(ticket);
                      }}
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
