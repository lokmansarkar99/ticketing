import { Button } from "@/components/ui/button";
import CoachReportingTime from "@/components/ui/CoachReportingTime";
import LocationOfCounter from "@/components/ui/LoactionOfCounter";
import CallcenterTickitBookingForm from "@/pages/dashboard/counterRole/tickit/CallcenterTickitBookingForm";
import CounterTickitBookingForm from "@/pages/dashboard/counterRole/tickit/CounterTickitBookingForm";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import { formatDisplayDate } from "@/utils/helpers/dateFomateBD";
import formatter from "@/utils/helpers/formatter";
import {
  getOriginalAmountByClassNew,
  getStationNameBySearch,
} from "@/utils/helpers/getOriginalAmountByClass";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
interface IBookingTickitTableProps {
  coachData: any[];
  bookedSeatList: any[];
  stationId: any;
}
const DashboardTickitBookingTable: FC<IBookingTickitTableProps> = ({
  coachData,
  bookedSeatList,
  stationId,
}: {
  coachData: any;
  bookedSeatList: any[];
  stationId: any;
}) => {
  const { translate } = useCustomTranslator();
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);
  const user = useSelector((state: any) => state.user);
  const [sharedFormState, setSharedFormState] = useState<any>({}); // Renamed state

  const expandedRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (openRowIndex !== null && expandedRowRef.current) {
      expandedRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Scrolls to center vertically
      });
    }
  }, [openRowIndex]);

  const toggleRow = (index: number, coach: any) => {
    setOpenRowIndex((prevIndex) => {
      const newIndex = prevIndex === index ? null : index;

      // Update shared form state with the data for the selected coach
      if (newIndex !== null) {
        setSharedFormState((prevState: any) => ({
          ...prevState,
          ...coach, // Merge with the existing data
        }));
      } else {
        setSharedFormState({}); // Clear state when collapsing
      }

      return newIndex;
    });
  };
 
  const modifiedCoachData = coachData?.map((item: any) => ({
    ...item,
    coach: {
      ...item.coach,
      stationId: {
        fromStationId: item.coach.fromStationId,
        toStationId: item.coach.destinationStationId,
      },
    },
  }));

  return (
    <table className="min-w-full border-collapse text-center border border-gray-300">
      <thead>
        <tr className="bg-primary text-white text-sm font-semibold">
          <th className="border-2 border-[#3491b1] p-1">
            {translate("সিরিয়াল নং", "SL No")}
          </th>

          <th className="border-2 border-[#3491b1] p-1">
            {translate("যাত্রা শুরু সময়", "Dep. Date & Time")}
          </th>

          <th className="border-2 border-[#3491b1] p-1 w-[20%]">
            {translate("কোচ নং", "Coach No")}
          </th>
          <th className="border-2 border-[#3491b1] p-1">
            {translate("শুরুর কাউন্টার", "Starting Counter")}
          </th>
          <th className="border-2 border-[#3491b1] p-1">
            {translate("শেষের কাউন্টার", "End Counter")}
          </th>
          <th className="border-2 border-[#3491b1] p-1">
            {translate("নিবন্ধন নম্বর", "Reg. Number")}
          </th>
          <th className="border-2 border-[#3491b1] p-1">
            {translate("ভাড়া", "Fare")}
          </th>
          <th className="border-2 border-[#3491b1] p-1">
            {translate("ভাড়া", "Coach Type")}
          </th>
          <th className="border-2 border-[#3491b1] p-1">
            {translate("বিক্রিত", "Sold")}
          </th>
          <th className="border-2 border-[#3491b1] p-1">
            {translate("বুকড", "Booked")}
          </th>
          <th className="border-2 border-[#3491b1] p-1">
            {translate("উপলব্ধ", "Available")}
          </th>

          {/* <th className="border-2 border-[#3491b1] p-1">
            {translate("কোচের ধরণ", "Coach Type")}
          </th> */}

          <th className="border-2 border-[#3491b1] p-1">
            {translate("অ্যাকশন", "Actions")}
          </th>
        </tr>
      </thead>
      <tbody>
        {modifiedCoachData.length !== 0 ? (
          [...modifiedCoachData]
            .sort((a: any, b: any) => {
              const scheduleA = a?.coach?.CoachViaRoute?.find(
                (s: any) => s.counter?.stationId === stationId?.fromStationId
              )?.boardingTime;

              const scheduleB = b?.coach?.CoachViaRoute?.find(
                (s: any) => s.counter?.stationId === stationId?.fromStationId
              )?.boardingTime;

              // Convert to Date or comparable value
              const timeA = scheduleA
                ? new Date(`${scheduleA}:00`)
                : new Date(0);
              const timeB = scheduleB
                ? new Date(`${scheduleB}:00`)
                : new Date(0);

              return timeA.getTime() - timeB.getTime();
            })
            .map((coach: any, index: any) => (
              <>
                <tr
                  onClick={() => toggleRow(index, coach)}
                  key={index}
                  className={`text-sm ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-100 dark:bg-gray-800"
                  } hover:bg-[#e074ee] cursor-pointer`}
                >
                  <td className="border border-gray-300 px-2 py-1">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                   <div className=" flex items-center gap-2">
                     {translate(
                      coach?.coach?.CoachViaRoute?.find(
                        (s: any) =>
                          s.counter.stationId === stationId?.fromStationId
                      )?.boardingTime,
                      coach?.coach?.CoachViaRoute?.find(
                        (s: any) =>
                          s.counter.stationId === stationId?.fromStationId
                      )?.boardingTime
                    )}{" "}
                    {formatDisplayDate(coach?.departureDate)}
                     <CoachReportingTime
                      viaRoute={coach?.coach?.CoachViaRoute}
                    />
                   </div>
                  </td>
                  <td className="border border-gray-300  py-1 px-2">
                    <div className="flex gap-1 items-center">
                        {coach?.coachNo || translate("N/A", "N/A")}

                    <LocationOfCounter
                      viaRoute={coach?.coach?.route?.viaRoute}
                    />
                    </div>
                  </td>{" "}
                  <td className="border border-gray-300 px-2 py-1">
                    {
                      getStationNameBySearch(coach, stationId)?.fromStation
                        ?.name
                    }
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {getStationNameBySearch(coach, stationId)?.toStation?.name}
                  </td>
                  <td className="border border-gray-300 py-1 px-2">
                    {coach?.registrationNo || translate("N/A", "N/A")}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <div className="flex flex-col">
                      {coach?.coach?.coachClass === "S_Class" ? (
                        <>
                          <div className="flex items-center gap-1 text-center justify-center">
                            <span className="font-anek font-medium text-sm text-gray-600">
                              B_Class:
                            </span>
                            {coach.discount > 0 && (
                              <span className="font-anek font-light text-xs line-through text-gray-500">
                                {translate(
                                  convertToBnDigit(
                                    formatter({
                                      type: "amount",
                                      amount:
                                        coach?.coach?.route?.Segment?.flatMap(
                                          (seg: any) => seg?.SegmentFare || []
                                        ).find(
                                          (fare: any) =>
                                            fare.fromStationId ===
                                              stationId.fromStationId &&
                                            fare.toStationId ===
                                              stationId.toStationId
                                        )?.b_class_amount || 0,
                                    })
                                  ),
                                  formatter({
                                    type: "amount",
                                    amount:
                                      coach?.coach?.route?.Segment?.flatMap(
                                        (seg: any) => seg?.SegmentFare || []
                                      ).find(
                                        (fare: any) =>
                                          fare.fromStationId ===
                                            stationId.fromStationId &&
                                          fare.toStationId ===
                                            stationId.toStationId
                                      )?.b_class_amount || 0,
                                  })
                                )}
                              </span>
                            )}
                            <span className="font-anek font-medium text-sm">
                              {translate(
                                convertToBnDigit(
                                  formatter({
                                    type: "amount",
                                    amount:
                                      (coach?.coach?.route?.Segment?.flatMap(
                                        (seg: any) => seg?.SegmentFare || []
                                      ).find(
                                        (fare: any) =>
                                          fare.fromStationId ===
                                            stationId.fromStationId &&
                                          fare.toStationId ===
                                            stationId.toStationId
                                      )?.b_class_amount || 0) - coach.discount,
                                  })
                                ),
                                formatter({
                                  type: "amount",
                                  amount:
                                    (coach?.coach?.route?.Segment?.flatMap(
                                      (seg: any) => seg?.SegmentFare || []
                                    ).find(
                                      (fare: any) =>
                                        fare.fromStationId ===
                                          stationId.fromStationId &&
                                        fare.toStationId ===
                                          stationId.toStationId
                                    )?.b_class_amount || 0) - coach.discount,
                                })
                              )}
                            </span>
                          </div>

                          <div className="flex items-center justify-center gap-1">
                            <span className="font-anek font-medium text-sm text-gray-600">
                              Sleeper:
                            </span>
                            {coach.discount > 0 && (
                              <span className="font-anek font-light text-xs line-through text-gray-500">
                                {translate(
                                  convertToBnDigit(
                                    formatter({
                                      type: "amount",
                                      amount:
                                        coach?.coach?.route?.Segment?.flatMap(
                                          (seg: any) => seg?.SegmentFare || []
                                        ).find(
                                          (fare: any) =>
                                            fare.fromStationId ===
                                              stationId.fromStationId &&
                                            fare.toStationId ===
                                              stationId.toStationId
                                        )?.sleeper_class_amount || 0,
                                    })
                                  ),
                                  formatter({
                                    type: "amount",
                                    amount:
                                      coach?.coach?.route?.Segment?.flatMap(
                                        (seg: any) => seg?.SegmentFare || []
                                      ).find(
                                        (fare: any) =>
                                          fare.fromStationId ===
                                            stationId.fromStationId &&
                                          fare.toStationId ===
                                            stationId.toStationId
                                      )?.sleeper_class_amount || 0,
                                  })
                                )}
                              </span>
                            )}
                            <span className="font-anek font-medium text-sm">
                              {translate(
                                convertToBnDigit(
                                  formatter({
                                    type: "amount",
                                    amount:
                                      (coach?.coach?.route?.Segment?.flatMap(
                                        (seg: any) => seg?.SegmentFare || []
                                      ).find(
                                        (fare: any) =>
                                          fare.fromStationId ===
                                            stationId.fromStationId &&
                                          fare.toStationId ===
                                            stationId.toStationId
                                      )?.sleeper_class_amount || 0) -
                                      coach.discount,
                                  })
                                ),
                                formatter({
                                  type: "amount",
                                  amount:
                                    (coach?.coach?.route?.Segment?.flatMap(
                                      (seg: any) => seg?.SegmentFare || []
                                    ).find(
                                      (fare: any) =>
                                        fare.fromStationId ===
                                          stationId.fromStationId &&
                                        fare.toStationId ===
                                          stationId.toStationId
                                    )?.sleeper_class_amount || 0) -
                                    coach.discount,
                                })
                              )}
                            </span>
                          </div>
                        </>
                      ) : (
                        // Original display for other coach classes
                        <>
                          {coach.discount > 0 && (
                            <span className="font-anek font-light text-sm line-through mb-1">
                              {translate(
                                convertToBnDigit(
                                  formatter({
                                    type: "amount",
                                    amount: getOriginalAmountByClassNew(
                                      coach,
                                      stationId
                                    ),
                                  })
                                ),
                                formatter({
                                  type: "amount",
                                  amount: getOriginalAmountByClassNew(
                                    coach,
                                    stationId
                                  ),
                                })
                              )}
                            </span>
                          )}
                          <span className="font-anek font-medium text-sm">
                            {translate(
                              convertToBnDigit(
                                formatter({
                                  type: "amount",
                                  amount:
                                    getOriginalAmountByClassNew(
                                      coach,
                                      stationId
                                    ) - coach.discount,
                                })
                              ),
                              formatter({
                                type: "amount",
                                amount:
                                  getOriginalAmountByClassNew(
                                    coach,
                                    stationId
                                  ) - coach.discount,
                              })
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-300 py-1 px-2">
                    {coach?.coach?.coachType || "N/A"}
                  </td>
                  <td className="border border-gray-300 py-1 px-2">
                    {coach?.orderSeat?.length
                      ? translate(
                          `${convertToBnDigit(
                            coach?.orderSeat?.filter(
                              (s: any) => s.status === "Success"
                            ).length
                          )}`,
                          coach?.orderSeat?.filter(
                            (s: any) => s.status === "Success"
                          ).length
                        )
                      : "0"}
                  </td>
                  <td className="border border-gray-300 py-1 px-2">
                    {coach?.CounterBookedSeat?.length
                      ? translate(
                          `$
                    {convertToBnDigit(coach?.CounterBookedSeat?.length)}`,
                          coach.CounterBookedSeat?.length
                        )
                      : "0"}
                  </td>
                  <td className="border border-gray-300 py-1 px-2">
                    {coach?.coach?.seatPlan?.noOfSeat -
                      coach?.orderSeat?.filter(
                        (s: any) => s.status === "Success"
                      ).length}
                  </td>
                  {/* <td className="border border-gray-300 p-2">
                {translate(
                  coach.coachType === "AC"
                    ? "শীতাতপ নিয়ন্ত্রিত"
                    : "শীতাতপ নিয়ন্ত্রিত বিহীন",
                  coach.coachType === "AC" ? "Air Conditioned" : "Non-AC"
                )}
              </td> */}
                  <td className="border border-gray-300 px-2 py-1">
                    <Button
                      className="h-7"
                      variant="viewSeat"
                      size="sm"
                      onClick={(event: any) => {
                        event.stopPropagation();
                        toggleRow(index, coach);
                      }}
                    >
                      {openRowIndex === index
                        ? translate("লুকান", "Hide")
                        : translate("আসন দেখুন", "View Seats")}
                    </Button>
                  </td>
                </tr>
                {openRowIndex === index && (
                  <tr ref={expandedRowRef} className="expanded-row">
                    <td colSpan={12} className="p-4">
                      {user?.role?.toLowerCase() === "counter" ? (
                        <>
                          <CounterTickitBookingForm
                            sharedFormState={sharedFormState}
                            setSharedFormState={setSharedFormState}
                            bookingCoach={coach}
                            bookedSeatList={bookedSeatList}
                            stationId={stationId}
                          />
                        </>
                      ) : (
                        <>
                          <CallcenterTickitBookingForm
                            sharedFormState={sharedFormState}
                            setSharedFormState={setSharedFormState}
                            bookingCoach={coach}
                            bookedSeatList={bookedSeatList}
                            stationId={stationId}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))
        ) : (
          <tr>
            <td colSpan={12} className="p-4 text-center text-red-500">
              {translate("কোনো তথ্য নেই", "No Data available")}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DashboardTickitBookingTable;
