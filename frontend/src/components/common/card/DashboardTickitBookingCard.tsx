import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import CounterTickitBookingForm from "@/pages/dashboard/counterRole/tickit/CounterTickitBookingForm";
import { ITickitBookingStateProps } from "@/pages/dashboard/counterRole/tickit/TickitBooking";
import { fallback } from "@/utils/constants/common/fallback";
import { convertTimeToBengali } from "@/utils/helpers/convertTimeToBengali";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useState } from "react";
import PageTransition from "../effect/PageTransition";
import CardWrapper from "../wrapper/CardWrapper";

interface IBookingTickitCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coachData: any;
  setBookingState?: (bookingState: ITickitBookingStateProps) => void;
  index: number;
}

const DashboardTickitBookingCard: FC<IBookingTickitCardProps> = ({
  coachData,
  index,
}) => {
  const { translate } = useCustomTranslator();
  //@ts-ignore
  const [selectedBookingCoach, setSelectedBookingCoach] = useState<any>({});
  const [sharedFormState, setSharedFormState] = useState<any>({}); // Renamed state

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
              <li className="text-lg  tracking-tight font-semibold mt-1">
                <span className="">
                  {translate("কোচ নম্বরঃ ", "Couch No: ")}
                </span>
                <span className="lg:font-[500] font-medium uppercase">
                  {coachData?.coachNo ||
                    translate(fallback.notFound.bn, fallback.notFound.en)}
                </span>
              </li>
              <li className="text-lg tracking-tight">
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
          <ul className="grid grid-cols-3 gap-x-4 gap-y-2">
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
              <Badge shape="pill" size="sm" variant="tertiary">
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
          <CounterTickitBookingForm
            sharedFormState={sharedFormState}
            setSharedFormState={setSharedFormState}
            bookingCoach={coachData} bookedSeatList={[]} stationId={undefined}          />
        </PageTransition>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DashboardTickitBookingCard;
