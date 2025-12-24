import { getAmountInBookingFromByClass } from "./getAmountInBookingFromByClass";

export const calculateSeatAmounts = (
    seatData: any,
    bookingCoach: any,
    stationId: any
  ) => {
    const currentAmount =
      bookingCoach.coachClass === "S_Class"
        ? seatData.seat.startsWith("L")
          ? bookingCoach?.coach?.route?.Segment?.find(
              (seg: any) =>
                seg.fromStationId === stationId?.fromStationId &&
                seg.toStationId === stationId?.toStationId &&
                seg.type === bookingCoach.coachType
            )?.b_class_amount ?? 0
          : seatData.seat.startsWith("U")
          ? bookingCoach?.coach?.route?.Segment?.find(
              (seg: any) =>
                seg.fromStationId === stationId?.fromStationId &&
                seg.toStationId === stationId?.toStationId &&
                seg.type === bookingCoach.coachType
            )?.sleeper_class_amount ?? 0
          : getAmountInBookingFromByClass(
              bookingCoach.coach,
              bookingCoach.coachType,
              bookingCoach.coachClass,
              stationId
            )
        : getAmountInBookingFromByClass(
            bookingCoach.coach,
            bookingCoach.coachType,
            bookingCoach.coachClass,
            stationId
          );

    const previousAmount = bookingCoach?.discount ?? 0;

    return { currentAmount, previousAmount };
  };