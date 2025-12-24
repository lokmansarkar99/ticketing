/* eslint-disable @typescript-eslint/ban-ts-comment */
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
  seatsAllocation: { left?: any[]; right?: any[]; middle?: any[] };
  handleBookingSeat: (seatData: any, id: any) => void;
  handleCancelTicket: (seatData: any) => void;
  bookingFormState: any;
  addBookingSeatLoading: boolean;
  removeBookingSeatLoading: boolean;
  bookingCoach: any;
  coachId: any;
  bookedSeatList: any[];
}

const SuiteClassSeatLayout: FC<ISeatLayoutProps> = ({
  seatsAllocation = { left: [], right: [], middle: [] },
  handleBookingSeat,
  bookingFormState,
  addBookingSeatLoading,
  bookingCoach,
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
    const isOrdered = (bookedSeatList ?? [])?.some(
      (booked) =>
        booked.coachConfigId === coachId && booked.seat.includes(seat.seat)
    );

    // const isBlockedSeat = bookingCoach?.bookingSeat?.find(
    //   (order: any) => order.seat === seat.seat
    // );

    // const findD = bookingFormState?.selectedSeats?.find(
    //   (order: any) => order.seat === seat.seat
    // );

    const bookedByCounter = bookingCoach?.CounterBookedSeat?.find(
      (order: any) => order.seat === seat.seat
    );

    const isBookedByOtherCounter =
      bookedByCounter && bookedByCounter.counter.id !== user.counterId;

    const issueByCounter = bookingCoach?.orderSeat?.find(
      (order: any) => order.seat === seat.seat
    );
    // const shouldDisableSeat = !user.role
    //   ? isOrdered ||
    //     bookedByCounter ||
    //     (findD && isBlockedSeat
    //       ? findD.seat === isBlockedSeat.seat
    //         ? false
    //         : true
    //       : isBlockedSeat)
    //   : isOrdered || isBookedByOtherCounter || isBlockedSeat;

    const shouldDisableSeat = !user.role // If user is not logged in or no role, disable for ordered/booked
      ? isOrdered || bookedByCounter
      : user.role?.toLowerCase() === "counter" ||
        user.role?.toLowerCase() === "callcenter"
      ? false // Allow all seats to be clickable for counters
      : isOrdered || isBookedByOtherCounter;

    const tooltipText = isBookedByOtherCounter
      ? `Name: ${bookedByCounter?.user?.userName}, Address: ${bookedByCounter?.counter?.address}, Phone:${bookedByCounter?.counter?.mobile}`
      : issueByCounter
      ? `Customer Name: ${
          issueByCounter?.order?.customerName
        }, Customer phone: ${issueByCounter?.order?.phone}, Counter: ${
          issueByCounter?.order?.user?.userName || "Online"
        }`
      : "";

    //
    //
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
                "text-foreground/50 hover:text-foreground/80 flex flex-col items-center gap-1",
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
          )}{" "}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex w-full flex-col justify-center items-start my-0 h-full mt-1 px-1 gap-x-12">
      <PageTransition className="w-full px-1 mb-1.5 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
        <div className="w-full">
          <div>
            <h2 className="text-center pb-1 font-semibold">
              {bookingCoach?.coach?.coachClass === "S_Class" && "Suite"} Class
            </h2>

            <ul className="grid lg:grid-cols-3 text-sm gap-x-2 pb-1 items-center text-left gap-y-2">
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

      <PageTransition className="max-w-[300px] flex flex-col ml-2 h-full">
        <div className=" relative grid grid-cols-4 gap-x-0 pb-3 gap-y-0">
          <div className="col-span-1 flex flex-col items-center px gap-y-1">
            {seatsAllocation.left?.map((seat) => renderSeatButton(seat))}
          </div>

          {
            //@ts-ignore
            seatsAllocation?.middle?.length > 0 && (
              <div className="mt-[103px] col-span-1 mx-2 flex items-center justify-center">
                {
                  //@ts-ignore
                  seatsAllocation.middle.map((seat) => renderSeatButton(seat))
                }
              </div>
            )
          }

          <div className="col-span-2 grid   grid-cols-2 text-center gap-x-0 gap-y-1">
            {seatsAllocation.right?.map((seat) => renderSeatButton(seat))}
          </div>

          {/* new Divider Between Decks */}
          <div
            className="absolute top-[280px] left-0 w-full pointer-events-none z-10 flex flex-col gap-56 items-center "
            style={{ transform: "translateY(-50%)" }}
          >
            <h3 className="text-lg font-semibold mr-20 px-2 -rotate-90">
              Lower Deck
            </h3>

            <h3 className="text-lg font-semibold mr-20 px-2 -rotate-90">
              Upper Deck
            </h3>
            <div className="absolute top-[164px] w-full border-t border-primary border-dashed"></div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default SuiteClassSeatLayout;
