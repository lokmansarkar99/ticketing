import HomeRoundTripTickitTable from "@/components/common/table/HomeRoundTripTickitTable";
import HomeTickitBookingTable from "@/components/common/table/HomeTickitBookingTable";
import { Accordion } from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useRemoveBookingSeatMutation } from "@/store/api/bookingApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useState } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { PiKeyReturnBold } from "react-icons/pi";
import { toast } from "sonner";
import BoookingFormRoundTripPublic, {
  IBookingFormStateProps,
} from "./BoookingFormRoundTripPublic";
import { X } from "lucide-react";
export default function SearchResult({
  bookingState,
  //@ts-ignore
  setBookingState,
}: {
  bookingState: any;
  setBookingState: any;
}) {
  const [bookingFormState, setBookingFormState] =
    useState<IBookingFormStateProps>({
      selectedSeats: [],
      targetedSeat: null,
      redirectLink: null,
      customerName: null,
      redirectConfirm: false,
    });
  const { translate } = useCustomTranslator();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingCoachSingle, setBookingCoachSingle] = useState({});
  const [goViaRoute, setGoViaRoute] = useState([]);
  const [goReturnCoachId, setGoReturnCoachId]=useState({
    goCoachConfigId:undefined,
    returnCoachConfigId:undefined
  })
  const [returnViaRoute, setReturnViaRoute] = useState([]);
  const [removeBookingSeat] = useRemoveBookingSeatMutation({}) as any;
  // Open and close modal
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

  // Handle redirect to payment after booking is successful
  if (bookingFormState.redirectConfirm && bookingFormState.redirectLink) {
    window.location.href = bookingFormState.redirectLink;
  }
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
          seat: seat?.seat,
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
  //remember form data code
  const [sharedFormState, setSharedFormState] = useState<any>({}); // Renamed state
  return (
    <div className="">
      {/* {bookingState.orderType !== "Round_Trip" && 
       
       } */}
      <Accordion className="w-full space-y-3" type="single" collapsible>
        {bookingState.bookingCoachesList?.length > 0 && (
          <HomeTickitBookingTable
            coachData={bookingState.bookingCoachesList}
            stationId={bookingState}
            bookedSeatList={bookingState.bookedSeatList}
          />
        )}
      </Accordion>
      {bookingState.roundTripGobookingCoachesList?.length > 0 && (
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
      <Accordion className="w-full space-y-3" type="single" collapsible>
        {bookingState?.roundTripGobookingCoachesList?.length > 0 && (
          <HomeRoundTripTickitTable
            data={bookingState.roundTripGobookingCoachesList}
            bookingFormState={bookingFormState}
            setBookingFormState={setBookingFormState}
            setGoViaRoute={setGoViaRoute}
            setReturnViaRoute={setReturnViaRoute}
            setBookingCoachSingle={setBookingCoachSingle}
            bookedSeatList={bookingState.bookedSeatList}
            stationId={bookingState}
            roundTrip={false}
            setGoReturnCoachId={setGoReturnCoachId}
          />
        )}
      </Accordion>

      {bookingState.roundTripReturnBookingCoachesList?.length > 0 && (
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

      <Accordion className="w-full space-y-3" type="single" collapsible>
        {bookingState?.roundTripReturnBookingCoachesList?.length > 0 && (
          <HomeRoundTripTickitTable
            data={bookingState.roundTripReturnBookingCoachesList}
            bookingFormState={bookingFormState}
            setBookingFormState={setBookingFormState}
            setGoViaRoute={setGoViaRoute}
            setReturnViaRoute={setReturnViaRoute}
            setBookingCoachSingle={setBookingCoachSingle}
            bookedSeatList={bookingState.bookedSeatList}
            stationId={bookingState}
            roundTrip={true}
            setGoReturnCoachId={setGoReturnCoachId}
          />
        )}
      </Accordion>

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

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 pt-20 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-[1050px] rounded-2xl bg-background p-6 shadow-lg"
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute right-7 top-3 text-muted-foreground hover:text-red-600 transition"
              >
                <X className="w-8 h-8 text-red-500" />
              </button>

              {/* Booking Form */}
              <BoookingFormRoundTripPublic
                goViaRoute={goViaRoute}
                bookingCoach={bookingCoachSingle}
                returnViaRoute={returnViaRoute}
                bookingFormState={bookingFormState}
                setBookingFormState={setBookingFormState}
                onClose={handleCloseModal}
                sharedFormState={sharedFormState}
                setSharedFormState={setSharedFormState}
                stationId={bookingState}
                goReturnCoachId={goReturnCoachId}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
