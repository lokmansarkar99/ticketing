/* eslint-disable @typescript-eslint/ban-ts-comment */
import DashboardTickitBookingCard from "@/components/common/card/DashboardTickitBookingCard";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { Accordion } from "@/components/ui/accordion";
import { selectCounterSearchFilter } from "@/store/api/counter/counterSearchFilterSlice";
import { FC } from "react";
import { useSelector } from "react-redux";

interface ITickitBookingProps {}

const CounterTickitBooking: FC<ITickitBookingProps> = () => {
  const bookingState = useSelector(selectCounterSearchFilter);
  return (
    <SectionWrapper className="px-4">
      {
        //@ts-ignore
        bookingState?.bookingCoachesList.length > 0 && (
          <Accordion className="w-full" type="single" collapsible>
            //@ts-ignore
            {bookingState?.bookingCoachesList?.map(
              (singleCoachData: any, coachDataIndex: number) => (
                <DashboardTickitBookingCard
                  key={coachDataIndex}
                  coachData={singleCoachData}
                  index={coachDataIndex}
                />
              )
            )}
          </Accordion>
        )
      }
    </SectionWrapper>
  );
};

export default CounterTickitBooking;
