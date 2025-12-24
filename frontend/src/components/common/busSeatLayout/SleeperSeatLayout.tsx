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
  bookingFormState: { selectedSeats: any[]; targetedSeat: number | null };
  bookingCoach: any; // Contains the entire coach data
  addBookingSeatLoading: boolean;
  removeBookingSeatLoading: boolean;
  coachId: any;
  bookedSeatList: any[];
}

const SleeperSeatLayout: FC<ISeatLayoutProps> = ({
  seatsAllocation,
  handleBookingSeat,
  bookingFormState,
  bookingCoach,
  addBookingSeatLoading,
  coachId,
  bookedSeatList,
  handleCancelTicket,
}) => {
  const { translate } = useCustomTranslator();
  const user = useSelector((state: any) => state.user);

  const getSeatColorClass = (
    seatName: string,
    selected: boolean,
    bookingCoach: any,
    coachId: any
  ) => {
    // Check if seat is booked (previously `orderSeat`) from `bookedSeatList`
    const isBooked = (bookedSeatList ?? [])?.some(
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
        return "bg-[#A3D1D5] text-white";
      }
      return "bg-orange-500 text-white";
    }

    // Blocked seat but not selected
    if (blockedSeat && !selected) {
      return "border-gray-800 bg-gray-800 text-white";
    }

    // Selected seat by user
    const isSeatSelected = bookingFormState?.selectedSeats?.some(
      (selectedSeat: any) =>
        selectedSeat.seat === seatName && selectedSeat.coachConfigId === coachId
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
    const isOrdered = (bookedSeatList ?? []).some(
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
                "text-foreground/50 hover:text-foreground/80 size-10 relative",
                (shouldDisableSeat || isBookedByOtherCounter) && "cursor-not-allowed"
              )}
              disabled={shouldDisableSeat || isBookedByOtherCounter}
            >
              <div
                className={cn(
                  "w-[70px] h-[30px] border rounded-md flex items-center justify-center",
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
    <div className="flex w-full flex-col items-start my-0 h-full mt-1 px-1 gap-x-12">
      <PageTransition className="w-full px-1 mb-1 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
        <div className="w-full">
          <div>
            <h2 className="text-center pb-1">
              {bookingCoach?.coach?.coachClass} Class
            </h2>
            <ul className="grid lg:grid-cols-3 text-sm gap-x-2 pb-1 items-center text-left gap-y-2">
              {/* <li>
                <span className="text-center mx-auto flex justify-center capitalize">{translate("বিক্রয়কৃত", "SOLD")}</span>
                <div className="flex items-center gap-x-0.5">
                  <span className="bg-red-700 px-2">{translate("পুরুষ", "Male")}</span>
                  <span className="bg-[#BD06D3] px-2">{translate("মহিলা", "Female")}</span>
                </div>
              </li>
              <li>
                <span className="text-center text-xs mx-auto flex justify-center capitalize">{translate("বুক", "BOOKED")}</span>
                <div className="flex items-center gap-x-0.5">
                  <span className="border-yellow-500 bg-warning/80 px-2">{translate("পুরুষ", "Male")}</span>
                  <span className="bg-[#FF99FF] px-2">{translate("মহিলা", "Female")}</span>
                </div>
              </li> */}
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
          {/* <div className="flex flex-col items-center">
            <GiSteeringWheel className="size-12 text-foreground opacity-80" />
            <Badge className="text-xs" size="sm" variant="outline" shape="pill">
              {translate("ড্রাইভার", "Driver")}
            </Badge>
          </div> */}
        </div>
      </PageTransition>

      <PageTransition className="max-w-[300px] ml-1.5 flex flex-col h-full px-2">
        <div className="relative grid grid-cols-4 gap-x-6 pb-1 gap-y-0">
          <div className="col-span-1 grid grid-cols-1 gap-x-4 gap-y-0">
            {seatsAllocation.left.map((seat) => renderSeatButton(seat))}
          </div>

          <div className=" col-span-1"></div>

          <div className="col-span-2 w-full grid grid-cols-2 gap-x-[38px] gap-y-0">
            {seatsAllocation.right.map((seat) => renderSeatButton(seat))}
          </div>
        </div>

        {/* Divider Between Decks */}
        <div
          className="absolute top-[292px] left-0 w-full pointer-events-none z-10 flex flex-col gap-20 items-center "
          style={{ transform: "translateY(-50%)" }}
        >
          <h3 className="text-lg font-semibold mr-20 px-2 -rotate-90">
            Lower Deck
          </h3>
          <div className="w-full border-t-2 border-primary/50 border-dashed"></div>
          <h3 className="text-lg font-semibold mr-20 px-2 -rotate-90">
            Upper Deck
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-x-[38px] pb-0 gap-y-0">
          {seatsAllocation.lastRow.map((seat) => renderSeatButton(seat))}
        </div>
      </PageTransition>
    </div>
  );
};

export default SleeperSeatLayout;
