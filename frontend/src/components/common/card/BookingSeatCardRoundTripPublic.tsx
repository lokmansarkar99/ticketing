import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IBookingStateProps } from "@/sections/home/Booking";
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
import { FC, useEffect } from "react";
import SeatLayoutSelector from "../busSeatLayout/SeatLayoutSelector";
import PageTransition from "../effect/PageTransition";
import CardWrapper from "../wrapper/CardWrapper";

interface IBookingSeatCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coachData: any;
  setBookingState: (bookingState: IBookingStateProps) => void;
  index: number;
  bookingFormState: any;
  setBookingFormState: any;
  setGoViaRoute: any;
  setReturnViaRoute: any;
  setBookingCoachSingle: any;
  bookingCoachSingle: any;
}

const BookingSeatCardRoundTripPublic: FC<IBookingSeatCardProps> = ({
  coachData,
  index,
  bookingFormState,
  setBookingFormState,
  setGoViaRoute,
  setReturnViaRoute,
  setBookingCoachSingle,
  bookingCoachSingle,
}) => {
  const { translate } = useCustomTranslator();
  const [addBookingSeat, { isLoading: addBookingSeatLoading }] =
    useAddBookingSeatMutation({}) as any;
  const [removeBookingSeat, { isLoading: removeBookingSeatLoading }] =
    useRemoveBookingSeatMutation({}) as any;

  const totalAvaliableSetas =
    coachData?.seatAvailable - coachData?.CounterBookedSeat.length;
  const [checkingSeat] = useCheckingSeatMutation({}) as any;

  const seatsAllocation = (() => {
    switch (bookingCoachSingle?.coachClass) {
      case "E_Class":
        return dynamicSeatAllocation(bookingCoachSingle?.coachClass);
      case "B_Class":
        return dynamicSeatAllocation(bookingCoachSingle?.coachClass);
      case "Sleeper":
        return dynamicSeatAllocation(bookingCoachSingle?.coachClass);
      case "S_Class":
        return dynamicSeatAllocation(bookingCoachSingle?.coachClass);
      default:
        return { left: [], right: [], lastRow: [], middle: [] };
    }
  })();

  const handleBookingSeat = async (seatData: any) => {
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
              coachConfigId: coachData.id, // Store coachConfigId here
              date: coachData.departureDate, // Store date here
              schedule: coachData.schedule, // Store schedule here
              currentAmount: coachData?.fare?.amount,
              previousAmount: coachData?.discount,
            },
          ],
        }));
        setBookingCoachSingle(coachData); // Set only when booking successfully
      }
    }
  };
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
  }, [coachData, setGoViaRoute, setReturnViaRoute]);

  return (
    <AccordionItem value={index?.toString()}>
      <CardWrapper rounded="md" variant="muted" className="p-4">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border-2 border-[#3491b1] p-2">
                {translate("কোচ নম্বর", "Coach No")}
              </th>
              <th className="border-2 border-[#3491b1] p-2">
                {translate("শীতাতপ নিয়ন্ত্রিত", "Air Condition")}
              </th>
              <th className="border-2 border-[#3491b1] p-2">
                {translate("ক্লাস", "Class")}
              </th>
              <th className="border-2 border-[#3491b1] p-2">
                {translate("যাত্রা শুরু সময়", "Departure Time")}
              </th>
              <th className="border-2 border-[#3491b1] p-2">
                {translate("পৌঁছানোর সময়", "Arrival Time")}
              </th>
              <th className="border-2 border-[#3491b1] p-2">
                {translate("খালি আসন", "Available Seats")}
              </th>
              <th className="border-2 border-[#3491b1] p-2">
                {translate("ভাড়া", "Fare")}
              </th>
              <th className="border-2 border-[#3491b1] p-2">
                {translate("অ্যাকশন", "Actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-[#e074ee]">
              <td className="border border-gray-300 p-2">
                {coachData?.coachNo ||
                  translate(fallback.notFound.bn, fallback.notFound.en)}
              </td>
              <td className="border border-gray-300 p-2">
                {coachData?.coachType === "AC"
                  ? translate("হ্যাঁ", "Yes")
                  : translate("না", "No")}
              </td>
              <td className="border border-gray-300 p-2">
                {coachData?.coachClass === "B_Class"
                  ? "Business Class"
                  : coachData?.coachClass === "S_Class"
                  ? "Suite Class"
                  : coachData?.coachClass === "Sleeper"
                  ? "Sleeper Coach"
                  : "Economy Class"}
              </td>
              <td className="border border-gray-300 p-2">
                {translate(
                  convertTimeToBengali(coachData?.schedule),
                  coachData?.schedule
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {translate(
                  convertTimeToBengali(coachData?.schedule),
                  coachData?.schedule
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {translate(
                  convertToBnDigit(totalAvaliableSetas?.toString()),
                  totalAvaliableSetas.toString()
                )}
              </td>
              <td className="border border-gray-300 p-2">
                <div className="text-center">
                  <span className="line-through mr-2">
                    {coachData?.discount > 0 &&
                      translate(
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
                  {translate(
                    convertToBnDigit(
                      formatter({
                        type: "amount",
                        amount:
                          coachData?.fare?.amount - coachData?.discount || 0,
                      })
                    ),
                    formatter({
                      type: "amount",
                      amount:
                        coachData?.fare?.amount - coachData?.discount || 0,
                    })
                  )}
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <AccordionTrigger className="hover:no-underline border backdrop-blur-sm py-1 px-2 rounded-md">
                  <span className="mr-1">
                    {translate("আসন দেখুন", "View Seats")}
                  </span>
                </AccordionTrigger>
              </td>
            </tr>
          </tbody>
        </table>
      </CardWrapper>
      {/* <BoookingFormRoundTripPublic selectedBookingCoach={coachData} /> */}
      <AccordionContent>
        <PageTransition>
          <div className="flex items-center justify-center flex-col gap-4">
            <div className="w-full max-w-lg flex items-center justify-center border-2 rounded-md border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300 p-4">
              <SeatLayoutSelector
                checkingSeat={checkingSeat}
                bookingCoach={coachData}
                coachClass={coachData.coachClass}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                seatsAllocation={seatsAllocation} // removed @ts-ignore
                handleBookingSeat={handleBookingSeat}
                bookingFormState={bookingFormState}
                addBookingSeatLoading={addBookingSeatLoading}
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

export default BookingSeatCardRoundTripPublic;
