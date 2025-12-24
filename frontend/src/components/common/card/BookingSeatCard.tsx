import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IBookingStateProps } from "@/sections/home/Booking";
import BookingForm from "@/sections/home/BookingForm";
import { fallback } from "@/utils/constants/common/fallback";
import { convertTimeToBengali } from "@/utils/helpers/convertTimeToBengali";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useState } from "react";
import PageTransition from "../effect/PageTransition";
import CardWrapper from "../wrapper/CardWrapper";

interface IBookingSeatCardProps {
  coachData: any; // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setBookingState: (bookingState: IBookingStateProps) => void;
  index: number;
  sharedFormState: any; // Pass shared form state
  setSharedFormState: (state: any) => void; // Setter for shared form state
}

const BookingSeatCard: FC<IBookingSeatCardProps> = ({
  coachData,
  index,
  sharedFormState,
  setSharedFormState,
}) => {
  const { translate } = useCustomTranslator();
  //@ts-ignore
  const [selectedBookingCoach, setSelectedBookingCoach] = useState<any>({});

  const totalAvaliableSetas =
    coachData?.seatAvailable - coachData?.CounterBookedSeat.length;
  return (
    <AccordionItem value={index?.toString()}>
      <CardWrapper rounded="md" variant="muted" className="p-2">
        <table className="min-w-full border-collapse border border-gray-300 ">
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
                  <span
                    onClick={() => setSelectedBookingCoach(coachData)}
                    className="mr-1"
                  >
                    {translate("আসন দেখুন", "View Seats")}
                  </span>
                </AccordionTrigger>
              </td>
            </tr>
          </tbody>
        </table>
      </CardWrapper>

      <AccordionContent>
        <PageTransition>
          <BookingForm
            sharedFormState={sharedFormState}
            setSharedFormState={setSharedFormState}
            bookingCoach={coachData}
            bookedSeatList={[""]}
            stationId={656}
          />
        </PageTransition>
      </AccordionContent>
    </AccordionItem>
  );
};

export default BookingSeatCard;
