export const getRoundTripAmountByClass = (
  coach: any,
  stationId: any,
  classType?: "B_Class" | "Sleeper"
): number => {
  // Flatten all SegmentFare arrays
  const fare = coach?.coach?.route?.Segment?.flatMap(
    (seg: any) => seg?.SegmentFare || []
  ).find(
    (fare: any) =>
      fare.fromStationId === stationId.toStationId &&
      fare.toStationId === stationId.fromStationId
  );

  if (!fare) return 0;

  // Special case for S_Class (split B_Class / Sleeper)
  if (coach?.coach?.coachClass === "S_Class" && classType) {
    return classType === "B_Class"
      ? fare.b_class_amount || 0
      : fare.sleeper_class_amount || 0;
  }

  // Normal cases
  switch (coach?.coach?.coachClass) {
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

 export const getRoundTripStationNameBySearch=(coach: any, stationId:any)=>{
  
    const segment = coach?.coach?.route?.Segment?.[0]?.SegmentFare?.find(
      (seg: any) =>
        seg.fromStationId === stationId.toStationId &&
        seg.toStationId === stationId.fromStationId && seg.type===coach.coachType
    );
    if (!segment) return 0;

    return segment;
  }

export const getBoardingTime = (item: any, stationId: any, roundTrip: boolean) => {
  if (!item?.coach?.CoachViaRoute) return null;

  const routeStations = item.coach.CoachViaRoute;

  // Try to find based on trip type
  const match = routeStations.find((s: any) => {
    if (roundTrip) {
      return (
        s.counter.stationId === stationId?.toStationId ||
        s.counter.stationId === stationId?.fromStationId
      );
    } else {
      return (
        s.counter.stationId === stationId?.fromStationId ||
        s.counter.stationId === stationId?.toStationId
      );
    }
  });

  return match?.boardingTime ?? null;
};

export const getDroppingTime = (item: any, stationId: any, roundTrip: boolean) => {
  if (!item?.coach?.CoachViaRoute) return null;

  const routeStations = item.coach.CoachViaRoute;

  // Try to find based on trip type
  const match = routeStations.find((s: any) => {
    if (roundTrip) {
      return (
        s.counter.stationId === stationId?.fromStationId 
      );
    } else {
      return (
        s.counter.stationId === stationId?.toStationId
      );
    }
  });

  return match?.droppingTime ?? null;
};

