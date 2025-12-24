
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useRemoveBookingSeatMutation } from "@/store/api/bookingApi";
import { selectCounterSearchFilter } from "@/store/api/counter/counterSearchFilterSlice";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { useSelector } from "react-redux";

import BookingTableSkeleton from "@/components/common/skeleton/BookingTableSkeleton";
import DashboardRoundTripTickitTable from "@/components/common/table/DashboardRoundTripTickitTable";
import DashboardTickitBookingTable from "@/components/common/table/DashboardTickitBookingTable";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PiKeyReturnBold } from "react-icons/pi";
import { toast } from "sonner";
import CallcenterRoundTripFormModal from "@/components/common/navigation/callcenter/CallcenterRoundTripFormModal";
import { ICounterBookingFormStateProps } from "@/pages/dashboard/counterRole/tickit/CallcenterTickitBookingForm";
import RoundTripFormModal from "@/pages/dashboard/counterRole/counterHome/RoundTripFormModal";

interface ISalesListProps {}
export interface ISalesDataStateProps {
  search: string;
  addUserOpen: boolean;
  updateModalOpeans: boolean;
  detailsModalOpen: boolean;
  usersList: Partial<any[]>;
  selectedOrderId: number | null;
  isPrinting: boolean;
}

const CallCenterDashboardHome: FC<ISalesListProps> = () => {
  const { translate } = useCustomTranslator();

  const user = useSelector((state: any) => state.user);
  const [sharedFormState, setSharedFormState] = useState<any>({}); // Renamed state
  const [goReturnCoachId, setGoReturnCoachId] = useState({
    goCoachConfigId: undefined,
    returnCoachConfigId: undefined,
  });
  const bookingState = useSelector(selectCounterSearchFilter);
  const [removeBookingSeat] = useRemoveBookingSeatMutation({}) as any;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingCoachSingle, setBookingCoachSingle] = useState({});
  const [goViaRoute, setGoViaRoute] = useState([]);
  const [returnViaRoute, setReturnViaRoute] = useState([]);
  //const [popoverOpen, setPopoverOpen] = useState(false);
  const [bookingFormState, setBookingFormState] =
    useState<ICounterBookingFormStateProps>({
      targetedSeat: null,
      redirectLink: null,
      customerName: null,
      redirectConfirm: false,
      selectedSeats: [],
    });

  const handleProceedClick = () => {
    const hasGoingSeat = bookingFormState.selectedSeats.some((seat) =>
      bookingState.roundTripGobookingCoachesList.some(
        (coach: any) => coach.id === seat.coachConfigId
      )
    );

    const hasReturnSeat = bookingFormState.selectedSeats.some((seat) =>
      bookingState.roundTripReturnBookingCoachesList.some(
        (coach: any) => coach.id === seat.coachConfigId
      )
    );

    if (!hasGoingSeat) {
      toast.error(
        translate(
          "Please select at least one seat for the outgoing trip.",
          "যাত্রার জন্য অন্তত একটি আসন নির্বাচন করুন।"
        )
      );
      return;
    }

    if (!hasReturnSeat) {
      toast.error(
        translate(
          "Please select at least one seat for the return trip.",
          "ফেরার জন্য অন্তত একটি আসন নির্বাচন করুন।"
        )
      );
      return;
    }

    // Proceed to open the modal if both conditions are satisfied
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //reset button
  const ResetDataOfForm = async () => {
    try {
      if (!bookingFormState.selectedSeats.length) {
        toast.warning(
          translate(
            "No seats selected to reset.",
            "রিসেট করার জন্য কোনো আসন নির্বাচন করা হয়নি।"
          )
        );
        return;
      }

      // Iterate over selected seats and call `removeBookingSeat` for each
      const promises = bookingFormState.selectedSeats.map((seat) =>
        removeBookingSeat({
          coachConfigId: seat?.coachConfigId,
          fromStationId: bookingState?.fromStationId,
          destinationStationId: bookingState?.toStationId,
          seat: seat.seat,
        })
      );

      // Wait for all API calls to complete
      const results = await Promise.all(promises);

      // Check if all API calls were successful
      const allSuccessful = results.every((result) => result?.data?.success);

      if (allSuccessful) {
        toast.success(
          translate(
            "All seats reset successfully.",
            "সব আসন সফলভাবে রিসেট হয়েছে।"
          )
        );

        // Reset the form state
        setBookingFormState({
          targetedSeat: null,
          selectedSeats: [],
          redirectLink: null,
          customerName: null,
          redirectConfirm: false,
        });
      } else {
        toast.error(
          translate(
            "Some seats could not be reset. Please try again.",
            "কিছু আসন রিসেট করা যায়নি। আবার চেষ্টা করুন।"
          )
        );
      }
    } catch (error) {
      console.error("Error resetting seats:", error);
      toast.error(
        translate(
          "Error resetting the seats. Please try again.",
          "আসন রিসেট করার সময় ত্রুটি হয়েছে। আবার চেষ্টা করুন।"
        )
      );
    }
  };
  const isLoading =
    bookingState.isLoadingBookingCoachesList ||
    bookingState.isLoadingRoundTripGoBookingCoachesList ||
    bookingState.isLoadingRoundTripReturnBookingCoachesList;

  if (isLoading) {
    return <BookingTableSkeleton />;
  }


  return (
    <section className=" ">
      <PageWrapper>
        
        {/* search result design  */}
        {bookingState.orderType !== "Round_Trip" && (
          <div>
            <DashboardTickitBookingTable
              coachData={bookingState?.bookingCoachesList}
              bookedSeatList={bookingState.bookedSeatList}
              stationId={bookingState}
            />
          </div>
        )}
        {bookingState.orderType === "Round_Trip" && (
          <div className="my-3 px-3 flex justify-start items-center gap-5 border-2 rounded-md border-[#b642c5]/50 border-dashed bg-[#b642c5] backdrop-blur-[2px]">
            <h2 className="font-bold text-white text-2xl">
              {translate(
                "আপনার যাত্রা শুরুর টিকিট নির্বাচন করুন",
                "Select Your Start Journey Ticket"
              )}
            </h2>
            <span className="py-3 text-white">
              <PiKeyReturnBold style={{ transform: "scaleX(-1)" }} size={24} />
            </span>
          </div>
        )}
        {/* roundtrip design work card */}
        {bookingState.orderType === "Round_Trip" &&
          bookingState.roundTripGobookingCoachesList.length > 0 && (
            <DashboardRoundTripTickitTable
              data={bookingState?.roundTripGobookingCoachesList}
              bookingFormState={bookingFormState}
              setBookingFormState={setBookingFormState}
              setGoViaRoute={setGoViaRoute}
              setReturnViaRoute={setReturnViaRoute}
              setBookingCoachSingle={setBookingCoachSingle}
              stationId={bookingState}
              roundTrip={false}
              setGoReturnCoachId={setGoReturnCoachId}
              bookedSeatList={bookingState?.bookedSeatList}
            />
          )}
        {bookingState.orderType === "Round_Trip" && (
          <div className="my-3 px-3 flex justify-start items-center gap-5 border-2 rounded-md border-[#b642c5]/50 border-dashed bg-[#b642c5] backdrop-blur-[2px]">
            <h2 className="font-bold text-white text-2xl">
              {translate(
                "আপনার রিটার্ন জার্নি টিকিট নির্বাচন করুন",
                " Select Your Return Journey Ticket"
              )}
            </h2>
            <span className="py-3 text-white">
              <PiKeyReturnBold size={24} />
            </span>
          </div>
        )}

        {/* roundtrip design work card back */}
        {bookingState.orderType === "Round_Trip" &&
          bookingState.roundTripReturnBookingCoachesList.length > 0 && (
            <DashboardRoundTripTickitTable
              data={bookingState?.roundTripReturnBookingCoachesList}
              bookingFormState={bookingFormState}
              setBookingFormState={setBookingFormState}
              setGoViaRoute={setGoViaRoute}
              setReturnViaRoute={setReturnViaRoute}
              setBookingCoachSingle={setBookingCoachSingle}
              stationId={bookingState}
              roundTrip={true}
              setGoReturnCoachId={setGoReturnCoachId}
              bookedSeatList={bookingState?.bookedSeatList}
            />
          )}

        {bookingState.roundTripReturnBookingCoachesList?.length > 0 && (
          <div className="w-full mt-5 flex justify-between items-center">
            <div className="lg:py-3 py-3 flex gap-4  px-10 rounded-md justify-center items-center bg-primary">
              <h2 className="text-white text-xl  font-semibold">Reset</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground"
                      onClick={ResetDataOfForm}
                    >
                      <span className="sr-only">Refresh Button</span>
                      <LuRefreshCw className="size-[21px] text-white" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p> {translate("ফিল্টার রিসেট", "Reset Filter")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <button
              onClick={handleProceedClick}
              className="block px-10 py-3 text-xl font-semibold bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Proceed
            </button>
          </div>
        )}
      
      </PageWrapper>

      {/* Modal for round trip form */}
      {isModalOpen && (
        <div className="fixed bottom-0 left-0 top-0 right-0 flex justify-center items-center  bg-black bg-opacity-50 z-50 ">
          <div className="h-[90vh] overflow-scroll  w-full max-w-[95%] md:max-w-4xl bg-background border border-primary/50 border-dashed rounded-lg p-5 backdrop-blur-[2px]">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-red-500 font-bold"
            >
              Close
            </button>

            {user?.role?.toLowerCase() === "counter" ? (
              <>
                <RoundTripFormModal
                  bookingCoach={bookingCoachSingle}
                  onClose={handleCloseModal}
                  goViaRoute={goViaRoute}
                  returnViaRoute={returnViaRoute}
                  bookingFormState={bookingFormState}
                  setBookingFormState={setBookingFormState}
                  sharedFormState={sharedFormState}
                  setSharedFormState={setSharedFormState}
                  stationId={bookingState}
                  goReturnCoachId={goReturnCoachId}
                />
              </>
            ) : (
              <>
                <CallcenterRoundTripFormModal
                  bookingCoach={bookingCoachSingle}
                  onClose={handleCloseModal}
                  goViaRoute={goViaRoute}
                  returnViaRoute={returnViaRoute}
                  bookingFormState={bookingFormState}
                  setBookingFormState={setBookingFormState}
                  sharedFormState={sharedFormState}
                  setSharedFormState={setSharedFormState}
                  stationId={bookingState}
                  goReturnCoachId={goReturnCoachId}
                />
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CallCenterDashboardHome;
