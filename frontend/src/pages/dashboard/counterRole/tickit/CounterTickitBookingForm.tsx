/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INationalityOptionsProps,
  nationalitiesOptions,
} from "@/utils/constants/common/nationalitiesOptions";
import { addBookingSeatForm } from "@/utils/constants/form/addBookingForm";
import { dynamicSeatAllocation } from "@/utils/helpers/dynamicSeatAllocation";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useReactToPrint } from "react-to-print";

import PageTransition from "@/components/common/effect/PageTransition";
import Submit from "@/components/common/form/Submit";
import { Paragraph } from "@/components/common/typography/Paragraph";
import {
  useAddBookingSeatMutation,
  useCheckingSeatMutation,
  useCounterAddBookingMutation,
  useGetTickitInfoByPhoneQuery,
  useLazyGetBookingCoachesQuery,
  useOrderCancelRequestMutation,
  useRemoveBookingSeatMutation,
  useUnBookSeatFromCounterBookingMutation,
} from "@/store/api/bookingApi";
import {
  counterPaymentMethodOptions,
  ICounterPaymentMethodOptions,
} from "@/utils/constants/common/paymentMethodOptions";

import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { totalCalculator } from "@/utils/helpers/totalCalculator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import SeatLayoutSelector from "@/components/common/busSeatLayout/SeatLayoutSelector";
import { Label } from "@/components/common/typography/Label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  addBookingSeatFromCounterProps,
  addBookingSeatFromCounterSchema,
} from "@/schemas/counter/addBookingSeatFromCounter";
import { useGetPartialInfoAllQuery } from "@/store/api/vehiclesSchedule/partialApi";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { shareWithLocal } from "@/utils/helpers/shareWithLocal";
import { format } from "date-fns";
// import { LuRefreshCw } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import TickitPrint from "../../printLabel/TickitPrint";
import SeatStatus from "./SeatStatus";
import Status from "./Status";
import TripSheet from "./TripSheet";
import { getAmountInBookingFromByClass } from "@/utils/helpers/getAmountInBookingFromByClass";
import CancelTicket from "../CancelTicket";
import { Loader } from "@/components/common/Loader";
import CancelTicketForm from "../CancelTicketForm";
import POSCounterTicketPrint from "../../printLabel/POSCounterTicketPrint";
import { useCheckDiscountValidityQuery } from "@/store/api/discount/discountApi";
import { CounterVanishListTable } from "@/components/common/form/CounterVanishListTable";
import { useDebounce } from "@/utils/helpers/debounceHook";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useGetFundMoneyQuery } from "@/store/api/counter/fundApi";
import { useAddCoachArrivedDepartedMutation } from "@/store/api/vehiclesSchedule/coachConfigurationApi";

import { CancelSameTicket } from "./CancelSameTicket";
import {
  setBookedSeatList,
  setBookingCoachesList,
  setIsLoadingBookingCoachesList,
  setIsLoadingRoundTripGoBookingCoachesList,
  setIsLoadingRoundTripReturnBookingCoachesList,
} from "@/store/api/counter/counterSearchFilterSlice";

interface ICounterBookingFormProps {
  bookingCoach: any;
  sharedFormState: any; // Renamed state
  setSharedFormState: (formState: any) => void;
  bookedSeatList: any[];
  stationId: any;
}
export interface ICounterBookingFormStateProps {
  targetedSeat: number | null;
  selectedSeats: any[];

  redirectLink: string | null;
  customerName: string | null;
  redirectConfirm: boolean;
}
interface CouponData {
  isValid: boolean;
  discountType: "Fixed" | "Percentage";
  discount: number;
  couponCode: string;
  message: string;
}

const isToday = (dateString: any) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getUTCFullYear() === today.getUTCFullYear() &&
    date.getUTCMonth() === today.getUTCMonth() &&
    date.getUTCDate() === today.getUTCDate()
  );
};

