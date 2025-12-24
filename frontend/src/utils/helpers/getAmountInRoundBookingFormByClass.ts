export const getAmountInRoundBookingFromByClass = (coach: any, coachType:any, coachClass:any, stationId:any): number => {
  
    const segment = coach?.route?.Segment?.find(
      (seg: any) =>
        seg.fromStationId === stationId?.toStationId &&
        seg.toStationId === stationId.fromStationId && seg.type=== coachType
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
  