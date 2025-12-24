import DashboardTickitBookingCard from "@/components/common/card/DashboardTickitBookingCard";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { Accordion } from "@/components/ui/accordion";
import { useGetBookingCoachesQuery } from "@/store/api/bookingApi";
import { format } from "date-fns";
import { FC, useEffect, useState } from "react";
import TickitSearchDashboard from "./TickitSearchDashboard"; // Import your search component

interface ITickitBookingProps {}

export interface ITickitBookingStateProps {
  calenderOpen: boolean;
  fromCounterId: number | null;
  destinationCounterId: number | null;
  schedule: string;
  coachType: string;
  date: Date | null;
  bookingCoachesList: any[];
  bookedSeatList:any[]
}

const TickitBooking: FC<ITickitBookingProps> = () => {
  const [bookingState, setBookingState] = useState<ITickitBookingStateProps>({
    calenderOpen: false,
    fromCounterId: null,
    destinationCounterId: null,
    schedule: "",
    coachType: "AC",
    date: new Date(),
    bookingCoachesList: [],
    bookedSeatList:[]
  });
  // Only execute the query if all fields are filled
  const shouldFetchData =
    bookingState.fromCounterId &&
    bookingState.destinationCounterId &&
    bookingState.schedule &&
    bookingState.coachType &&
    bookingState.date;

  const { data: bookingCoachesData, isLoading: loadingTickitBookingData } =
    useGetBookingCoachesQuery(
      shouldFetchData
        ? {
            fromCounterId: bookingState?.fromCounterId,
            destinationCounterId: bookingState?.destinationCounterId,
            schedule: bookingState?.schedule,
            coachType: bookingState.coachType,
            date: bookingState.date && format(bookingState.date, "yyyy-MM-dd"),
          }
        : {}, // Pass an empty object if not all fields are filled
      { skip: !shouldFetchData } // Skip the query if not all fields are filled
    ) as any;


  useEffect(() => {
    if (shouldFetchData && bookingCoachesData) {
      setBookingState((prevState: ITickitBookingStateProps) => ({
        ...prevState,
        bookingCoachesList: bookingCoachesData?.data || [],
        bookedSeatList:bookingCoachesData?.bookedSeat || []
      }));
    } else {
      setBookingState((prevState: ITickitBookingStateProps) => ({
        ...prevState,
        bookingCoachesList: [],
        bookedSeatList:[]
      }));
    }
  }, [shouldFetchData, bookingCoachesData]);

  return (
    <SectionWrapper className="px-4">
      <div>
        <TickitSearchDashboard
          bookingState={bookingState}
          setBookingState={setBookingState}
        />
      </div>

      {loadingTickitBookingData ? (
        <TableSkeleton columns={7} />
      ) : (
        bookingState.bookingCoachesList.length > 0 && (
          <Accordion className="w-full" type="single" collapsible>
            {bookingState.bookingCoachesList.map(
              (singleCoachData: any, coachDataIndex: number) => (
                <DashboardTickitBookingCard
                  setBookingState={setBookingState}
                  key={coachDataIndex}
                  coachData={singleCoachData}
                  index={coachDataIndex}
                />
              )
            )}
          </Accordion>
        )
      )}
    </SectionWrapper>
  );
};

export default TickitBooking;
