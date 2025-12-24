export const getOriginalAmountByClass = (coach: any, stationId:any): number => {

    const coachClass = coach?.coach?.coachClass; 
  
    const segment = coach?.coach?.route?.Segment?.find(
      (seg: any) =>
        seg.fromStationId === stationId.fromStationId &&
        seg.toStationId === stationId.toStationId && seg.type===coach.coachType
    );
    if (!segment || !coachClass) return 0;
  
    switch (coachClass) {
      case "B_Class":
        return segment.b_class_amount;
      case "E_Class":
        return segment.e_class_amount;
      case "S_Class":
        return segment.s_class_amount;
      case "Sleeper":
        return segment.sleeper_class_amount;
      default:
        return coach?.fare?.amount ?? 0;
    }
  };

  
 export const getStationNameBySearch = (coach: any, stationId: any) => {
  const segmentFare = coach?.coach?.route?.Segment?.flatMap(
    (seg: any) => seg?.SegmentFare || []
  ).find(
    (fare: any) =>
      fare.fromStationId === stationId.fromStationId &&
      fare.toStationId === stationId.toStationId
  );

  if (!segmentFare) return null;

  return {
    fromStation: segmentFare.fromStation,
    toStation: segmentFare.toStation,
  };
};


  export const getOriginalAmountByClassNew = (coach: any, stationId: any) => {
  const fare = coach?.coach?.route?.Segment?.flatMap(
    (seg: any) => seg?.SegmentFare || []
  ).find(
    (fare: any) =>
      fare.fromStationId === stationId.fromStationId &&
      fare.toStationId === stationId.toStationId
  );

  if (!fare) return 0;

  switch (coach?.coach?.coachClass) {
    case "E_Class":
      return fare.e_class_amount || 0;
    case "B_Class":
      return fare.b_class_amount || 0;
    case "Sleeper":
      return fare.sleeper_class_amount || 0;
    default:
      return fare.amount || 0;
  }
};
