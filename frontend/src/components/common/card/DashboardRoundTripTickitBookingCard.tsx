import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ITickitBookingStateProps } from "@/pages/dashboard/counterRole/tickit/TickitBooking";
import {
  useAddBookingSeatMutation,
  useCheckingSeatMutation,
  useRemoveBookingSeatMutation,
} from "@/store/api/bookingApi";
import { fallback } from "@/utils/constants/common/fallback";
import { convertTimeToBengali } from "@/utils/helpers/convertTimeToBengali";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import { dynamicSeatAllocation } from "@/utils/helpers/dynamicSeatAllocation";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect, useMemo, useState } from "react";
import SeatLayoutSelector from "../busSeatLayout/SeatLayoutSelector";
import PageTransition from "../effect/PageTransition";
import CardWrapper from "../wrapper/CardWrapper";

interface IBookingTickitCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coachData: any;
  setBookingState?: (bookingState: ITickitBookingStateProps) => void;
  index: number;
  setBookingCoachSingle: any;
  bookingCoachSingle: any;
  setGoViaRoute: any;
  setReturnViaRoute: any;
  bookingFormState: any;
  setBookingFormState: any;
}

const DashboardRoundTripTickitBookingCard: FC<IBookingTickitCardProps> = ({
  coachData,
  index,
  setBookingCoachSingle,

  setGoViaRoute,
  setReturnViaRoute,
  bookingFormState,
  setBookingFormState,
}) => {
  const [checkingSeat] = useCheckingSeatMutation();
  const { translate } = useCustomTranslator();

  const [removeBookingSeat, { isLoading: removeBookingSeatLoading }] =
    useRemoveBookingSeatMutation({}) as any;

  const [addBookingSeat] = useAddBookingSeatMutation();
  // Effect to set goViaRoute and returnViaRoute based on coachData.route.viaRoute
  useEffect(() => {
    if (coachData?.route) {
      const viaRoutes = coachData.route.viaRoute?.map(
        (routePoint: any) => routePoint.station.name
      );
      if (viaRoutes) {
        setGoViaRoute(viaRoutes);
        setReturnViaRoute(viaRoutes.reverse());
      }
    }
  }, [coachData?.route]); // Reduce dependencies to minimize re-renders
  //@ts-ignore
  const [selectedBookingCoach, setSelectedBookingCoach] = useState<any>({});
  const seatsAllocation = useMemo(() => {
    switch (coachData?.coachClass) {
      case "E_Class":
        return dynamicSeatAllocation(coachData?.coachClass);
      case "B_Class":
        return dynamicSeatAllocation(coachData?.coachClass);
      case "Sleeper":
        return dynamicSeatAllocation(coachData?.coachClass);
      case "S_Class":
        return dynamicSeatAllocation(coachData?.coachClass);
      default:
        return { left: [], right: [], lastRow: [], middle: [] };
    }
  }, [coachData?.coachClass]);

  const handleBookingSeat = async (seatData: any) => {
    try {
      const isSeatAlreadySelected = bookingFormState.selectedSeats.some(
        (current: any) => current.seat === seatData.seat
      );

      if (isSeatAlreadySelected) {
        // Remove the seat if it's already selected
        const result = await removeBookingSeat({
          coachConfigId: coachData?.id,
          date: coachData?.departureDate,
          schedule: coachData?.schedule,
          seat: seatData.seat,
        });

        if (result?.data?.success) {
          setBookingFormState((prevState: any) => ({
            ...prevState,
            selectedSeats: prevState.selectedSeats.filter(
              (seat: any) => seat.seat !== seatData.seat
            ),
          }));
        } else {
          console.error("Failed to remove seat:", result?.error);
        }
      } else {
        // Add the seat if it's not already selected
        const result = await addBookingSeat({
          coachConfigId: coachData?.id,
          date: coachData?.departureDate,
          schedule: coachData?.schedule,
          seat: seatData.seat,
        });

        if (result?.data?.data?.available) {
          setBookingFormState((prevState: any) => ({
            ...prevState,
            selectedSeats: [
              ...prevState.selectedSeats,
              {
                seat: seatData.seat,
                coachConfigId: coachData.id,
                date: coachData.departureDate,
                schedule: coachData.schedule,
                // currentAmount: coachData?.fare?.amount,
                // previousAmount: coachData?.discount,
              },
            ],
          }));
          setBookingCoachSingle(coachData); 
        } else {
          console.error("Seat is not available or failed to book:", result);
        }
      }
    } catch (error) {
      console.error("Error handling booking seat:", error);
    }
  };
  return (
    <AccordionItem value={index?.toString()}>
      <CardWrapper rounded="md" variant="muted" className="p-4 ">
        <div className="flex lg:flex-row flex-col justify-between w-full">
          <ul className="lg:w-3/12">
            <li className="flex gap-3">
              <Badge shape="pill">
                {coachData?.coachType == "AC"
                  ? translate("শীতাতপ নিয়ন্ত্রিত", "Air Condition")
                  : translate(
                      "শীতাতপ নিয়ন্ত্রিত বিহীন",
                      "Without Air Condition"
                    )}
              </Badge>
              <Badge shape="pill">
                {coachData?.coachClass == "B_Class"
                  ? "Business Class"
                  : coachData?.coachClass == "E_Class"
                  ? "Economy Class"
                  : coachData?.coachClass == "Sleeper"
                  ? "Sleeper Class"
                  : "Suite Class"}
              </Badge>
            </li>
            <div className=" w-full flex lg:flex-col md:flex-row flex-col lg:items-start md:items-center justify-start md:gap-2">
              <li className="lg:text-lg text-sm tracking-tight font-semibold mt-1">
                <span className="">
                  {translate("কোচ নম্বরঃ ", "Couch No: ")}
                </span>
                <span className="lg:font-[500] md:font-medium uppercase">
                  {coachData?.coachNo ||
                    translate(fallback.notFound.bn, fallback.notFound.en)}
                </span>
              </li>
              <li className="lg:text-lg text-sm tracking-tight">
                <span className="font-[500] uppercase text-red-400  rounded-lg  py-[2px]">
                  {coachData?.fromCounter?.name ||
                    translate(fallback.notFound.bn, fallback.notFound.en)}
                </span>{" "}
                {`=>`}{" "}
                <span className="font-[500] uppercase text-red-400  rounded-lg  py-[2px]">
                  {coachData?.destinationCounter?.name ||
                    translate(fallback.notFound.bn, fallback.notFound.en)}
                </span>
              </li>
            </div>
          </ul>
          <ul className="grid grid-cols-3 gap-x-4 gap-y-2 mt-1">
            <li className="flex flex-col lg:p-4 rounded-md justify-center items-center border-2 border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px]">
              <span className="font-semibold md:text-lg text-sm tracking-tighter">
                {translate("যাত্রা শুরু সময়", "Departure Time")}
              </span>
              <span className="md:text-lg text-sm tracking-tight text-red-400 px-2 rounded-md mt-1">
                {translate(
                  convertTimeToBengali(coachData?.schedule || ""),
                  coachData?.schedule
                )}
              </span>
            </li>
            <li className="flex flex-col lg:p-4 rounded-md justify-center items-center border-2 border-warning/50 border-dashed bg-warning/5 backdrop-blur-[2px]">
              <span className="font-semibold md:text-lg text-sm tracking-tighter ">
                {translate("পৌঁছানোর সময়", "Arrival time")}
              </span>
              <span className="md:text-lg text-sm tracking-tight text-red-400 px-2 rounded-md mt-1">
                {translate(
                  convertTimeToBengali(coachData?.schedule),
                  coachData?.schedule
                )}
              </span>
            </li>
            <li className="flex flex-col lg:p-4 rounded-md justify-center items-center border-2 border-success/50 border-dashed bg-success/5 backdrop-blur-[2px]">
              <span className="font-semibold md:text-lg text-sm tracking-tighter">
                {translate("খালি আসন", "Available Seat")}
              </span>
              <span className="md:text-lg text-sm tracking-tight text-red-400 px-2 rounded-md mt-1">
                {translate(
                  convertToBnDigit(coachData?.seatAvailable?.toString()),
                  coachData?.seatAvailable?.toString()
                )}
              </span>
            </li>
          </ul>
          <ul className="flex gap-x-4 lg:justify-center md:justify-start mt-3 px-2">
            <li className="flex flex-col items-center justify-center text-center">
              <Badge
                shape="responsivepill"
                size="responsivesize"
                variant="tertiary"
              >
                {translate("অতিরিক্ত কোনো চার্জ নেই", "No Additional Charge")}
              </Badge>
              <span className="font-anek font-light md:text-base text-sm line-through mt-1">
                {translate(
                  convertToBnDigit(
                    formatter({
                      type: "amount",
                      amount: coachData?.fare?.amount,
                    })
                  ),
                  formatter({
                    type: "amount",
                    amount: coachData?.fare?.amount,
                  })
                )}
              </span>
              <span className="font-anek font-semibold md:text-xl text-lg">
                {translate(
                  convertToBnDigit(
                    formatter({
                      type: "amount",
                      amount: coachData?.fare?.amount,
                    })
                  ),
                  formatter({
                    type: "amount",
                    amount: coachData?.fare?.amount,
                  })
                )}
              </span>
            </li>
            <li className="ml-6 md:px-3">
              <AccordionTrigger className="hover:no-underline border backdrop-blur-sm py-1 px-2 rounded-md">
                <span
                  onClick={() => setSelectedBookingCoach(coachData.id)}
                  className="mr-1"
                >
                  View Seats
                </span>
              </AccordionTrigger>
            </li>
          </ul>
        </div>
      </CardWrapper>

      <AccordionContent>
        <PageTransition>
          <div className="flex items-center justify-center flex-col gap-4">
            <div className="w-full mx-auto flex items-center justify-center border-2 rounded-md border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300 max-w-[330px] p-4">
              <SeatLayoutSelector
                checkingSeat={checkingSeat}
                bookingCoach={coachData}
                coachClass={coachData.coachClass}
                //@ts-ignore
                seatsAllocation={seatsAllocation}
                handleBookingSeat={handleBookingSeat}
                bookingFormState={bookingFormState}
                removeBookingSeatLoading={removeBookingSeatLoading}
                coachId={coachData.id}
              />
            </div>
          </div>
        </PageTransition>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DashboardRoundTripTickitBookingCard;