const CounterTickitBookingForm: FC<ICounterBookingFormProps> = ({
  bookingCoach,
  sharedFormState,
  setSharedFormState,
  bookedSeatList,
  stationId,
}) => {
  const { permission, counter } = shareAuthentication();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bookingType, setBookingType] = useState("SeatIssue");
  const [cancelType, setCancelType] = useState("CancelSeat");
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    undefined
  );

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [expirationTime, setExpirationTime] = useState<Date>(new Date());
  const { translate } = useCustomTranslator();
  const user = useSelector((state: any) => state.user);
  const [status, setStatus] = useState(false);
  const [statusBookingCoach, setStatusBookingCoach] = useState({
    CounterBookedSeat: [],
    orderSeat: [],
  });

  const [mainStations, setMainStations] = useState({
    toStationId: null,
    fromStationId: null,
  });
  useEffect(() => {
    if (bookingCoach?.coach) {
      setMainStations((prev) => ({
        ...prev,
        fromStationId: bookingCoach?.coach?.route?.fromStation?.id,
        toStationId: bookingCoach?.coach?.route?.toStation?.id,
      }));
    } else {
      setMainStations({ toStationId: null, fromStationId: null });
    }
  }, []);

  const [tripSheet, setTripSheet] = useState(false);
  const [printType, setPrintType] = useState<string>(
    localStorage.getItem("printType") || "default"
  );

  useEffect(() => {
    if (printType) {
      localStorage.setItem("printType", printType);
    }
  }, [printType]);

  const [seatStatus, setSeatStatus] = useState(false);
  const [seatStatusBooking, setSeatStatusBooking] = useState({
    CounterBookedSeat: [],
    orderSeat: [],
  });

  const [couponInputs, setCouponInputs] = useState<Record<string, string>>({});
  const [activeSeatId, setActiveSeatId] = useState<string | null>(null);
  const [couponResults, setCouponResults] = useState<
    Record<string, CouponData>
  >({});

  const { data: fund } = useGetFundMoneyQuery({});
  const currentCouponArg = activeSeatId ? couponInputs[activeSeatId] || "" : "";
  // Use debounce for API calls
  const debouncedCoupon = useDebounce(currentCouponArg, 1000);

  const {
    currentData,
    error,
    isError,
    isLoading: couponLoading,
  } = useCheckDiscountValidityQuery(debouncedCoupon, {
    skip: !activeSeatId || !debouncedCoupon, // skip if no seat or empty input
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!activeSeatId) return;

    const resp = currentData;

    // If error, clear input and show toast
    if (isError) {
      toast.error((error as any)?.data?.message || "Invalid coupon");

      setCouponInputs((prev) => ({
        ...prev,
        [activeSeatId]: "", // clear input
      }));

      //@ts-ignore
      setCouponResults((prev) => ({
        ...prev,
        [activeSeatId]: {
          isValid: false,
          message: (error as any)?.data?.message || "Invalid coupon",
          discountType: "Fixed",
          discount: 0,
        },
      }));
      return;
    }

    // If success, update couponResults
    if (resp) {
      if (resp.success) {
        //@ts-ignore
        setCouponResults((prev) => ({
          ...prev,
          [activeSeatId]: {
            isValid: true,
            discountType: resp.data.discountType,
            discount: resp.data.discount,
            message: resp.message,
            couponData: resp.data,
          },
        }));
      } else {
        //@ts-ignore
        setCouponResults((prev) => ({
          ...prev,
          [activeSeatId]: {
            isValid: false,
            discountType: "Fixed",
            discount: 0,
            message: resp.message || "Invalid coupon",
          },
        }));
      }
    }
  }, [debouncedCoupon, currentData, isError, error, activeSeatId]);

  const prevCouponResultsRef = useRef<Record<string, CouponData>>({});

  useEffect(() => {
    if (!activeSeatId) return;

    const prev = prevCouponResultsRef.current[activeSeatId];
    const current = couponResults[activeSeatId];

    // Only show toast if this seat's coupon result has changed
    if (current && current !== prev) {
      if (current.isValid) {
        toast.success(`Seat ${activeSeatId}: ${current?.message}`);
      } else {
        toast.error(`Seat ${activeSeatId}: ${current?.message}`);
        setCouponInputs((prev) => ({
          ...prev,
          [activeSeatId]: "",
        }));
      }
    }

    // Update ref for next render
    prevCouponResultsRef.current = { ...couponResults };
  }, [couponResults, activeSeatId]);

  const handleCouponChange = (seatId: string, value: string) => {
    setActiveSeatId(seatId);
    setCouponInputs((prev) => ({
      ...prev,
      [seatId]: value,
    }));

    // Immediately clear discount if input is empty or 0
    if (!value || value === "0") {
      // @ts-ignore
      setCouponResults((prev) => ({
        ...prev,
        [seatId]: {
          isValid: false,
          message: "No coupon applied",
          discountType: "Fixed",
          discount: 0,
        },
      }));
    }
  };
  // REFERENCE FOR PRINT SELECTED COMPONENT
  const printSaleRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  // const [clear, setClear] = useState(false);
  const [saleData, setSaleData] = useState<any>();
  const [updateLocal, setUpdateLocal] = useState<boolean>(false);

  //const [popoverOpen, setPopoverOpen] = useState(false);
  const [bookingFormState, setBookingFormState] =
    useState<ICounterBookingFormStateProps>({
      selectedSeats: [],
      targetedSeat: null,
      redirectLink: null,
      customerName: null,
      redirectConfirm: false,
    });

  const [cancelTickets, setCancelTickets] = useState([]);
  const [allSameTicket, setAllSameTicket] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [handleBookingClicked, setHandleBookingClicked] =
    useState<boolean>(false);
  const [handleCancelClicked, setHandleCancelClicked] =
    useState<boolean>(false);
  const [handleCancelBookedClicked, setHandleCancelBookedClicked] =
    useState<boolean>(false);

  const [removeBookingSeat, { isLoading: removeBookingSeatLoading }] =
    useRemoveBookingSeatMutation({}) as any;
  const [unBookSeatFromCounterBooking] =
    useUnBookSeatFromCounterBookingMutation({}) as any;
  const { data: partialData } = useGetPartialInfoAllQuery({});
  const [
    addBooking,
    {
      data: saleInfo,
      isLoading: addBookingLoading,
      isSuccess: addBookingSuccess,
      error: addBookingError,
    },
  ] = useCounterAddBookingMutation();

  const [cancelRequest, { isLoading: cancelRequestLoading }] =
    useOrderCancelRequestMutation();
  const [
    checkingSeat,
    { isLoading: checkingSeatLoading, error: checkingSeatError },
  ] = useCheckingSeatMutation();
  const [addBookingSeat] = useAddBookingSeatMutation();
  const [addCoachArrivedDeparted] = useAddCoachArrivedDepartedMutation();

  const totalAmount =
    totalCalculator(bookingFormState?.selectedSeats, "currentAmount") || 0;
  const totalSeats = bookingFormState?.selectedSeats?.length || 0;
  const seatsAllocation = (() => {
    switch (bookingCoach.coachClass) {
      case "E_Class":
      case "B_Class":
      case "Sleeper":
      case "S_Class":
        return dynamicSeatAllocation(bookingCoach?.CoachConfigSeats);
      default:
        return { left: [], right: [], lastRow: [], middle: [] };
    }
  })();

  // STORE PROMISE RESOLVE REFERENCE
  const promiseResolveRef = useRef<any>(null);

  // UPDATE THE COMPONENT VIA REFERENCE
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }

    if (saleInfo && updateLocal) {
      shareWithLocal("set", `${appConfiguration.appCode}`, {
        saleInfo,
      });
      setUpdateLocal(false);
    }
  }, [isPrinting, saleInfo, updateLocal]);

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
      // setClear(false);
      setSaleData({});
    },
  });

  const calculateTotalDiscount = () => {
    let totalFixedDiscount = 0;
    let totalPercentageDiscount = 0;
    let totalDiscountedPrice = 0;

    bookingFormState?.selectedSeats?.forEach((seat) => {
      const coupon = couponResults[seat.seat];
      if (coupon?.isValid) {
        if (coupon.discountType === "Fixed") {
          totalFixedDiscount += coupon.discount;
          totalDiscountedPrice += Math.max(
            0,
            seat.currentAmount - coupon.discount
          );
        } else {
          const discountAmount = seat.currentAmount * (coupon.discount / 100);
          totalPercentageDiscount += discountAmount;
          totalDiscountedPrice += seat.currentAmount - discountAmount;
        }
      } else {
        totalDiscountedPrice += seat.currentAmount;
      }
    });

    return {
      totalFixedDiscount,
      totalPercentageDiscount,
      totalDiscount: totalFixedDiscount + totalPercentageDiscount,
      totalDiscountedPrice,
      totalOriginalPrice: bookingFormState?.selectedSeats?.reduce(
        (sum, seat) => sum + seat.currentAmount,
        0
      ),
    };
  };

  // const calculateTotalDiscount = () => {
  //   let totalFixedDiscount = 0;
  //   let totalPercentageDiscount = 0;
  //   let totalDiscountedPrice = 0;

  //   bookingFormState?.selectedSeats?.forEach((seat) => {
  //     const coupon = couponResults[seat.seat];
  //     if (coupon?.isValid) {
  //       if (coupon.discountType === "Fixed") {
  //         totalFixedDiscount += coupon.discount;
  //         totalDiscountedPrice += Math.max(
  //           0,
  //           seat.currentAmount - seat.previousAmount - coupon.discount
  //         );
  //       } else {
  //         const discountAmount =
  //           (seat.currentAmount - seat.previousAmount) *
  //           (coupon.discount / 100);
  //         totalPercentageDiscount += discountAmount;
  //         totalDiscountedPrice +=
  //           seat.currentAmount - seat.previousAmount - discountAmount;
  //       }
  //     } else {
  //       totalDiscountedPrice += seat.currentAmount - seat.previousAmount;
  //     }
  //   });

  //   return {
  //     totalFixedDiscount,
  //     totalPercentageDiscount,
  //     totalDiscount: totalFixedDiscount + totalPercentageDiscount,
  //     totalDiscountedPrice,
  //     totalOriginalPrice: bookingFormState?.selectedSeats?.reduce(
  //       (sum, seat) => sum + (seat.currentAmount - seat.previousAmount),
  //       0
  //     ),
  //   };
  // };

  // Usage example:
  const { totalDiscount, totalDiscountedPrice, totalOriginalPrice } =
    calculateTotalDiscount();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, errors },
  } = useForm<addBookingSeatFromCounterProps>({
    resolver: zodResolver(addBookingSeatFromCounterSchema),
    defaultValues: useMemo(
      () => ({
        gender: "Male",
        paymentType: "FULL",
        ...sharedFormState,
      }),
      [sharedFormState]
    ),
  });
  const {
    data: userInfoData,

    refetch,
  } = useGetTickitInfoByPhoneQuery(phoneNumber, {
    skip: phoneNumber.length !== 11,
  }) as any;
  useEffect(() => {
    if (phoneNumber.length === 11) {
      refetch();
    }
  }, [phoneNumber, refetch]);
  const handleFieldUpdate = (fieldName: string, value: any) => {
    setSharedFormState((prevState: any) => ({
      ...prevState,
      [fieldName]: value,
    }));
    setValue(fieldName as keyof addBookingSeatFromCounterProps, value);
  };
  useEffect(() => {
    if (userInfoData?.data) {
      const {
        name,
        phone,
        gender,
        email,
        address,
        nationality,
        nid,
        boardingPoint,
        droppingPoint,
      } = userInfoData?.data;

      const updatedFields = {
        customerName: name || "",
        phone: phone || "",
        gender: gender || "Male",
        email: email || "",
        address: address || "",
        nationality: nationality || "",
        nid: nid || "",
        boardingPoint: boardingPoint || "",
        droppingPoint: droppingPoint || "",
      };

      setSharedFormState((prevState: any) => ({
        ...prevState,
        ...updatedFields,
      }));

      Object.entries(updatedFields).forEach(([key, value]) => {
        setValue(key as keyof addBookingSeatFromCounterProps, value);
      });
    }
  }, [userInfoData, setValue, setSharedFormState]);
  useEffect(() => {
    if (bookingCoach) {
      setStatusBookingCoach({
        CounterBookedSeat: bookingCoach?.CounterBookedSeat,
        orderSeat: bookingCoach?.orderSeat,
      });
    }

    setSeatStatusBooking({
      CounterBookedSeat: bookingCoach?.CounterBookedSeat,
      orderSeat: bookingCoach?.orderSeat,
    });
  }, [bookingCoach]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        counterId: undefined,
        customerName: "",
        paymentType: "FULL",
        paymentAmount: undefined,
        gender: "Male",
        phone: "",
        email: "",
        address: "",
        nid: "",
        nationality: undefined,
        paymentMethod: undefined,
        boardingPoint: undefined,
        droppingPoint: undefined,
        noOfSeat: 0,
        amount: 0,
        date: bookingCoach?.departureDate || "",
        seats: [],
      });
      setBookingFormState({
        targetedSeat: null,
        selectedSeats: [],
        redirectLink: null,

        customerName: null,
        redirectConfirm: false,
      });
      setSharedFormState({
        paymentType: "FULL",
        customerName: "",
        phone: "",
        gender: "Male",
        email: "",
        address: "",
        nationality: "",
        nid: "",
        boardingPoint: "",
        droppingPoint: "",
      });
      setBookingType("SeatIssue");
      setExpirationDate(undefined);
      setExpirationTime(new Date());
    }
  }, [
    isSubmitSuccessful,
    reset,
    bookingCoach?.departureDate,
    setSharedFormState,
  ]);

  const handleBookingSeat = async (seatData: any) => {
    const fromStation = bookingCoach?.coach?.CoachViaRoute?.find(
      (r: any) => r.counter.name === sharedFormState.boardingPoint
    );
    const toStation = bookingCoach?.coach?.CoachViaRoute?.find(
      (r: any) => r.counter.name === sharedFormState.droppingPoint
    );

    const dynamicStation = {
      fromStationId:
        fromStation?.counter?.stationId || stationId?.fromStationId,
      toStationId: toStation?.counter?.stationId || stationId?.toStationId,
    };

    const isSeatAlreadySelected = bookingFormState.selectedSeats.some(
      (seat) => seat.seat === seatData.seat
    );

    const bookedByCounter = bookingCoach?.CounterBookedSeat?.find(
      (order: any) => order.seat === seatData.seat
    );

    setHandleCancelBookedClicked(!!bookedByCounter);

    if (isSeatAlreadySelected) {
      // Seat is already selected → remove via API
      const result = await removeBookingSeat({
        coachConfigId: bookingCoach?.id,
        seat: seatData.seat,
      });

      if (result?.data?.success) {
        // Only update state if API call succeeds
        setBookingFormState((prevState) => ({
          ...prevState,
          selectedSeats: prevState.selectedSeats.filter(
            (seat) => seat.seat !== seatData.seat
          ),
        }));
      } else {
        toast.error("Failed to remove seat. Try again.");
      }
    } else {
      if (bookingFormState?.selectedSeats?.length >= 12) {
        toast.error("Maximum 12 seats can be selected per booking.");
        return;
      }
      // Seat is not selected → add it
      let currentAmount = getAmountInBookingFromByClass(
        bookingCoach.coach,
        bookingCoach.coach.coachType,
        bookingCoach.coach.coachClass,
        dynamicStation
      );

      if (bookingCoach.coach.coachClass === "S_Class") {
        const segmentFare =
          bookingCoach?.coach?.route?.Segment?.[0]?.SegmentFare?.find(
            (fare: any) =>
              fare.fromStationId === dynamicStation.fromStationId &&
              fare.toStationId === dynamicStation.toStationId
          );

        if (seatData.seat.startsWith("L")) {
          currentAmount = segmentFare?.b_class_amount ?? 0;
        } else if (seatData.seat.startsWith("U")) {
          currentAmount = segmentFare?.sleeper_class_amount ?? 0;
        }
      }

      const updatedSeats = [
        ...bookingFormState.selectedSeats,
        {
          ...seatData,
          coachConfigId: bookingCoach?.id,
          currentAmount,
          previousAmount: bookingCoach?.discount,
        },
      ];

      // Check balance before calling API
      const newTotal = updatedSeats.reduce(
        (total: number, seat: any) =>
          total + ((seat?.currentAmount || 0) - (seat?.previousAmount || 0)),
        0
      );

      if (permission?.isPrepaid && newTotal > (fund?.data?.balance || 0)) {
        toast.error("Not enough balance!");
        return; // Exit early, do not call API
      }

      // Call API to add seat
      const result = await addBookingSeat({
        coachConfigId: bookingCoach?.id,
        seat: seatData.seat,
      });

      if (!result?.data?.data?.available) {
        toast.error(
          // @ts-ignore
          (result?.error?.data?.message as string) ||
            "Something went wrong, please select another seat"
        );
        return;
      }

      // Update state
      setBookingFormState((prevState) => ({
        ...prevState,
        selectedSeats: updatedSeats,
      }));
    }

    // Update flags
    setHandleBookingClicked(true);
    setHandleCancelClicked(false);
  };

  const handleCancelCancelRequest = () => {
    setHandleCancelClicked(false);
  };

  useEffect(() => {
    if (selectedTicket) {
      handleCancelTicket(selectedTicket);
      setOpenCancelModal(false);
    }
  }, [selectedTicket]);

  const handleCancelTicket = async (seatData: any) => {
    setHandleBookingClicked(false);
    setHandleCancelClicked(true);
    const findTickets = bookingCoach?.orderSeat?.filter(
      (s: any) => s.seat === seatData?.seat && s.status === "Success"
    );

    if (findTickets?.length > 1) {
      setOpenCancelModal(true);
      setAllSameTicket(findTickets);
    } else {
      const findTicket = bookingCoach?.orderSeat?.find(
        (t: any) => t.seat === seatData?.seat && t.status === "Success"
      );

      const filterTicket = bookingCoach?.orderSeat?.filter(
        (t: any) =>
          t.status === "Success" &&
          (t.orderId === findTicket?.orderId || t.orderId === selectedTicket)
      );

      // const fromStation = bookingCoach?.coach?.CoachViaRoute?.find(
      //   (r: any) => r.counter.name === sharedFormState.boardingPoint
      // );

      // const toStation = bookingCoach?.coach?.CoachViaRoute?.find(
      //   (r: any) => r.counter.name === sharedFormState.droppingPoint
      // );
      if (filterTicket?.length > 0) {
        setCancelTickets(filterTicket);
      } else {
        setCancelTickets([]);
      }

      if (bookingFormState?.selectedSeats?.length > 0) {
        const promises = bookingFormState.selectedSeats.map((seat) =>
          removeBookingSeat({
            coachConfigId: bookingCoach?.id,
            // fromStationId: fromStation.counter.stationId,
            // destinationStationId: toStation.counter.stationId,
            seat: seat.seat,
          })
        );

        // Wait for all API calls to complete
        await Promise.all(promises);
      }
      setBookingFormState((prevState) => ({
        ...prevState,
        selectedSeats: [],
      }));
    }
  };


  const handleCancelRequest = async () => {
    const result = await cancelRequest({ seats: selectedIds });

    if (result?.data?.success) {
      toast.success(
        translate(
          "Booking canceled successfully.",
          "বুকিং সফলভাবে বাতিল করা হয়েছে।"
        )
      );
      setCancelTickets([]);
    } else {
      toast.error(
        translate(
          "এই অর্ডারটি কাউন্টার দ্বারা বুক করা হয়নি।",
          //@ts-ignore
          result?.error?.data?.message
        )
      );
    }
  };

  useEffect(() => {
    setValue("amount", totalDiscountedPrice);
    setValue("noOfSeat", totalSeats);
    setValue("date", bookingCoach?.departureDate);
    setValue("counterId", user?.counterId);
    setValue("userId", user?.id);
    setValue("paymentMethod", "cash");

    if (bookingFormState?.selectedSeats?.length) {
      setValue(
        "seats",
        bookingFormState.selectedSeats.map((singleSeat: any) => singleSeat.seat)
      );
    }
  }, [
    bookingCoach,
    bookingFormState.selectedSeats,
    setValue,
    totalAmount,
    totalDiscountedPrice,
    totalSeats,
    user?.counterId,
    user?.id,
  ]);

  const paymentType = watch("paymentType");
  const partialAmount = watch("paymentAmount");
  //@ts-ignore
  const paymentMethod = watch("paymentMethod");
  const dueAmount = partialAmount
    ? totalDiscountedPrice - partialAmount
    : totalDiscountedPrice;

  const minimumPartialPayment = useMemo(() => {
    if (partialData?.data?.partialPercentage) {
      return (totalDiscountedPrice * partialData.data.partialPercentage) / 100;
    }
    return 0;
  }, [totalDiscountedPrice, partialData]);
  useEffect(() => {
    if (paymentType === "PARTIAL") {
      setValue("paymentAmount", minimumPartialPayment);
    } else if (paymentType === "FULL") {
      setValue("paymentAmount", totalDiscountedPrice);
    }
  }, [paymentType, minimumPartialPayment, totalDiscountedPrice, setValue]);

  const handleCancelBooking = async () => {
    // Define the data structure for seats to cancel
    const data = {
      seats: bookingFormState.selectedSeats.map((seat) => ({
        seat: seat.seat,
        coachConfigId: bookingCoach.id,
        fromStationId: stationId?.fromStationId,
        destinationStationId: stationId?.toStationId,
      })),
    };

    try {
      // Call the unbook API with the prepared data
      const response = await unBookSeatFromCounterBooking(data).unwrap();

      if (response.success) {
        setBookingFormState((prevState) => ({
          ...prevState,
          selectedSeats: [],
        }));
        toast.success(
          translate(
            "Booking canceled successfully.",
            "বুকিং সফলভাবে বাতিল করা হয়েছে।"
          )
        );
        setHandleCancelBookedClicked(false);
      }
    } catch (error) {
      console.error(
        translate(
          "Failed to cancel booking:",
          "বুকিং বাতিল করতে ব্যর্থ হয়েছে:"
        ),
        error
      );
      toast.error(
        translate(
          "Failed to cancel booking.",
          "বুকিং বাতিল করতে ব্যর্থ হয়েছে।"
        )
      );
    }
  };

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

      // const fromStation = bookingCoach?.coach?.CoachViaRoute?.find(
      //   (r: any) => r.counter.name === sharedFormState.boardingPoint
      // );

      // const toStation = bookingCoach?.coach?.CoachViaRoute?.find(
      //   (r: any) => r.counter.name === sharedFormState.droppingPoint
      // );
      // Iterate over selected seats and call `removeBookingSeat` for each
      const promises = bookingFormState.selectedSeats.map((seat) =>
        removeBookingSeat({
          coachConfigId: bookingCoach?.id,
          // fromStationId: fromStation.counter.stationId,
          // destinationStationId: toStation.counter.stationId,
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

  //on submit
  const onSubmit = async (data: addBookingSeatFromCounterProps) => {
    const amount = Number(watch("amount"));
    if (amount === 0) {
      toast.error(
        "You need to select a seat or make sure your boarding and destination points are not the same."
      );
      return;
    }

    const fromStation = bookingCoach?.coach?.CoachViaRoute?.find(
      (r: any) => r.counter.name === sharedFormState.boardingPoint
    );

    const toStation = bookingCoach?.coach?.CoachViaRoute?.find(
      (r: any) => r.counter.name === sharedFormState.droppingPoint
    );

    const cleanedData = removeFalsyProperties(data, [
      "customerName",
      "nid",
      "email",
      "nationality",
      "address",
    ]);

    try {
      const finalData = {
        ...cleanedData,
        coachConfigId: bookingCoach?.id,
        bookingType: bookingType,
        fromStationId: fromStation.counter.stationId,
        orderType: "One_Trip",
        destinationStationId: toStation.counter.stationId,
        seats: bookingFormState.selectedSeats.map((seat) => {
          const coupon = couponResults[seat.seat];

          // Calculate discount amount
          const discountAmount = coupon?.isValid
            ? coupon.discountType === "Fixed"
              ? coupon.discount
              : Math.round((seat.currentAmount * coupon.discount) / 100)
            : 0;

          const finalFare = Math.max(0, seat.currentAmount - discountAmount);
          const matchedRoute = bookingCoach?.coach?.CoachViaRoute?.find(
            (s: any) => s?.counter?.stationId === stationId?.fromStationId
          );
          return {
            seat: seat.seat,
            coachConfigId: bookingCoach.id,
            schedule: matchedRoute?.boardingTime,
            unitPrice: seat.currentAmount,
            discount: discountAmount,
            fare: finalFare,
            date: bookingCoach.departureDate,
            fromStationId: fromStation.counter.stationId,
            destinationStationId: toStation.counter.stationId,
          };
        }),
        ...(bookingType === "SeatBooking" && {
          expiryBookingDate: expirationDate
            ? format(expirationDate, "yyyy-MM-dd")
            : undefined,
          expiryBookingTime: expirationTime
            ? expirationTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : undefined,
        }),
      };

      const booking = await addBooking(finalData);

      if (booking.data?.success) {
        setUpdateLocal(true);
        // AFTER COMPLETE THE ADDING SALE CALL TO PRINT
        if (bookingType !== "SeatBooking") {
          handlePrint();
        }

        // setClear(true);
        toast.success(
          translate(
            `প্রিয় ${booking.data?.data?.customerName}, আপনার সিট সফলভাবে বুক করা হয়েছে! আমাদের সেবা ব্যবহার করার জন্য ধন্যবাদ।`,
            `Dear ${booking.data?.data?.customerName}, your seat has been successfully booked! Thank you for choosing our service.`
          )
        );
        reset();
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during booking submission.");
      console.error("Error:", error);
    }
  };
  const invoiceReprintHandler = () => {
    // AFTER COMPLETE THE ADDING SALE CALL TO PRINT
    const data = shareWithLocal("get", `${appConfiguration.appCode}`);
    setSaleData(data);
    handlePrint();
  };


  const findArrived = bookingCoach.CoachArrivedDepart?.find(
    (item: any) => item?.counter?.id === counter?.id
  );

  const coachViaRoute = bookingCoach?.coach?.CoachViaRoute; // first response
  const counterStationId = counter.stationId; // second response

  const index = coachViaRoute.findIndex(
    (item: { stationId: number }) => item.stationId === counterStationId
  );

  let previousArrived;

  if (index > 0) {
    const prevStationId = coachViaRoute[index - 1];
    const myStationId = coachViaRoute[index];
    const myArrived = bookingCoach.CoachArrivedDepart.find(
      (item: any) => item?.counter?.stationId === myStationId.stationId
    );

    if (!myArrived) {
      const preArrived = bookingCoach.CoachArrivedDepart.find(
        (item: any) => item?.counter?.stationId === prevStationId.stationId
      );
      if (preArrived) {
        previousArrived = preArrived;
      }
      bookingCoach.CoachArrivedDepart.find(
        (item: any) => item.stationId === myStationId.stationId
      );
    }
  }

  const handleArrivedDeparted = async (type: string) => {
    try {
      const res = await addCoachArrivedDeparted({
        type,
        coachConfigId: bookingCoach?.id,
      }).unwrap();
      if (res?.success) {
        toast.success(`${res?.message}`);
      }
    } catch (err) {
      toast.error(`Failed to update ${type} status.`);
    }
  };

  const viaRoute = useMemo(
    () => bookingCoach?.coach?.CoachViaRoute || [],
    [bookingCoach?.coach?.CoachViaRoute]
  );

  // const fromIndex = viaRoute.findIndex(
  //   (item: any) => item?.counter?.stationId === stationId?.fromStationId
  // );
  // const toIndex = viaRoute.findIndex(
  //   (item: any) => item?.counter?.stationId === stationId?.toStationId
  // );

  // let slicedViaRoute = useMemo(() => {
  //   if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
  //     return viaRoute.slice(fromIndex, toIndex + 1);
  //   }
  //   return [];
  // }, [viaRoute, fromIndex, toIndex]);

  // if (permission?.showOwnCounterBoardingPoint) {
  //   slicedViaRoute = slicedViaRoute.filter(
  //     (item: any) => item?.counter?.stationId === counter?.stationId
  //   );
  // }

  const [trigger, { isLoading: isLoadingBookingCoaches }] =
    useLazyGetBookingCoachesQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    const recalcFare = async () => {
      if (!sharedFormState.boardingPoint || !sharedFormState.droppingPoint)
        return;
      if (!viaRoute || !bookingCoach) return;

      const fromStation = viaRoute.find(
        (r: any) => r.counter.name === sharedFormState.boardingPoint
      );
      const toStation = viaRoute.find(
        (r: any) => r.counter.name === sharedFormState.droppingPoint
      );

      if (!fromStation || !toStation) return;

      const dynamicStation = {
        fromStationId: fromStation.counter.stationId,
        toStationId: toStation.counter.stationId,
      };

      // Fetch booked seats for this route segment
      const response = await trigger({
        fromStationId: dynamicStation.fromStationId,
        toStationId: dynamicStation.toStationId,
        coachType: bookingCoach?.coach?.coachType,
        date: bookingCoach?.departureDate,
        orderType: "One_Trip",
      }).unwrap();

      // Handle API response
      if (response?.data?.length === 0) {
        setBookingFormState((prevState) => ({
          ...prevState,
          selectedSeats: prevState.selectedSeats.map((seat) => ({
            ...seat,
            currentAmount: getAmountInBookingFromByClass(
              bookingCoach.coach,
              bookingCoach.coach.coachType,
              bookingCoach.coach.coachClass,
              mainStations
            ),
          })),
        }));
        return;
      } else {
        dispatch(setIsLoadingRoundTripGoBookingCoachesList(false));
        dispatch(setIsLoadingRoundTripReturnBookingCoachesList(false));
        dispatch(setIsLoadingBookingCoachesList(isLoadingBookingCoaches));

        if (dynamicStation.fromStationId && dynamicStation.toStationId) {
          dispatch(setBookingCoachesList(response?.data || []));
          dispatch(setBookedSeatList(response?.bookedSeat || []));
        } else {
          dispatch(setBookingCoachesList([]));
        }
      }

      const bookedSeats =
        response?.bookedSeat?.filter(
          (b: any) => b.coachConfigId === bookingCoach?.id
        ) || [];

      const updatedSeats: any[] = [];

      for (const seat of bookingFormState.selectedSeats) {
        const isBooked = bookedSeats.some((b: any) =>
          b.seat.includes(seat.seat)
        );

        if (isBooked) {
          toast.warning(`Seat ${seat.seat} is no longer available.`);
          await removeBookingSeat({
            coachConfigId: bookingCoach?.id,
            fromStationId: dynamicStation.fromStationId,
            destinationStationId: dynamicStation.toStationId,
            seat: seat.seat,
          });
        } else {
          // 🎯 Calculate current fare for this seat
          let currentAmount = getAmountInBookingFromByClass(
            bookingCoach.coach,
            bookingCoach.coach.coachType,
            bookingCoach.coach.coachClass,
            dynamicStation
          );

          // Special handling for S_Class (split between lower/upper)
          if (bookingCoach.coach.coachClass === "S_Class") {
            const segmentFare = bookingCoach.coach.route?.Segment?.flatMap(
              (seg: any) => seg?.SegmentFare || []
            ).find(
              (fare: any) =>
                fare.fromStationId === dynamicStation.fromStationId &&
                fare.toStationId === dynamicStation.toStationId
            );

            if (seat.seat.startsWith("L")) {
              currentAmount = segmentFare?.b_class_amount ?? 0;
            } else if (seat.seat.startsWith("U")) {
              currentAmount = segmentFare?.sleeper_class_amount ?? 0;
            }
          }

          updatedSeats.push({
            ...seat,
            currentAmount,
          });
        }
      }

      if (updatedSeats.length > 0) {
        setBookingFormState((prev) => ({
          ...prev,
          selectedSeats: updatedSeats,
        }));
      }
    };

    recalcFare();
  }, [
    sharedFormState.boardingPoint,
    sharedFormState.droppingPoint,
    viaRoute,
    bookingCoach,
  ]);

  return (
    <section>
      <PageTransition>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-2 max-w-7xl mx-auto">
            <div className="col-span-4 pb-10 max-w-[330px]">
              {isToday(findArrived?.arrivedDate) ? (
                <div className="flex justify-center gap-2 mb-3">
                  {findArrived ? (
                    <Button
                      className="group relative px-12 h-7 text-xs"
                      variant="secondary"
                      size="icon"
                      type="button"
                    >
                      <span>{translate("", "Arrived")}</span>
                    </Button>
                  ) : (
                    <Button
                      className="group relative px-12 h-7 text-xs"
                      variant="red"
                      size="icon"
                      onClick={() => handleArrivedDeparted("Arrived")}
                      type="button"
                    >
                      <span>{translate("", "Not Arrived")}</span>
                    </Button>
                  )}

                  {findArrived?.departDate ? (
                    <Button
                      className="group relative px-12 h-7 text-xs"
                      variant="secondary"
                      size="icon"
                      type="button"
                    >
                      <span>{translate("", "Departed")}</span>
                    </Button>
                  ) : (
                    <Button
                      className="group relative px-12 h-7 text-xs"
                      variant="red"
                      size="icon"
                      onClick={() => handleArrivedDeparted("Departed")}
                      type="button"
                    >
                      <span>{translate("", "Not Departed")}</span>
                    </Button>
                  )}
                </div>
              ) : null}

              {previousArrived && (
                <div className="text-center mb-2">
                  <p className="text-sm">
                    Previous Station: {previousArrived?.counter?.name}
                  </p>
                  <p className="text-sm">
                    Arrived At:{" "}
                    {new Date(previousArrived?.arrivedDate).toLocaleString(
                      "en-BD",
                      {
                        timeZone: "Asia/Dhaka",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )}
                  </p>
                </div>
              )}

              {previousArrived && (
                <div className="text-center mb-2">
                  <p className="text-sm">
                    Previous Station: {previousArrived?.counter?.name}
                  </p>
                  {previousArrived?.departDate && (
                    <p className="text-sm">
                      Departed At:{" "}
                      {new Date(previousArrived?.departDate).toLocaleString(
                        "en-BD",
                        {
                          timeZone: "Asia/Dhaka",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* seat status trip sheet seat status section */}
              <div className="flex items-center gap-2  mb-3">
                {/* STATUS BUTTON */}
                <Dialog
                  open={status}
                  onOpenChange={(open: boolean) => setStatus(open)}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="group relative px-7 h-7 text-xs"
                      variant="default"
                      size="icon"
                    >
                      <span className="">{translate("অবস্থা", "Status")}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="lg">
                    <DialogTitle className="sr-only">status</DialogTitle>
                    <Status bookingCoach={statusBookingCoach} />
                  </DialogContent>
                </Dialog>

                {/* STRIP SHEET BUTTON */}
                <Dialog
                  open={tripSheet}
                  onOpenChange={(open: boolean) => setTripSheet(open)}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="group relative px-10 h-7 text-xs"
                      variant="outline"
                      size="icon"
                    >
                      <span className="">
                        {translate("ট্রিপ তালিকার ", "Trip Sheet")}
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="xl">
                    <DialogTitle className="sr-only">Strip sheet</DialogTitle>
                    <TripSheet bookingCoach={bookingCoach} />
                  </DialogContent>
                </Dialog>

                {/* SEAT STATUS */}
                <Dialog
                  open={seatStatus}
                  onOpenChange={(open: boolean) => setSeatStatus(open)}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="group relative px-12 h-7 text-xs"
                      variant="destructive"
                      size="icon"
                    >
                      <span className="">
                        {translate("আসন অবস্থা", "Seat Status")}
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="90vw">
                    <DialogTitle className="sr-only">seat status</DialogTitle>
                    <SeatStatus bookingCoach={seatStatusBooking} />
                  </DialogContent>
                </Dialog>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        className="text-muted-foreground px-3 h-7 text-sm"
                        onClick={ResetDataOfForm}
                        variant="outline"
                      >
                        <span className="sr-only">Refresh Button</span>
                        {/* <LuRefreshCw className="size-[21px]" /> */}
                        {translate("রিসেট", "Refresh")}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p> {translate("ফিল্টার রিসেট", "Reset Filter")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {/* COUCH SEAT PLAN CONTAINER */}
              <PageTransition className="w-full flex items-center flex-col border-2 rounded-md justify-center  border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
                <SeatLayoutSelector
                  checkingSeat={checkingSeat}
                  bookingCoach={bookingCoach}
                  coachClass={bookingCoach?.coach?.coachClass}
                  //@ts-ignore
                  seatsAllocation={seatsAllocation}
                  handleBookingSeat={handleBookingSeat}
                  bookingFormState={bookingFormState}
                  removeBookingSeatLoading={removeBookingSeatLoading}
                  bookedSeatList={bookedSeatList}
                  handleCancelTicket={handleCancelTicket}
                />
              </PageTransition>
            </div>
            <div className="col-span-8 py-3 px-2 w-full ">
              <div className="relative w-full  border">
                <h2 className="absolute border border-[#e57bf3] -top-3 left-2 text-sm  px-2 py-1 bg-[#e074ee]">
                  {translate("আসন সংক্রান্ত তথ্য", "Seat Information")}
                </h2>
                <div className="px-3  h-auto pb-3">
                  <div className="mt-6">
                    {handleCancelClicked === true &&
                      cancelTickets?.length > 0 && (
                        <CancelTicket
                          cancelTickets={cancelTickets}
                          setSelectedIds={setSelectedIds}
                          selectedIds={selectedIds}
                          bookingCoach={bookingCoach}
                          stationId={stationId}
                        />
                      )}
                    {handleBookingClicked === true && (
                      <div>
                        {bookingFormState.selectedSeats?.length > 0 ? (
                          <>
                            <CounterVanishListTable
                              listItems={bookingFormState.selectedSeats
                                .slice()
                                .reverse()}
                              handleBookingSeat={handleBookingSeat}
                              handleCouponChange={handleCouponChange}
                              couponInputs={couponInputs}
                            />
                          </>
                        ) : (
                          <div className="flex justify-center text-center pt-2">
                            <Paragraph variant="destructive" size="sm">
                              {translate(
                                "আপনি এখনো কোনো আসন নির্বাচন করেননি। বুকিং সম্পূর্ণ করতে দয়া করে একটি আসন নির্বাচন করুন।",
                                "You haven't selected a seat yet. Please choose a seat to proceed with your booking."
                              )}
                            </Paragraph>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {bookingFormState.selectedSeats?.length > 0 ? (
                <>
                  <div className="my-1 px-4 py-1 bg-gray-50 dark:bg-[#1f2128]  rounded-lg border border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center flex items-center gap-1">
                        <p className="font-bold text-gray-700 dark:text-white">
                          {translate("মোট ভাড়া", "Total Fare")} :
                        </p>
                        <p className="text-lg">
                          {translate(
                            convertToBnDigit(
                              formatter({
                                type: "amount",
                                amount: totalOriginalPrice,
                              })
                            ),
                            formatter({
                              type: "amount",
                              amount: totalOriginalPrice,
                            })
                          )}
                        </p>
                      </div>

                      <div className="text-center flex items-center gap-1">
                        <p className="font-bold text-gray-700 dark:text-white">
                          {translate("মোট ছাড়", "Total Discount")} :
                        </p>

                        {couponLoading ? (
                          <>
                            <div className="flex justify-center py-1">
                              <svg
                                className="animate-spin h-4 w-4 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-lg text-red-600">
                              -
                              {translate(
                                convertToBnDigit(
                                  formatter({
                                    type: "amount",
                                    amount: totalDiscount,
                                  })
                                ),
                                formatter({
                                  type: "amount",
                                  amount: totalDiscount,
                                })
                              )}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="text-center flex items-center gap-1">
                        <p className="font-bold text-gray-700 dark:text-white">
                          {translate("নিট ভাড়া", "Net Fare")} :
                        </p>
                        <p className="text-lg text-green-600 font-bold">
                          {translate(
                            convertToBnDigit(
                              formatter({
                                type: "amount",
                                amount: totalDiscountedPrice,
                              })
                            ),
                            formatter({
                              type: "amount",
                              amount: totalDiscountedPrice,
                            })
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}

              {/* seat issue or seat booking part counter */}
              <div className="flex border flex-col items-center justify-center w-full py-1.5">
                {handleBookingClicked === true && (
                  <>
                    {" "}
                    <RadioGroup
                      className="flex flex-row justify-center items-center gap-4"
                      value={bookingType}
                      onValueChange={setBookingType} // Update bookingType state on change
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="SeatIssue" id="r2" />
                        <Label htmlFor="r2" className="text-sm font-bold">
                          Seat Issue
                        </Label>
                      </div>
                      {permission?.bookingPermission === true ? (
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="SeatBooking" id="r3" />
                          <Label htmlFor="r3" className="text-sm font-bold">
                            Seat Booking
                          </Label>
                        </div>
                      ) : (
                        ""
                      )}
                    </RadioGroup>
                    {bookingType === "SeatBooking" && (
                      <div className="flex items-center justify-center gap-4">
                        <h2 className="text-red-500 text-lg">
                          This coach's booking seat expire Date{" "}
                          {bookingCoach.departureDate} before departure time of{" "}
                          {partialData?.data?.counterBookingTime}
                        </h2>
                      </div>
                    )}
                  </>
                )}
                {handleCancelClicked === true && (
                  <RadioGroup
                    className="flex flex-row justify-center items-center gap-4 py-3"
                    value={cancelType}
                    onValueChange={setCancelType}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CancelSeat" id="r3" />
                      <Label htmlFor="r3" className="text-sm font-bold">
                        Cancel Seat
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              </div>
              {/* CUSTOMER & PAYMENT INFORMATION */}

              <div className="border mt-4 relative pb-5 px-1">
                <h2 className="absolute border border-[#e57bf3] text-sm -top-3 left-2  px-2 py-1 bg-[#e074ee]">
                  {translate(
                    "গ্রাহকের ব্যক্তিগত তথ্য",
                    "Client Personal Information"
                  )}
                </h2>

                {(handleCancelClicked) &&
                cancelTickets?.length > 0 ? (
                  <div className="mt-8">
                    <CancelTicketForm cancelTickets={cancelTickets} />
                  </div>
                ) : handleCancelBookedClicked ? <></>: (
                  <>
                    {" "}
                    <div className="w-full pt-5">
                      <table className="table-auto border-collapse border  w-full">
                        <tbody className="text-[13px]">
                          {/* Row 1: Name and Phone */}
                          <tr className="border ">
                            <td className="border  px-2 py-1 font-medium">
                              {translate("নাম", "Name")}
                            </td>
                            <td className="border  px-2 py-1">
                              <Input
                                {...register("customerName")}
                                value={sharedFormState.customerName || ""}
                                onChange={(e) =>
                                  handleFieldUpdate(
                                    "customerName",
                                    e.target.value
                                  )
                                }
                                type="text"
                                id="name"
                                placeholder={translate(
                                  addBookingSeatForm.name.placeholder.bn,
                                  addBookingSeatForm.name.placeholder.en
                                )}
                                className="w-full h-7 text-xs"
                              />
                              {errors.customerName && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.customerName.message}
                                </p>
                              )}
                            </td>
                            <td className="border  px-2 py-1 font-medium">
                              {translate("ফোন", "Phone")}{" "}
                              <span className="text-red-600 font-semibold">
                                ✼
                              </span>
                            </td>
                            <td className="border  px-2 py-1">
                              <Input
                                {...register("phone")}
                                value={sharedFormState.phone || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setPhoneNumber(value);
                                  handleFieldUpdate("phone", value);
                                }}
                                type="tel"
                                id="phone"
                                placeholder={translate(
                                  addBookingSeatForm.phone.placeholder.bn,
                                  addBookingSeatForm.phone.placeholder.en
                                )}
                                className="w-full h-7 text-xs"
                                maxLength={11}
                              />
                              {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.phone.message}
                                </p>
                              )}
                            </td>
                          </tr>

                          {/* Row 2: Gender and Email */}
                          <tr className="border ">
                            <td className="border  px-2 py-1 font-medium">
                              {translate("লিঙ্গ", "Gender")}
                            </td>
                            <td className="border  px-2 py-1">
                              <Select
                                value={sharedFormState.gender || "Male"}
                                onValueChange={(value) =>
                                  handleFieldUpdate("gender", value)
                                }
                              >
                                <SelectTrigger
                                  id="gender"
                                  className="w-full h-7 text-xs"
                                >
                                  <SelectValue
                                    placeholder={translate(
                                      addBookingSeatForm.gender.placeholder.bn,
                                      addBookingSeatForm.gender.placeholder.en
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Male">
                                    {translate("পুরুষ", "Male")}
                                  </SelectItem>
                                  <SelectItem value="Female">
                                    {translate("মহিলা", "Female")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="border  px-2 py-1 font-medium">
                              {translate("ইমেইল", "Email")}
                            </td>
                            <td className="border  px-2 py-1">
                              <Input
                                {...register("email")}
                                value={sharedFormState.email || ""}
                                onChange={(e) =>
                                  handleFieldUpdate("email", e.target.value)
                                }
                                type="email"
                                id="email"
                                placeholder={translate(
                                  addBookingSeatForm.email.placeholder.bn,
                                  addBookingSeatForm.email.placeholder.en
                                )}
                                className="w-full h-7 text-xs"
                              />
                            </td>
                          </tr>

                          {/* Row 3: Nationality and Passport/NID */}
                          <tr className="border ">
                            <td className="border  px-2 py-1 font-medium">
                              {translate("জাতীয়তা", "Nationality")}
                            </td>
                            <td className="border  px-2 py-1">
                              <Select
                                value={sharedFormState.nationality || ""}
                                onValueChange={(value) =>
                                  handleFieldUpdate("nationality", value)
                                }
                              >
                                <SelectTrigger
                                  id="nationality"
                                  className="w-full h-7 text-xs"
                                >
                                  <SelectValue
                                    placeholder={translate(
                                      addBookingSeatForm.nationality.label.bn,
                                      addBookingSeatForm.nationality.label.en
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {nationalitiesOptions?.map(
                                    (
                                      singleNationality: INationalityOptionsProps
                                    ) => (
                                      <SelectItem
                                        key={singleNationality.en}
                                        value={singleNationality.key}
                                      >
                                        {translate(
                                          singleNationality.bn,
                                          singleNationality.en
                                        )}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="border  px-2 py-1 font-medium">
                              {translate("পাসপোর্ট বা এনআইডি", "Passport/NID")}
                            </td>
                            <td className="border  px-2 py-1">
                              <Input
                                {...register("nid")}
                                value={sharedFormState.nid || ""}
                                onChange={(e) =>
                                  handleFieldUpdate("nid", e.target.value)
                                }
                                type="text"
                                id="pass/nid"
                                placeholder={translate(
                                  addBookingSeatForm.passportOrNID.placeholder
                                    .bn,
                                  addBookingSeatForm.passportOrNID.placeholder
                                    .en
                                )}
                                className="w-full h-7 text-xs"
                              />
                            </td>
                          </tr>

                          {/* Row 4: Address */}
                          <tr className="border ">
                            <td className="border  px-2 py-1 font-medium">
                              {translate("ঠিকানা", "Address")}
                            </td>
                            <td colSpan={3} className="border  px-2 py-1">
                              <Input
                                {...register("address")}
                                value={sharedFormState.address || ""}
                                onChange={(e) =>
                                  handleFieldUpdate("address", e.target.value)
                                }
                                type="text"
                                id="address"
                                placeholder={translate(
                                  addBookingSeatForm.address.placeholder.bn,
                                  addBookingSeatForm.address.placeholder.en
                                )}
                                className="w-full h-7 text-xs"
                              />
                            </td>
                          </tr>

                          {/* Row 5: Boarding and Dropping Point */}
                          <tr className="border ">
                            <td className="border  px-2 py-1 font-medium">
                              {translate("বোর্ডিং পয়েন্ট", "Boarding Point")}{" "}
                              <span className="text-red-600 font-semibold">
                                ✼
                              </span>
                            </td>
                            <td className="border  px-2 py-1">
                              <Select
                                value={sharedFormState.boardingPoint || ""}
                                onValueChange={(value) =>
                                  handleFieldUpdate("boardingPoint", value)
                                }
                              >
                                <SelectTrigger
                                  id="boardingPoint"
                                  className="w-full h-7 text-xs"
                                >
                                  <SelectValue
                                    placeholder={translate(
                                      addBookingSeatForm.boardingPoint
                                        .placeholder.bn,
                                      addBookingSeatForm.boardingPoint
                                        .placeholder.en
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {viaRoute
                                    ?.filter(
                                      (r: any) => r.isBoardingPoint === true
                                    )
                                    ?.map((singlePoint: any) => (
                                      <SelectItem
                                        key={singlePoint?.counter?.name}
                                        value={singlePoint?.counter?.name}
                                      >
                                        {formatter({
                                          type: "words",
                                          words: `${singlePoint?.counter?.name}  (${singlePoint?.boardingTime})`,
                                        })}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              {errors.boardingPoint && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.boardingPoint.message}
                                </p>
                              )}
                            </td>
                            <td className="border  px-2 py-1 font-medium">
                              {translate("ড্রপিং পয়েন্ট", "Drop Point")}{" "}
                              <span className="text-red-600 font-semibold">
                                ✼
                              </span>
                            </td>
                            <td className="border px-2 py-1">
                              <Select
                                value={sharedFormState.droppingPoint || ""}
                                onValueChange={(value) =>
                                  handleFieldUpdate("droppingPoint", value)
                                }
                              >
                                <SelectTrigger
                                  id="droppingPoint"
                                  className="w-full h-7 text-xs"
                                >
                                  <SelectValue
                                    placeholder={translate(
                                      addBookingSeatForm.droppingPoint
                                        .placeholder.bn,
                                      addBookingSeatForm.droppingPoint
                                        .placeholder.en
                                    )}
                                  />
                                </SelectTrigger>

                                <SelectContent>
                                  {isLoadingBookingCoaches ? (
                                    <div className="flex items-center justify-center p-3 text-gray-500 text-xs">
                                      <svg
                                        className="animate-spin h-4 w-4 mr-2 text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        />
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        />
                                      </svg>
                                      Loading dropping points...
                                    </div>
                                  ) : (
                                    viaRoute
                                      ?.filter(
                                        (target: any) =>
                                          target?.isDroppingPoint === true
                                      )
                                      ?.map((singlePoint: any) => (
                                        <SelectItem
                                          key={singlePoint?.counter?.name}
                                          value={singlePoint?.counter?.name}
                                        >
                                          {formatter({
                                            type: "words",
                                            words: `${singlePoint?.counter?.name} (${singlePoint?.droppingTime})`,
                                          })}
                                        </SelectItem>
                                      ))
                                  )}
                                </SelectContent>
                              </Select>

                              {errors.droppingPoint && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.droppingPoint.message}
                                </p>
                              )}
                            </td>
                          </tr>
                          {/* PAYMENT METHOD */}
                          {/* Row 6: Payment Method and Payment Type */}
                          <tr className="border ">
                            <td className="border px-2 py-1 font-medium">
                              {translate("পেমেন্ট পদ্ধতি", "Payment Method")}{" "}
                              <span className="text-red-600 font-semibold">
                                ✼
                              </span>
                            </td>
                            <td className="border  px-2 py-1">
                              <Select
                                value={watch("paymentMethod") || ""}
                                onValueChange={(value) =>
                                  handleFieldUpdate("paymentMethod", value)
                                }
                              >
                                <SelectTrigger
                                  id="paymentMethod"
                                  className="w-full h-7 text-xs"
                                >
                                  <SelectValue
                                    placeholder={translate(
                                      addBookingSeatForm.paymentMethod
                                        .placeholder.bn,
                                      addBookingSeatForm.paymentMethod
                                        .placeholder.en
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {counterPaymentMethodOptions?.map(
                                    (
                                      singleNationality: ICounterPaymentMethodOptions,
                                      index
                                    ) => (
                                      <SelectItem
                                        key={index}
                                        value={singleNationality.key}
                                      >
                                        {translate(
                                          singleNationality.bn,
                                          singleNationality.en
                                        )}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              {errors.paymentMethod && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.paymentMethod.message}
                                </p>
                              )}
                            </td>
                            <td className="border  px-2 py-1 font-medium">
                              {translate("পেমেন্ট টাইপ", "Payment Type")}{" "}
                              <span className="text-red-600 font-semibold">
                                ✼
                              </span>
                            </td>
                            <td className="border  px-2 py-1">
                              <Select
                                value={sharedFormState.paymentType || "FULL"}
                                onValueChange={(value) =>
                                  handleFieldUpdate("paymentType", value)
                                }
                              >
                                <SelectTrigger
                                  id="paymentType"
                                  className="w-full h-7 text-xs"
                                >
                                  <SelectValue
                                    placeholder={translate(
                                      addBookingSeatForm.paymentType.placeholder
                                        .bn,
                                      addBookingSeatForm.paymentType.placeholder
                                        .en
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="FULL">
                                    {translate("পূর্ণ", "FULL")}
                                  </SelectItem>
                                  <SelectItem value="PARTIAL">
                                    {translate("আংশিক", "PARTIAL")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {errors.paymentType && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.paymentType.message}
                                </p>
                              )}
                            </td>
                          </tr>

                          {/* Row 7: Payment Partial Amount (if PARTIAL is selected) */}
                          {paymentType === "PARTIAL" && (
                            <tr className="border ">
                              <td className="border  px-2 py-1 font-medium">
                                {translate(
                                  "আংশিক অর্থের পরিমাণ",
                                  "Partial Payment Amount"
                                )}{" "}
                                <span className="text-red-600 font-semibold">
                                  ✼
                                </span>
                              </td>
                              <td colSpan={3} className="border 0 px-2 py-1">
                                <Input
                                  {...register("paymentAmount")}
                                  type="number"
                                  id="paymentAmount"
                                  placeholder={translate(
                                    addBookingSeatForm.paymentAmount.placeholder
                                      .bn,
                                    addBookingSeatForm.paymentAmount.placeholder
                                      .en
                                  )}
                                  className="w-full"
                                  onChange={(e) =>
                                    setValue(
                                      "paymentAmount",
                                      parseFloat(e.target.value)
                                    )
                                  }
                                />
                                {errors.paymentAmount && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.paymentAmount.message}
                                  </p>
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3">
                      <ul className="flex justify-between mx-3 flex-wrap">
                        {/* Total Seats */}
                        <li className="text-lg tracking-tight">
                          <label>
                            {translate("মোট আসনঃ ", "Total Seats: ")}
                          </label>
                          <b className="font-[500]">
                            {translate(
                              convertToBnDigit(totalSeats?.toString()),
                              totalSeats?.toString()
                            )}
                          </b>
                        </li>

                        {/* Total Amount (After Discount) */}
                        <li className="text-lg tracking-tight">
                          <label>
                            {translate("মোট বিল: ", "Total Amount: ")}
                          </label>
                          <b className="font-[500] font-anek">
                            {translate(
                              convertToBnDigit(
                                formatter({
                                  type: "amount",
                                  amount: totalDiscountedPrice,
                                })
                              ),
                              formatter({
                                type: "amount",
                                amount: totalDiscountedPrice,
                              })
                            )}
                          </b>
                        </li>

                        {/* Paid Amount - Always Visible */}
                        <li className="text-lg tracking-tight">
                          <label>
                            {translate("প্রদত্ত বিল: ", "Paid Amount: ")}
                          </label>
                          <b className="font-[500] font-anek text-green-600">
                            {translate(
                              convertToBnDigit(
                                formatter({
                                  type: "amount",
                                  amount:
                                    paymentType === "FULL"
                                      ? totalDiscountedPrice
                                      : partialAmount || 0,
                                })
                              ),
                              formatter({
                                type: "amount",
                                amount:
                                  paymentType === "FULL"
                                    ? totalDiscountedPrice
                                    : partialAmount || 0,
                              })
                            )}
                          </b>
                        </li>

                        {/* Due Amount - Conditionally Styled */}
                        {paymentType === "PARTIAL" && (
                          <li className="text-lg tracking-tight">
                            <label>
                              {translate("বকেয়া বিল:", "Due Amount: ")}
                            </label>
                            <b
                              className={`font-[500] font-anek ${
                                dueAmount > 0
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              {translate(
                                convertToBnDigit(
                                  formatter({
                                    type: "amount",
                                    amount: Math.max(0, dueAmount),
                                  })
                                ),
                                formatter({
                                  type: "amount",
                                  amount: Math.max(0, dueAmount),
                                })
                              )}
                            </b>
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                )}
                {/* {handleBookingClicked && (
                 
                )} */}

                {handleCancelClicked && cancelTickets?.length > 0 && (
                  <div className="mt-10 space-x-3">
                    <Button
                      variant={"destructive"}
                      type="button"
                      onClick={handleCancelCancelRequest}
                    >
                      {translate("বাতিল করুন", "Cancel")}
                    </Button>
                    <Button
                      variant={"primary"}
                      type="button"
                      onClick={handleCancelRequest}
                      disabled={selectedIds.length === 0}
                    >
                      {cancelRequestLoading && <Loader />}{" "}
                      {translate("নিশ্চিত করুন", "Confirm")}
                    </Button>
                  </div>
                )}
                {handleBookingClicked && (
                  <>
                    <div className="flex justify-end items-center gap-5 mt-5">
                      <RadioGroup
                        value={printType}
                        onValueChange={setPrintType}
                        className="flex gap-2"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="default" id="r1" />
                          <Label htmlFor="r1" className="text-xs w-20">
                            {translate("ডিফল্ট প্রিন্ট", "Default Print")}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="pos" id="r2" />
                          <Label htmlFor="r2" className="text-xs w-[101px]">
                            {translate(
                              "POS (80mm) প্রিন্ট",
                              "POS (80mm) Print"
                            )}
                          </Label>
                        </div>
                      </RadioGroup>
                      <div className="flex items-center gap-2">
                        <div>
                          {handleCancelBookedClicked ? (
                            <>
                              <Button
                                onClick={handleCancelBooking}
                                type="button"
                                variant="default"
                              >
                                {translate("বুক বাতিল", "Cancel Booked")}
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={handleCancelBooking}
                                type="button"
                                variant="default"
                              >
                                {translate("রিসেট", "Reset")}
                              </Button>
                            </>
                          )}
                        </div>
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

                        <div className="mt-">
                          <Button
                            onClick={() => invoiceReprintHandler()}
                            type="button"
                            variant="default"
                            size="sm"
                          >
                            Reprint
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </PageTransition>
      <div className="invisible hidden -left-full">
        {addBookingSuccess &&
          (printType === "default" ? (
            <TickitPrint ref={printSaleRef} tickitData={saleInfo} />
          ) : (
            <POSCounterTicketPrint ref={printSaleRef} tickitData={saleInfo} />
          ))}
        {saleData &&
          bookingType !== "SeatBooking" &&
          (printType === "default" ? (
            <TickitPrint ref={printSaleRef} tickitData={saleData?.saleInfo} />
          ) : (
            <POSCounterTicketPrint
              ref={printSaleRef}
              tickitData={saleData?.saleInfo}
            />
          ))}
      </div>

      <Dialog
        open={openCancelModal}
        onOpenChange={(open: boolean) => setOpenCancelModal(open)}
      >
        <DialogContent size="lg">
          <DialogTitle className="sr-only">Cancel Ticket</DialogTitle>
          <CancelSameTicket
            seats={allSameTicket}
            setSelectedTicket={setSelectedTicket}
            selectedTicket={selectedTicket}
            stationId={stationId}
            setOpenCancelModal={setOpenCancelModal}
            handleCancelTicket={handleCancelTicket}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CounterTickitBookingForm;
