import { useState, useEffect, useRef } from "react";
import { Loader } from "../../Loader";
import { useGetCoachesQuery } from "@/store/api/vehiclesSchedule/coachApi";
import { useGetStationsQuery } from "@/store/api/vehiclesSchedule/stationApi";
import SearchMigrateSeatForm from "./SearchMigrateSeatFrom";
import SearchMigrateSeatTo from "./SearchMigrateSeatTo";
import SeatLayoutSelector from "../../busSeatLayout/SeatLayoutSelector";
import PageTransition from "../../effect/PageTransition";
import { dynamicSeatAllocation } from "@/utils/helpers/dynamicSeatAllocation";
import { toast } from "sonner";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ICounterBookingFormStateProps } from "@/pages/dashboard/counterRole/tickit/CallcenterTickitBookingForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useForm } from "react-hook-form";
import MigrateTicket from "./MigrateForm";
import {
  useAddBookingSeatMutation,
  useCheckingSeatMutation,
  useMigrateBookingMutation,
  useRemoveBookingSeatMutation,
} from "@/store/api/bookingApi";
import Submit from "../../form/Submit";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCounterSearchFilter,
  setBookedSeatList,
  setBookingCoachesList,
  setDestinationCounterId,
  setFromCounterId,
  setIsLoadingBookingCoachesList,
  setIsLoadingRoundTripGoBookingCoachesList,
  setIsLoadingRoundTripReturnBookingCoachesList,
  setMigrateBookedSeatList,
  setMigrateDate,
  setMigrateFromStationId,
  setMigrateToStationId,
} from "@/store/api/counter/counterSearchFilterSlice";
import { getAmountInBookingFromByClass } from "@/utils/helpers/getAmountInBookingFromByClass";
import { setDate } from "@/store/api/callcenter/callcenterSearchFilterSlice";
import { format } from "date-fns";
import TickitPrint from "@/pages/dashboard/printLabel/TickitPrint";
import { useReactToPrint } from "react-to-print";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { useLazyGetCoachConfigByCoachQuery } from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CancelSameTicket } from "@/pages/dashboard/counterRole/tickit/CancelSameTicket";

interface CouponData {
  isValid: boolean;
  discountType: "Fixed" | "Percentage";
  discount: number;
  couponCode: string;
  message: string;
}
export interface IMigrateSearch {
  coachNo: string;
  date: string | null;
  fromStationId: number | null;
  destinationStationId: number | null;
}

