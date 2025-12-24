export const getAmountInBookingFromByClass = (
  coach: any,
  // @ts-ignore
  coachType: any,
  coachClass: any,
  stationId: any
): number => {
  if (!coach?.route?.Segment?.length) return 0;
  // Flatten all SegmentFare arrays
  const segmentFares = coach.route.Segment.flatMap(
    (seg: any) => seg?.SegmentFare || []
  );

  // Find the matching fare based on direction and coachType
  const fare = segmentFares?.find(
    (f: any) =>
      f.fromStationId === stationId?.fromStationId &&
      (f.toStationId === stationId?.toStationId ||
        f.toStationId === stationId?.destinationStationId)
  );
 

  if (!fare || !coachClass) return 0;
  // Determine price by coach class
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
