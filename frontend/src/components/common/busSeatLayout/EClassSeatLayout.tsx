import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import { useSelector } from "react-redux";
import PageTransition from "../effect/PageTransition";

interface ISeatLayoutProps {
  seatsAllocation: { left: any[]; right: any[]; lastRow: any[] };
  handleBookingSeat: (seatData: any, id: any) => void;
  handleCancelTicket: (seatData: any) => void;
  bookingFormState: any;
  addBookingSeatLoading: boolean;
  removeBookingSeatLoading: boolean;
  bookingCoach: any;
  coachId: any;
  bookedSeatList: any[];
}
// Helper function to get the seat color class based on status

const EClassSeatLayout: FC<ISeatLayoutProps> = ({
  seatsAllocation,
  handleBookingSeat,
  bookingFormState,
  addBookingSeatLoading,
  bookingCoach,
  coachId,
  bookedSeatList,
  handleCancelTicket,
}) => {
  const { translate } = useCustomTranslator();
  //
  const user = useSelector((state: any) => state.user);

  const getSeatColorClass = (
    seatName: string,
    selected: boolean,
    bookingCoach: any,
    coachId: any
  ) => {
    // Check if seat is booked (previously `orderSeat`) from `bookedSeatList`
    const isBooked = (bookedSeatList ?? []).some(
      (entry: any) =>
        entry.coachConfigId === coachId && entry.seat.includes(seatName)
    );
    const order = bookingCoach?.orderSeat?.find(
      (order: any) => order.seat === seatName
    );
    const blockedSeat = bookingCoach?.bookingSeat?.find(
      (order: any) => order.seat === seatName
    );
    const bookedByCounter = bookingCoach?.CounterBookedSeat?.find(
      (order: any) => order.seat === seatName
    );

    // Counter booked seat logic
    if (bookedByCounter) {
      if (!user.id) {
        return "bg-red-700 text-white";
      } else if (bookedByCounter.counter.id === user.counterId) {
        return "bg-[#A3D1D5] text-white"; // Green for user's counter
      }
      return "bg-orange-500 text-white"; // Orange for others
    }

    // Blocked seat but not selected
    if (blockedSeat && !selected) {
      return "border-gray-800 bg-gray-800 text-white";
    }

    // Selected seat by user
    const isSeatSelected = bookingFormState?.selectedSeats?.some(
      (selectedSeat: any) =>
        selectedSeat.seat === seatName && selectedSeat?.coachConfigId === coachId
    );
    if (isSeatSelected) return "bg-[#00BFFF] text-white";

    // Previously it used `order?.order?.gender`, you might need to fetch this info differently now
    if (isBooked) {
      return order?.order?.gender === "Male"
        ? "bg-red-700 text-white"
        : "bg-[#BD06D3] text-white";
    }

    return "bg-white text-black"; // Available
  };

  const renderSeatButton = (seat: any) => {
    const isSelected = bookingFormState?.selectedSeats?.some(
      (selectedSeat: any) =>
        selectedSeat.seat === seat.seat &&
        selectedSeat.coachConfigId === coachId
    );

    // Pass coachId to getSeatColorClass for coach-specific color application
    const seatStatusClass = getSeatColorClass(
      seat.seat,
      isSelected,
      bookingCoach,
      coachId
    );

    // Check if the seat is ordered or booked by another counter
    const isOrdered = (bookedSeatList ?? [])?.some(
      (booked) =>
        booked.coachConfigId === coachId && booked.seat.includes(seat.seat)
    );

    const bookedByCounter = bookingCoach?.CounterBookedSeat?.find(
      (order: any) => order.seat === seat.seat
    );
    const isBookedByOtherCounter =
      bookedByCounter && bookedByCounter.counter.id !== user.counterId;
    const issueByCounter = bookingCoach?.orderSeat?.find(
      (order: any) => order.seat === seat.seat
    );
    // Determine if the seat should be disabled
    const shouldDisableSeat = !user.role // If user is not logged in or no role, disable for ordered/booked
      ? isOrdered || bookedByCounter
      : user.role?.toLowerCase() === "counter" ||
        user.role?.toLowerCase() === "callcenter"
      ? false // Allow all seats to be clickable for counters
      : isOrdered || isBookedByOtherCounter;

    // Tooltip message if the seat is booked by another counter
    const tooltipText = isBookedByOtherCounter
      ? `Name: ${bookedByCounter?.user?.userName}, Address: ${bookedByCounter?.counter?.address}, Phone:${bookedByCounter?.counter?.mobile}`
      : issueByCounter
      ? `Customer Name: ${
          issueByCounter?.order?.customerName
        }, Customer phone: ${issueByCounter?.order?.phone}, Counter: ${
          issueByCounter?.order?.user?.userName || "Online"
        }`
      : "";

    return (
      <TooltipProvider key={seat.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() =>
                seatStatusClass === "bg-red-700 text-white" ||
                seatStatusClass === "bg-[#BD06D3] text-white"
                  ? handleCancelTicket(seat)
                  : handleBookingSeat(seat, bookingCoach?.id)
              }
              className={cn(
                "text-foreground/50 hover:text-foreground/80  relative",
                (shouldDisableSeat || isBookedByOtherCounter) &&
                  "cursor-not-allowed" // Add a class if disabled
              )}
              disabled={shouldDisableSeat || isBookedByOtherCounter} // Disable based on conditions above
            >
              <div
                className={cn(
                  "w-[60px] h-[30px] border px-7 py-3 rounded-md flex items-center justify-center",
                  seatStatusClass,
                  bookingFormState?.targetedSeat === seat.id &&
                    addBookingSeatLoading &&
                    "animate-pulse"
                )}
              >
                <span className="text-sm font-semibold whitespace-nowrap">
                  {seat.seat}
                </span>
              </div>
            </button>
          </TooltipTrigger>
          {user.role && tooltipText && (
            <TooltipContent>{tooltipText}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };
  

  return (
    <div className="flex flex-col justify-center items-center w-full my-0 h-full mt-1 px-1 gap-x-12">
      <PageTransition className="w-full mb-1.5 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
        {/* Top Design */}
        <div className="w-full">
          <div>
            <h2 className="text-center pb-1">
              {bookingCoach?.coach?.coachClass === "E_Class" && "Economy"} Class
            </h2>
            <ul className="grid lg:grid-cols-3 px-1 pb-1 text-sm gap-x-2 items-center text-left gap-y-2">
              <li className="flex items-center gap-x-2">
                <span className="block size-4 bg-red-700 rounded-md"></span>
                <span>{translate("বিক্রয়কৃত (পুরুষ)", "Sold (Male)")}</span>
              </li>
              <li className="flex items-center gap-x-2">
                <span className="block size-4 bg-[#BD06D3] rounded-md"></span>
                <span>{translate("বিক্রয়কৃত (মহিলা)", "Sold (Fe)")}</span>
              </li>
              <li className="flex items-center gap-x-2">
                <span className="block size-4 bg-[#00BFFF] rounded-md"></span>
                <span>{translate("নির্বাচিত", "Selected")}</span>
              </li>
              <li className="flex items-center gap-x-2">
                <span className="block size-4 border-gray-800 bg-gray-800 rounded-md"></span>
                <span>{translate("প্রসেসিং", "Processing")}</span>
              </li>
              <li className="flex items-center gap-x-2">
                <span className="block size-4 bg-white text-black rounded-md"></span>
                <span>{translate("ব্যবহারযোগ্য", "Availabe")}</span>
              </li>
              <li className="flex items-center gap-x-2">
                <span className="block size-4 border-yellow-500 bg-warning/80 rounded-md"></span>
                <span>{translate("বুক করা", "Booked")}</span>
              </li>
            </ul>
          </div>
        </div>
      </PageTransition>

      {/* Seat Layout */}
      <PageTransition className="max-w-[320px] flex flex-col h-full">
        <div className="grid grid-cols-5 gap-y-1">
          {/* Left Side - 2 Columns */}
          <div className="col-span-2 grid grid-cols-2 gap-x-0 gap-y-1">
            {seatsAllocation.left.map((seat: any) => renderSeatButton(seat))}
          </div>

          {/* Aisle */}
          <div className="col-span-1  flex justify-center items-center">
            <h2 className="vertical-text">Ac Economy Class</h2>
          </div>

          {/* Right Side - 2 Columns */}
          <div className="col-span-2 grid grid-cols-2 justify-items-end gap-x-0 gap-y-1">
            {seatsAllocation.right.map((seat: any) => renderSeatButton(seat))}
          </div>
        </div>

        {/* Last Row with 5 Seats */}
        <div className="grid grid-cols-5 gap-1 pb-1.5 gap-y-1 pt-1">
          {seatsAllocation.lastRow.map((seat: any, index: number) => (
            <div
              key={seat.id}
              className={cn(
                "flex items-center",
                index === 0 || index === 1
                  ? "justify-self-start" // Align the first two seats to start
                  : index >= seatsAllocation.lastRow.length - 2
                  ? "justify-self-end" // Align the last two seats to end
                  : "justify-self-center" // Align the middle seats to center
              )}
            >
              {renderSeatButton(seat)}
            </div>
          ))}
        </div>
      </PageTransition>
    </div>
  );
};

export default EClassSeatLayout;