const MigrateSeat = () => {
  const { translate } = useCustomTranslator();
  const dispatch = useDispatch();
  const bookingState = useSelector(selectCounterSearchFilter);
  const printSaleRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const [bookingSearch, setBookingSearch] = useState<IMigrateSearch>({
    coachNo: "",
    date: null,
    fromStationId: null,
    destinationStationId: null,
  });

  const [migrateSearch, setMigrateSearch] = useState<IMigrateSearch>({
    coachNo: "",
    date: null,
    fromStationId: null,
    destinationStationId: null,
  });

  useEffect(() => {
    if (bookingSearch.fromStationId !== undefined) {
      dispatch(setFromCounterId(bookingSearch.fromStationId));
    }
    if (bookingSearch.destinationStationId !== undefined) {
      dispatch(setDestinationCounterId(bookingSearch.destinationStationId));
    }
    if (bookingSearch.date !== undefined) {
      dispatch(setDate(bookingSearch.date));
    }
  }, [bookingSearch, dispatch]);

  useEffect(() => {
    if (migrateSearch.fromStationId !== undefined) {
      dispatch(setMigrateFromStationId(migrateSearch.fromStationId));
    }
    if (migrateSearch.destinationStationId !== undefined) {
      dispatch(setMigrateToStationId(migrateSearch.destinationStationId));
    }
    if (migrateSearch.date !== undefined) {
      dispatch(setMigrateDate(migrateSearch.date));
    }
  }, [migrateSearch, dispatch]);

  // @ts-ignore
  const [couponResults, setCouponResults] = useState<
    Record<string, CouponData>
  >({});

  const [migrateTicket, setMigrateTicket] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [bookingCoachData, setBookingCoachData] = useState<any>(null);
  const [migrateCoachData, setMigrateCoachData] = useState<any>(null);
  const [allSameTicket, setAllSameTicket] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openMigrateModal, setOpenMigrateModal] = useState(false);

  const [popoverOpenFrom, setPopoverOpenFrom] = useState(false);
  const [popoverOpenTo, setPopoverOpenTo] = useState(false);

  const { data: coachListData, isLoading: coachListDataLoading } =
    useGetCoachesQuery({});
  const { data: countersData, isLoading: countersLoading } =
    useGetStationsQuery({});

  const [
    triggerBooking,
    { data: bookingCoachesData, isLoading: bookingLoading },
  ] = useLazyGetCoachConfigByCoachQuery();

  const [
    triggerMigrate,
    { data: migrateCoachesData, isLoading: migrateLoading },
  ] = useLazyGetCoachConfigByCoachQuery();

  const { handleSubmit, reset } = useForm();

  useEffect(() => {
    if (bookingCoachesData) {
      setBookingCoachData(bookingCoachesData);
    }
  }, [bookingCoachesData]);

  useEffect(() => {
    if (migrateCoachesData) {
      setMigrateCoachData(migrateCoachesData);
    }
  }, [migrateCoachesData]);

  useEffect(() => {
    if (bookingCoachData) {
      if (
        bookingState.fromStationId &&
        bookingState.toStationId &&
        bookingState.date &&
        bookingState.coachType
      ) {
        dispatch(setBookingCoachesList(bookingCoachesData?.data || []));
        dispatch(setBookedSeatList(bookingCoachesData?.bookedSeat || []));
      } else {
        dispatch(setBookingCoachesList([]));
        dispatch(setBookedSeatList([]));
      }
    }
  }, [
    bookingState.fromStationId,
    bookingState.toStationId,
    bookingState.date,
    bookingState.returnDate,
    bookingState.coachType,
    bookingState.orderType,
    bookingCoachesData,
    dispatch,
    bookingCoachData,
  ]);

  useEffect(() => {
    if (migrateCoachData) {
      if (
        bookingState.migrateFromStationId &&
        bookingState.migrateToStationId &&
        bookingState.migrateDate &&
        bookingState.coachType
      ) {
        dispatch(
          setMigrateBookedSeatList(migrateCoachesData?.bookedSeat || [])
        );
      } else {
        dispatch(setMigrateBookedSeatList([]));
      }
    }
  }, [
    bookingState.migrateFromStationId,
    bookingState.migrateToStationId,
    bookingState.migrateDate,
    bookingState.coachType,
    migrateCoachesData,
    dispatch,
    migrateCoachData,
  ]);

  useEffect(() => {
    if (bookingCoachData?.data) {
      dispatch(setIsLoadingRoundTripGoBookingCoachesList(false));
      dispatch(setIsLoadingRoundTripReturnBookingCoachesList(false));
      dispatch(setIsLoadingBookingCoachesList(bookingLoading));
    }
  }, [
    bookingState.orderType,
    bookingLoading,
    dispatch,
    bookingCoachData?.data,
  ]);

  const [bookingFormState, setBookingFormState] =
    useState<ICounterBookingFormStateProps>({
      selectedSeats: [],
      targetedSeat: null,
      redirectLink: null,
      customerName: null,
      redirectConfirm: false,
    });

  const [
    addBooking,
    {
      data: saleInfo,
      isLoading: addBookingLoading,
      isSuccess: addBookingSuccess,
      error: addBookingError,
    },
  ] = useMigrateBookingMutation();
  const [addBookingSeat] = useAddBookingSeatMutation();

  const [
    checkingSeat,
    { isLoading: checkingSeatLoading, error: checkingSeatError },
  ] = useCheckingSeatMutation();

  const [removeBookingSeat, { isLoading: removeBookingSeatLoading }] =
    useRemoveBookingSeatMutation({}) as any;

  useEffect(() => {
    if (selectedTicket) {
      handleMigrateTicket(selectedTicket);
      setOpenMigrateModal(false);
    }
  }, [selectedTicket]);

  // SELECT THE TICKET WILL BE MIGRATE
  const handleMigrateTicket = async (seatData: any) => {

    const coachData = bookingCoachData;
    const findTicket = coachData?.data?.orderSeat?.filter(
      (t: any) => t.seat === seatData?.seat
    );

    if (findTicket.length > 1) {
      setOpenMigrateModal(true);
      setAllSameTicket(findTicket);
    } else {
   
      const findTicket = coachData?.data?.orderSeat?.find(
        (t: any) => t.seat === seatData?.seat || t.seat===seatData
      );

    
      const filterTicket = coachData?.data?.orderSeat?.filter(
        (t: any) => t.orderId === findTicket?.orderId || t.orderId === selectedTicket
      );
      if (filterTicket?.length > 0) {
        setMigrateTicket(filterTicket);
        setSelectedIds(filterTicket.map((ticket: any) => ticket.id));
      } else {
        setMigrateTicket([]);
        setSelectedIds([]);
      }

      setBookingFormState((prevState) => ({
        ...prevState,
        selectedSeats: prevState.selectedSeats.filter(
          (seat) => seat.coachType !== "booking"
        ),
      }));
    }
  };

  const canMigrateSeat = (coachType: "booking" | "migrate") => {
    if (
      coachType !== "migrate" ||
      !bookingCoachData?.data ||
      !migrateCoachData?.data
    ) {
      return true; // Allow selection for booking coach or if data is missing
    }

    const bookingFare = getAmountInBookingFromByClass(
      bookingCoachData.data.coach,
      bookingCoachData.data.coachType,
      bookingCoachData.data.coachClass,
      bookingSearch
    );

    const migrateFare = getAmountInBookingFromByClass(
      migrateCoachData.data.coach,
      migrateCoachData.data.coachType,
      migrateCoachData.data.coachClass,
      migrateSearch
    );

    const isSameFare = bookingFare === migrateFare;
    const isDifferentDate =
      bookingCoachData.data.departureDate !==
      migrateCoachData.data.departureDate;
    const isSameRoute =
      bookingCoachData.data.coach.fromStationId ===
        migrateCoachData.data.coach.fromStationId &&
      bookingCoachData.data.coach.toStationId ===
        migrateCoachData.data.coach.toStationId;

    return isSameFare && isDifferentDate && isSameRoute;
  };

  const handleBookingSeat = async (
    seatData: any,
    coachType: "booking" | "migrate"
  ) => {
    const coachData =
      coachType === "booking" ? bookingCoachData : migrateCoachData;
    const searchData = coachType === "booking" ? bookingSearch : migrateSearch;

    if (
      !coachData?.data?.id ||
      !searchData.fromStationId ||
      !searchData.destinationStationId
    ) {
      toast.error(
        translate(
          "Missing required data for seat booking",
          "Missing required data for seat booking"
        )
      );
      return;
    }

    if (!canMigrateSeat(coachType)) {
      toast.error(
        translate(
          "Cannot select seat: Fare, date, or route conditions not met.",
          "Cannot select seat: Fare, date, or route conditions not met."
        )
      );
      return;
    }

    const isSeatAlreadySelected = bookingFormState.selectedSeats.some(
      (current: any) =>
        current.seat === seatData.seat && current.coachType === coachType
    );

    if (isSeatAlreadySelected) {
      const result = await removeBookingSeat({
        coachConfigId: coachData.data.id,
        // fromStationId: searchData.fromStationId,
        // destinationStationId: searchData.destinationStationId,
        seat: seatData.seat,
      });

      if (result?.data?.success) {
        setBookingFormState((prevState) => ({
          ...prevState,
          selectedSeats: prevState.selectedSeats.filter(
            (seat) =>
              !(seat.seat === seatData.seat && seat.coachType === coachType)
          ),
        }));
        if (coachType === "migrate") {
          dispatch(
            setMigrateBookedSeatList(
              bookingState.migrateBookedSeatList.filter(
                (seat: any) => seat !== seatData.seat
              )
            )
          );
        } else {
          dispatch(
            setBookedSeatList(
              bookingState.bookedSeatList.filter(
                (seat: any) => seat !== seatData.seat
              )
            )
          );
        }
        toast.success(
          translate("Seat removed successfully", "Seat removed successfully")
        );
      } else {
        toast.error(
          translate("Failed to remove seat", "Failed to remove seat")
        );
      }
    } else {
      const dynamicStation = {
        fromStationId: migrateSearch.fromStationId,
        toStationId: migrateSearch.destinationStationId,
      };
      const segmentFare =
        bookingCoachData?.data?.coach?.route?.Segment?.[0]?.SegmentFare?.find(
          (fare: any) =>
            fare.fromStationId === migrateSearch.fromStationId &&
            fare.toStationId === migrateSearch.destinationStationId
        );
      let currentAmount = getAmountInBookingFromByClass(
        bookingCoachData?.data?.coach,
        bookingCoachData?.data?.coach.coachType,
        bookingCoachData?.data?.coach.coachClass,
        dynamicStation
      );
      if (bookingCoachData?.data?.coach.coachClass === "S_Class") {
        if (seatData.seat.startsWith("L")) {
          currentAmount = segmentFare?.b_class_amount ?? 0;
        } else if (seatData.seat.startsWith("U")) {
          currentAmount = segmentFare?.sleeper_class_amount ?? 0;
        }
      }

      // @ts-ignore
      if (migrateTicket?.[0]?.fare !== currentAmount) {
        toast.error(
          "The fare for the migrated seat does not match the original booking."
        );
        return;
      }

      const result = await addBookingSeat({
        coachConfigId: coachData.data.id,
        // fromStationId: searchData.fromStationId,
        // destinationStationId: searchData.destinationStationId,
        seat: seatData.seat,
      });

      if (result?.data?.data?.available) {
        const segmentFare =
          bookingCoachData?.data?.coach?.route?.Segment?.[0]?.SegmentFare?.find(
            (fare: any) =>
              fare.fromStationId === migrateSearch.fromStationId &&
              fare.toStationId === migrateSearch.destinationStationId
          );

        let currentAmount = getAmountInBookingFromByClass(
          bookingCoachData?.data?.coach,
          bookingCoachData?.data?.coach.coachType,
          bookingCoachData?.data?.coach.coachClass,
          dynamicStation
        );

        if (bookingCoachData?.data?.coach.coachClass === "S_Class") {
          if (seatData.seat.startsWith("L")) {
            currentAmount = segmentFare?.b_class_amount ?? 0;
          } else if (seatData.seat.startsWith("U")) {
            currentAmount = segmentFare?.sleeper_class_amount ?? 0;
          }
        }
        setBookingFormState((prevState) => ({
          ...prevState,
          selectedSeats: [
            ...prevState.selectedSeats,
            {
              ...seatData,
              coachType,
              coachConfigId: coachData.data.id,
              date: coachData.departureDate,
              currentAmount: currentAmount,
              previousAmount: coachData.data.discount,
            },
          ],
        }));

        if (coachType === "migrate") {
          dispatch(
            setMigrateBookedSeatList([
              ...bookingState.migrateBookedSeatList,
              seatData.seat,
            ])
          );
        } else {
          dispatch(
            setBookedSeatList([...bookingState.bookedSeatList, seatData.seat])
          );
        }
        toast.success(
          translate("Seat added successfully", "Seat added successfully")
        );
      } else {
        toast.error(
          translate("Seat is not available", "Seat is not available")
        );
      }
    }
  };

  // ONSUBMIT FUNCTION
  const onSubmit = async (data: any) => {
    try {
      const migrateSeats = bookingFormState.selectedSeats.filter(
        (seat) => seat.coachType === "migrate"
      );

      if (migrateSeats.length !== selectedIds.length) {
        toast.error(
          translate(
            "The number of new seats must match the number of seats to cancel.",
            "The number of new seats must match the number of seats to cancel."
          )
        );
        return;
      }

      const totalAmount = migrateSeats.reduce((sum, seat) => {
        const coupon = couponResults[seat.seat];
        const discountAmount = coupon?.isValid
          ? coupon.discountType === "Fixed"
            ? coupon.discount
            : Math.round((seat.currentAmount * coupon.discount) / 100)
          : migrateCoachData?.data?.discount || 0;
        return sum + Math.max(0, seat.currentAmount - discountAmount);
      }, 0);

      // Map migrateTicket seats to their IDs for validation
      const migrateTicketMap = new Map(
        migrateTicket.map((ticket: any) => [ticket.seat, ticket])
      );

      // Extract customer data from migrateTicket[0].order
      // @ts-ignore
      const orderData = migrateTicket?.[0]?.order || {};

      const finalData = {
        coachConfigId: migrateCoachData?.data?.id,
        fromStationId:
          migrateSearch.fromStationId ||
          migrateCoachData?.data?.coach?.fromStationId,
        destinationStationId:
          migrateSearch.destinationStationId ||
          migrateCoachData?.data?.coach?.toStationId,
        counterId: orderData?.counterId || null,
        userId: orderData?.userId || null,
        customerName: orderData?.customerName || "N/A",
        orderType: "One_Trip",
        phone: orderData?.phone || " ",
        email: orderData?.email || " ",
        address: data.address || orderData?.address || " ",
        age: data.age || orderData?.age || " ",
        gender: orderData?.gender || undefined,
        nid: data.nid || orderData?.nid || " ",
        nationality: data.nationality || orderData?.nationality || " ",
        paymentMethod: data.paymentMethod || orderData?.paymentMethod || "Cash",
        paymentType: data.paymentType || orderData?.paymentType || "FULL",
        bookingType: "SeatIssue",
        boardingPoint:
          (migrateTicket?.[0] as any)?.fromStation?.name ||
          migrateSearch.fromStationId ||
          " ",
        droppingPoint:
          (migrateTicket?.[0] as any)?.toStation?.name ||
          migrateSearch.destinationStationId ||
          " ",
        noOfSeat: migrateSeats.length,
        amount: totalAmount,
        paymentAmount:
          data.paymentType === "PARTIAL"
            ? data.paymentAmount || totalAmount
            : totalAmount,
        date:
          migrateSearch.date ||
          migrateCoachData?.data?.departureDate ||
          format(new Date(), "yyyy-MM-dd"),
        cancelSeats: selectedIds, // From migrateTicket IDs
        seats: migrateSeats.map((seat) => {
          const coupon = couponResults[seat.seat];
          const discountAmount = coupon?.isValid
            ? coupon.discountType === "Fixed"
              ? coupon.discount
              : Math.round((seat.currentAmount * coupon.discount) / 100)
            : migrateCoachData?.data?.discount || 0;
          const ticketData = migrateTicketMap.get(seat.seat) || {};
          const finalFare = Math.max(0, seat.currentAmount - discountAmount);

          return {
            fromStationId:
              migrateSearch.fromStationId ||
              migrateCoachData?.data?.coach?.fromStationId,
            destinationStationId:
              migrateSearch.destinationStationId ||
              migrateCoachData?.data?.coach?.toStationId,
            class: migrateCoachData?.data?.coachClass,
            seat: seat.seat,
            unitPrice: ticketData.unitPrice || seat.currentAmount, // Use migrateTicket.unitPrice if available
            discount: discountAmount,
            fare: ticketData.fare || finalFare, // Use migrateTicket.fare if available
            coachConfigId: migrateCoachData?.data?.id,
            schedule: migrateCoachData?.data?.coach?.schedule || null,
            date:
              migrateSearch.date ||
              migrateCoachData?.data?.departureDate ||
              format(new Date(), "yyyy-MM-dd"),
            // originalSeatId: ticketData.id || null, // Reference to original seat ID
          };
        }),
      };

      const cleanedData = removeFalsyProperties(finalData, [
        "customerName",
        "nid",
        "email",
        "nationality",
        "userId",
        "address",
        "phone",
        "age",
        "gender",
        "paymentMethod",
        "paymentType",
        "boardingPoint",
        "droppingPoint",
        "counterId",
        "orderId",
        "ticketNo",
      ]);

      const booking = await addBooking(cleanedData);

      if (booking.data?.success) {
        handlePrint();
        toast.success(
          translate(
            `প্রিয় ${booking.data?.data?.customerName}, আপনার সিট সফলভাবে মাইগ্রেট করা হয়েছে! টিকেট নম্বর: ${booking.data?.data?.ticketNo}`,
            `Dear ${booking.data?.data?.customerName}, your seat has been successfully migrated! Ticket No: ${booking.data?.data?.ticketNo}`
          )
        );
        reset();
        setBookingFormState((prevState) => ({
          ...prevState,
          selectedSeats: [],
        }));
        setMigrateTicket([]);
        setSelectedIds([]);
      } else {
        toast.error(
          translate(
            "Migration failed. Please try again.",
            "Migration failed. Please try again."
          )
        );
      }
    } catch (error) {
      toast.error(
        translate(
          "An error occurred during migration.",
          "An error occurred during migration."
        )
      );
      console.error("Error:", error);
    }
  };

  const promiseResolveRef = useRef<any>(null);
  // UPDATE THE COMPONENT VIA REFERENCE
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_${saleInfo?.data?.ticketNo}`,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // RESET THE PROMISE RESOLVE SO WE CAN PRINT AGAIN
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
  });

  return (
    <section>
      <div className="flex items-center justify-between gap-5 p-4">
        <SearchMigrateSeatForm
          title="From Migration Information"
          searchData={bookingSearch}
          setSearchData={setBookingSearch}
          coachListDataLoading={coachListDataLoading}
          coachListData={coachListData}
          countersLoading={countersLoading}
          countersData={countersData}
          popoverOpen={popoverOpenFrom}
          setPopoverOpen={setPopoverOpenFrom}
          trigger={triggerBooking}
          resultData={bookingCoachData}
        />

        <SearchMigrateSeatTo
          searchData={migrateSearch}
          setSearchData={setMigrateSearch}
          coachListDataLoading={coachListDataLoading}
          coachListData={coachListData}
          countersLoading={countersLoading}
          countersData={countersData}
          popoverOpen={popoverOpenTo}
          setPopoverOpen={setPopoverOpenTo}
          trigger={triggerMigrate}
          resultData={migrateCoachData}
        />
      </div>

      <div className="grid grid-cols-10 items-center gap-3 p-2">
        {bookingLoading ? (
          <Loader />
        ) : (
          <>
            {bookingCoachData && (
              <div className="col-span-3">
                <PageTransition className="w-full flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300 max-w-[330px] mx-auto">
                  <SeatLayoutSelector
                    checkingSeat={checkingSeat}
                    bookingCoach={bookingCoachData?.data}
                    coachClass={bookingCoachData?.data?.coach?.coachClass}
                    // @ts-ignore
                    seatsAllocation={(() => {
                      switch (bookingCoachData?.data?.coachClass) {
                        case "E_Class":
                        case "B_Class":
                        case "Sleeper":
                        case "S_Class":
                          return dynamicSeatAllocation(
                            bookingCoachData?.data?.CoachConfigSeats
                          );
                        default:
                          return {
                            left: [],
                            right: [],
                            lastRow: [],
                            middle: [],
                          };
                      }
                    })()}
                    handleBookingSeat={(seatData: any) =>
                      handleBookingSeat(seatData, "booking")
                    }
                    bookingFormState={bookingFormState}
                    removeBookingSeatLoading={removeBookingSeatLoading}
                    bookedSeatList={bookingState.bookedSeatList}
                    handleCancelTicket={handleMigrateTicket}
                  />
                </PageTransition>
              </div>
            )}
          </>
        )}

        {migrateCoachData && (
          <div className="col-span-4">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <MigrateTicket
                migrateTickets={migrateTicket}
                setSelectedIds={setSelectedIds}
                selectedIds={selectedIds}
                bookingCoach={bookingCoachData?.data}
                migrateCoach={migrateCoachData?.data}
                bookingStationId={bookingSearch}
                migrateStationId={migrateSearch}
                selectedSeats={bookingFormState.selectedSeats}
              />
              <Submit
                loading={addBookingLoading || checkingSeatLoading}
                errors={addBookingError || checkingSeatError}
                submitTitle={translate("আসন নিশ্চিত করুন", "Confirm")}
                errorTitle={translate(
                  "আসন বুক করতে ত্রুটি হয়েছে",
                  "Seat Booking Error"
                )}
                className="py-0 my-0"
              />
            </form>
          </div>
        )}

        {migrateLoading ? (
          <Loader />
        ) : (
          <>
            {migrateCoachData && (
              <div className="col-span-3">
                <PageTransition className="w-full flex items-center flex-col max-w-[330px] mx-auto border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
                  <SeatLayoutSelector
                    checkingSeat={checkingSeat}
                    bookingCoach={migrateCoachData?.data}
                    coachClass={migrateCoachData?.data?.coach?.coachClass}
                    // @ts-ignore
                    seatsAllocation={(() => {
                      switch (migrateCoachData?.data.coachClass) {
                        case "E_Class":
                        case "B_Class":
                        case "Sleeper":
                        case "S_Class":
                          return dynamicSeatAllocation(
                            migrateCoachData?.data?.CoachConfigSeats
                          );
                        default:
                          return {
                            left: [],
                            right: [],
                            lastRow: [],
                            middle: [],
                          };
                      }
                    })()}
                    handleBookingSeat={(seatData: any) =>
                      handleBookingSeat(seatData, "migrate")
                    }
                    bookingFormState={bookingFormState}
                    removeBookingSeatLoading={removeBookingSeatLoading}
                    bookedSeatList={bookingState.migrateBookedSeatList}
                    disabled={!canMigrateSeat("migrate")}
                  />
                </PageTransition>
              </div>
            )}
          </>
        )}
      </div>
      <div className="invisible hidden -left-full">
        {addBookingSuccess && (
          <TickitPrint ref={printSaleRef} tickitData={saleInfo} />
        )}
      </div>

      <Dialog
        open={openMigrateModal}
        onOpenChange={(open: boolean) => setOpenMigrateModal(open)}
      >
        <DialogContent size="lg">
          <DialogTitle className="sr-only">Migrate Ticket</DialogTitle>
          <CancelSameTicket
            seats={allSameTicket}
            setSelectedTicket={setSelectedTicket}
            selectedTicket={selectedTicket}
            stationId={
              bookingSearch.fromStationId || migrateSearch.fromStationId
            }
            setOpenCancelModal={setOpenMigrateModal}
            handleCancelTicket={handleMigrateTicket}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MigrateSeat;
