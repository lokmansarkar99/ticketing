// Updated price calculation function for new structure
export const getAmountInRoundTripBooking = (
  coach: any,
  // @ts-ignore
  coachType: any,
  coachClass: any,
  stationId: any,
  seatNumber?: string, // Optional seat number for S_Class
  roundtrip?: boolean // Flag for round trip
): number => {
  // Defensive checks
  if (!coach?.route?.Segment?.length) return 0;

  // Determine which stations to use based on trip type
  const fromStationId = roundtrip ? stationId.toStationId : stationId.fromStationId;
  const toStationId = roundtrip ? stationId.fromStationId : stationId.toStationId;

  // Flatten SegmentFare array
  const segmentFares = coach?.route?.Segment?.[0]?.SegmentFare || [];

  // Find the matching fare record
  const fare = segmentFares.find(
    (f: any) =>
      f.fromStationId === fromStationId &&
      f.toStationId === toStationId
  );

  if (!fare || !coachClass) return 0;

  // Special handling for S_Class based on seat number
  if (coachClass === "S_Class" && seatNumber) {
    if (seatNumber.startsWith("L")) {
      return fare.b_class_amount || 0;
    }
    if (seatNumber.startsWith("U")) {
      return fare.sleeper_class_amount || 0;
    }
  }

  // Default behavior for other coach classes
  switch (coachClass) {
    case "B_Class":
      return fare.b_class_amount || 0;
    case "E_Class":
      return fare.e_class_amount || 0;
    case "S_Class":
      return fare.s_class_amount || 0;
    case "Sleeper":
      return fare.sleeper_class_amount || 0;
    default:
      return fare.amount || 0;
  }
};
