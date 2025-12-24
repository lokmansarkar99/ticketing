import { Button } from "@/components/ui/button";
import BookingForm from "@/sections/home/BookingForm";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import { formatDisplayDate } from "@/utils/helpers/dateFomateBD";
import formatter from "@/utils/helpers/formatter";
import {
  getOriginalAmountByClassNew,
  getStationNameBySearch,
} from "@/utils/helpers/getOriginalAmountByClass";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect, useRef, useState } from "react";

interface IBookingTickitTableProps {
  coachData: any[];
  bookedSeatList: any[];
  stationId: any;
}

const HomeTickitBookingTable: FC<IBookingTickitTableProps> = ({
  coachData,
  bookedSeatList,
  stationId,
}) => {
  const { translate } = useCustomTranslator();
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const [sharedFormState, setSharedFormState] = useState<any>({});
  const expandedRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (expandedRowIndex !== null && expandedRowRef.current) {
      expandedRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Scrolls to center vertically
      });
    }
  }, [expandedRowIndex]);

  const toggleRow = (index: number, coach: any) => {
    setExpandedRowIndex((prevIndex) => {
      const newIndex = prevIndex === index ? null : index;

      if (newIndex !== null) {
        setSharedFormState((prevState: any) => ({
          ...prevState,
          ...coach,
        }));
      } else {
        setSharedFormState({});
      }

      return newIndex;
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-center border-collapse border border-gray-300">
        <thead>
          <tr className="bg-primary ">
            <th className="border-2 border-[#3491b1] text-sm p-[2px]">
              {translate("যাত্রা শুরু সময়", "SL No")}
            </th>
            <th className="border-2 border-[#3491b1] text-sm p-[2px]">
              {translate("যাত্রা শুরু সময়", "Dep. Date & Time")}
            </th>
            <th className="border-2 border-[#3491b1] text-sm  p-[2px]">
              {translate("কোচ নং", "Coach No")}
            </th>
            <th className="border border-[#3491b1] text-sm p-[2px]">
              {translate("শুরুর কাউন্টার", "Starting Counter")}
            </th>
            <th className="border border-[#3491b1] text-sm p-[2px]">
              {translate("শেষের কাউন্টার", "End Counter")}
            </th>
            <th className="border border-[#3491b1] text-sm p-[2px]">
              {translate("ভাড়া", "Fare")}
            </th>
            <th className="border border-[#3491b1] text-sm p-[2px]">
              {translate("কোচের ধরন", "Coach Type")}
            </th>
            <th className="border border-[#3491b1] text-sm p-[2px]">
              {translate("পোছানোর সময়", "Arival Time")}
            </th>
            <th className="border border-[#3491b1] text-sm p-[2px]">
              {translate("উপলব্ধ", "Seat Available")}
            </th>
            {/* <th className="border border-[#3491b1] text-sm p-[2px]">
              {translate("বুকড", "Booked")}
            </th> */}
            {/* <th className="border border-[#3491b1] text-sm p-[2px]">
              {translate("বিক্রিত", "Sold")}
            </th> */}

            <th className="border border-[#3491b1] text-sm p-[2px]">
              {translate("অ্যাকশন", "Actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {coachData?.length > 0 &&
            [...coachData]
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
              .map((coach, index) => (
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
                    <td className="border border-gray-300 px-2 text-sm">
                      {translate(String(index + 1), String(index + 1))}{" "}
                    </td>

                    <td className="border border-gray-300 px-2 text-sm">
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
                    </td>

                    <td className="border border-gray-300 px-2 text-sm text-center">
                      {coach.coachNo || translate("N/A", "N/A")}
                    </td>
                    <td className="border border-gray-300 px-2 text-sm">
                      {
                        getStationNameBySearch(coach, stationId)?.fromStation
                          ?.name
                      }
                    </td>
                    <td className="border border-gray-300 px-2 text-sm">
                      {
                        getStationNameBySearch(coach, stationId)?.toStation
                          ?.name
                      }
                    </td>

                    {/* <td className="border border-gray-300 p-2">
                  {translate(
                    convertToBnDigit(
                      coach?.CounterBookedSeat?.length?.toString() || "0"
                    ),
                    coach?.CounterBookedSeat?.length?.toString() || "0"
                  )}
                </td> */}
                    <td className="border border-gray-300 p-1">
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
                                        )?.b_class_amount || 0) -
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
                    <td className="border border-gray-300 px-2 text-sm">
                      {coach?.coach?.coachClass === "B_Class"
                        ? "Business Class"
                        : coach?.coach?.coachClass === "S_Class"
                        ? "Suite Class"
                        : coach?.coach?.coachClass === "Sleeper"
                        ? "Sleeper Coach"
                        : "Economy Class"}
                    </td>
                    {/* <td className="border border-gray-300 px-2 py-1">
                      {coach?.orderSeat?.length
                        ? translate(
                            `${convertToBnDigit(coach?.orderSeat?.length)}`,
                            coach.orderSeat?.length
                          )
                        : "0"}
                    </td> */}
                    <td className="border border-gray-300 px-2 text-sm">
                      {translate(
                        ``,
                        coach?.coach?.CoachViaRoute?.find(
                          (s: any) =>
                            s.counter.stationId === stationId?.toStationId
                        )?.droppingTime
                      )}{" "}
                    </td>
                    <td className="border border-gray-300 px-2 text-sm">
                      {coach?.coach?.seatPlan?.noOfSeat -
                        coach?.orderSeat?.filter(
                          (s: any) => s.status === "Success"
                        ).length}
                    </td>

                    <td className="border border-gray-300 px-2 text-xs">
                      <Button
                        variant="viewSeat"
                        size="xs"
                        onClick={(event: any) => {
                          event.stopPropagation();
                          toggleRow(index, coach);
                        }}
                      >
                        {expandedRowIndex === index
                          ? translate("লুকান", "Hide")
                          : translate("আসন দেখুন", "View Seats")}
                      </Button>
                    </td>
                  </tr>
                  {expandedRowIndex === index && (
                    <tr
                      key={`details-${index}`}
                      ref={expandedRowRef}
                      className="expanded-row"
                    >
                      <td colSpan={10} className="p-4 border border-gray-300">
                        <BookingForm
                          stationId={stationId}
                          bookingCoach={coach}
                          bookedSeatList={bookedSeatList}
                          sharedFormState={sharedFormState}
                          setSharedFormState={setSharedFormState}
                        />{" "}
                      </td>
                    </tr>
                  )}
                </>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomeTickitBookingTable;
