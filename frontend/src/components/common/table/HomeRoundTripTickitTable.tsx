import { Button } from "@/components/ui/button";
import {
  useCheckingSeatMutation,
} from "@/store/api/bookingApi";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect, useRef, useState } from "react";
import SeatLayoutSelector from "../busSeatLayout/SeatLayoutSelector";
import {
  getOriginalAmountByClassNew,
  getStationNameBySearch,
} from "@/utils/helpers/getOriginalAmountByClass";
import {
  getBoardingTime,
  getDroppingTime,
  getRoundTripAmountByClass,
  getRoundTripStationNameBySearch,
} from "@/utils/helpers/getRountTripAmountByClass";
import { getAmountInRoundTripBooking } from "@/utils/helpers/getAmountInRoundTripBooking";
import { formatDisplayDate } from "@/utils/helpers/dateFomateBD";

interface IHomeRoundTripTickitTableProps {
  data: any; // Array of data for the table
  bookingFormState: any; // Current booking form state
  setBookingFormState: any; // Setter for booking form state
  setGoViaRoute: any;
  setReturnViaRoute: any;
  setBookingCoachSingle: any;
  bookedSeatList: any[];
  stationId: any;
  roundTrip: boolean;
  setGoReturnCoachId: any;
}

const HomeRoundTripTickitTable: FC<IHomeRoundTripTickitTableProps> = ({
  data,
  bookingFormState,
  setBookingFormState,
  setGoViaRoute,
  setReturnViaRoute,
  setBookingCoachSingle,
  bookedSeatList,
  stationId,
  roundTrip,
  setGoReturnCoachId,
}) => {
  const { translate } = useCustomTranslator();
  const [checkingSeat] = useCheckingSeatMutation();
  const [selectedBookingCoach, setSelectedBookingCoach] = useState<any>({});
  const [openRowIndex, setOpenRowIndex] = useState<any>({});


  const expandedRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (openRowIndex !== null && expandedRowRef.current) {
      expandedRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [openRowIndex]);

  const handleToggleRow = (index: number, coachInfo: any) => {
    setOpenRowIndex((prevIndex: any) => (prevIndex === index ? null : index));
    setSelectedBookingCoach(coachInfo);
  };

  const handleBookingSeat = (seatData: any, id: any) => {
  setBookingFormState((prevState: any) => {
    const isSeatAlreadySelected = prevState.selectedSeats.some(
      (current: any) =>
        current.seat === seatData.seat && current.coachConfigId === id
    );

    if (isSeatAlreadySelected) {
      // Remove the seat if already selected
      return {
        ...prevState,
        selectedSeats: prevState.selectedSeats.filter(
          (seat: any) =>
            !(seat.seat === seatData.seat && seat.coachConfigId === id)
        ),
      };
    } else {
      // Add the seat if not already selected
      const currentAmount = getAmountInRoundTripBooking(
        selectedBookingCoach?.coach,
        selectedBookingCoach?.coach?.coachType,
        selectedBookingCoach?.coach?.coachClass,
        stationId,
        seatData.seat,
        roundTrip
      );

      const schedule = (() => {
        const matchedRoute =
          selectedBookingCoach?.coach?.CoachViaRoute?.find(
            (s: any) => s?.counter?.stationId === stationId?.fromStationId
          );

        if (!matchedRoute) return null;
        if (matchedRoute.isBoardingPoint) return matchedRoute.boardingTime;
        if (matchedRoute.isDroppingPoint) return matchedRoute.droppingTime;
        return null;
      })();

      const newSeat = {
        seat: seatData.seat,
        coachConfigId: selectedBookingCoach?.id,
        date: selectedBookingCoach?.departureDate,
        currentAmount,
        schedule,
        previousAmount: selectedBookingCoach?.discount,
      };

      // Update go/return coach IDs separately
      setGoReturnCoachId((prev: any) => ({
        ...prev,
        goCoachConfigId:
          !roundTrip && selectedBookingCoach?.id
            ? selectedBookingCoach.id
            : prev.goCoachConfigId,
        returnCoachConfigId:
          roundTrip && selectedBookingCoach?.id
            ? selectedBookingCoach.id
            : prev.returnCoachConfigId,
      }));

      // Keep track of the last selected booking coach
      setBookingCoachSingle(selectedBookingCoach);

      return {
        ...prevState,
        selectedSeats: [...prevState.selectedSeats, newSeat],
      };
    }
  });
};


  useEffect(() => {
    if (selectedBookingCoach?.coach?.CoachViaRoute) {
      if (roundTrip === false) {
        setGoViaRoute(selectedBookingCoach.coach.CoachViaRoute);
      } else {
        const returnRoute = [
          ...selectedBookingCoach.coach.CoachViaRoute,
        ].reverse();
        setReturnViaRoute(returnRoute);
      }
    }
  }, [
    roundTrip,
    selectedBookingCoach?.coach?.CoachViaRoute,
    setGoViaRoute,
    setReturnViaRoute,
  ]);

  return (
    <table className="min-w-full text-center border-collapse border border-gray-300">
      <thead>
        <tr className="bg-primary ">
          <th className="border-2 border-[#3491b1] text-sm p-[2px]">
            {translate("যাত্রা শুরু সময়", "SL No")}
          </th>
          <th className="border border-[#3491b1] text-sm p-[2px]">
            {translate("যাত্রা শুরু সময়", "Departure Time")}
          </th>
          <th className="border border-[#3491b1] text-sm p-[2px]">
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
        {data?.length > 0 &&
          [...data]
            ?.sort((a: any, b: any) => {
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
            ?.map((item: any, index: number) => (
              <>
                <tr
                  key={index}
                  onClick={() => handleToggleRow(index, item)}
                  className={`text-sm ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-100 dark:bg-gray-800"
                  } hover:bg-[#e074ee] cursor-pointer`}
                >
                  <td className="border border-gray-300 px-2 text-sm">
                    {translate(String(index + 1), String(index + 1))}{" "}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {/* {translate(
                      getBoardingTime(item, stationId, roundTrip) ||
                        "সময় পাওয়া যায়নি",
                      getBoardingTime(item, stationId, roundTrip) ||
                        "Time not found"
                    )} */}
                    {translate(
                      getBoardingTime(item, stationId, roundTrip) ||
                        "সময় পাওয়া যায়নি",
                      getBoardingTime(item, stationId, roundTrip) ||
                        "Time not found"
                    )} {" "}
                    {formatDisplayDate(item?.departureDate)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {item.coachNo || translate("N/A", "N/A")}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {
                      (roundTrip
                        ? getRoundTripStationNameBySearch(item, stationId)
                        : getStationNameBySearch(item, stationId)
                      )?.fromStation?.name
                    }
                  </td>

                  <td className="border border-gray-300 px-2 py-1">
                    {
                      (roundTrip
                        ? getRoundTripStationNameBySearch(item, stationId)
                        : getStationNameBySearch(item, stationId)
                      )?.toStation?.name
                    }
                  </td>

                  {/* <td className="border border-gray-300 p-2">
                {item?.CounterBookedSeat?.length
                  ? translate(
                      `${convertToBnDigit(item?.CounterBookedSeat?.length)}`,
                      item.CounterBookedSeat?.length
                    )
                  : "0"}
              </td> */}
                  {/* <td className="border border-gray-300 px-2 py-1">
                {item?.orderSeat?.length
                  ? translate(
                      `${convertToBnDigit(item?.orderSeat?.length)}`,
                      item.orderSeat?.length
                    )
                  : "0"}
              </td> */}
                  <td className="border border-gray-300 px-2 py-1">
                    <div className="flex flex-col">
                      {item?.coach?.coachClass === "S_Class" ? (
                        // Special display for S_Class showing both B_Class and Sleeper fares
                        <>
                          {/* B_Class Fare */}
                          <div className="flex items-center gap-1 text-center justify-center">
                            <span className="font-anek font-medium text-sm text-gray-600">
                              B_Class:
                            </span>
                            {item.discount > 0 && (
                              <span className="font-anek font-light text-xs line-through text-gray-500">
                                {translate(
                                  convertToBnDigit(
                                    formatter({
                                      type: "amount",
                                      amount: roundTrip
                                        ? getRoundTripAmountByClass(
                                            item,
                                            stationId,
                                            "B_Class"
                                          )
                                        : getOriginalAmountByClassNew(
                                            item,
                                            stationId
                                          ),
                                    })
                                  ),
                                  formatter({
                                    type: "amount",
                                    amount: roundTrip
                                      ? getRoundTripAmountByClass(
                                          item,
                                          stationId,
                                          "B_Class"
                                        )
                                      : getOriginalAmountByClassNew(
                                          item,
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
                                      (roundTrip
                                        ? getRoundTripAmountByClass(
                                            item,
                                            stationId,
                                            "B_Class"
                                          )
                                        : getOriginalAmountByClassNew(
                                            item,
                                            stationId
                                          )) - item.discount,
                                  })
                                ),
                                formatter({
                                  type: "amount",
                                  amount:
                                    (roundTrip
                                      ? getRoundTripAmountByClass(
                                          item,
                                          stationId,
                                          "B_Class"
                                        )
                                      : getOriginalAmountByClassNew(
                                          item,
                                          stationId
                                        )) - item.discount,
                                })
                              )}
                            </span>
                          </div>

                          {/* Sleeper Fare */}
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-anek font-medium text-sm text-gray-600">
                              Sleeper:
                            </span>
                            {item.discount > 0 && (
                              <span className="font-anek font-light text-xs line-through text-gray-500">
                                {translate(
                                  convertToBnDigit(
                                    formatter({
                                      type: "amount",
                                      amount: roundTrip
                                        ? getRoundTripAmountByClass(
                                            item,
                                            stationId,
                                            "Sleeper"
                                          )
                                        : getOriginalAmountByClassNew(
                                            item,
                                            stationId
                                          ),
                                    })
                                  ),
                                  formatter({
                                    type: "amount",
                                    amount: roundTrip
                                      ? getRoundTripAmountByClass(
                                          item,
                                          stationId,
                                          "Sleeper"
                                        )
                                      : getOriginalAmountByClassNew(
                                          item,
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
                                      (roundTrip
                                        ? getRoundTripAmountByClass(
                                            item,
                                            stationId,
                                            "Sleeper"
                                          )
                                        : getOriginalAmountByClassNew(
                                            item,
                                            stationId
                                          )) - item.discount,
                                  })
                                ),
                                formatter({
                                  type: "amount",
                                  amount:
                                    (roundTrip
                                      ? getRoundTripAmountByClass(
                                          item,
                                          stationId,
                                          "Sleeper"
                                        )
                                      : getOriginalAmountByClassNew(
                                          item,
                                          stationId
                                        )) - item.discount,
                                })
                              )}
                            </span>
                          </div>
                        </>
                      ) : (
                        // Normal fare display for other coach classes
                        <>
                          {item.discount > 0 && (
                            <span className="font-anek font-light text-sm line-through mb-1">
                              {translate(
                                convertToBnDigit(
                                  formatter({
                                    type: "amount",
                                    amount: roundTrip
                                      ? getRoundTripAmountByClass(
                                          item,
                                          stationId
                                        )
                                      : getOriginalAmountByClassNew(
                                          item,
                                          stationId
                                        ),
                                  })
                                ),
                                formatter({
                                  type: "amount",
                                  amount: roundTrip
                                    ? getRoundTripAmountByClass(item, stationId)
                                    : getOriginalAmountByClassNew(
                                        item,
                                        stationId
                                      ),
                                })
                              )}
                            </span>
                          )}
                          <span className="font-anek font-medium text-xl">
                            {translate(
                              convertToBnDigit(
                                formatter({
                                  type: "amount",
                                  amount:
                                    (roundTrip
                                      ? getRoundTripAmountByClass(
                                          item,
                                          stationId
                                        )
                                      : getOriginalAmountByClassNew(
                                          item,
                                          stationId
                                        )) - item.discount,
                                })
                              ),
                              formatter({
                                type: "amount",
                                amount:
                                  (roundTrip
                                    ? getRoundTripAmountByClass(item, stationId)
                                    : getOriginalAmountByClassNew(
                                        item,
                                        stationId
                                      )) - item.discount,
                              })
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {item?.coachClass === "B_Class"
                      ? "Business Class"
                      : item?.coachClass === "S_Class"
                      ? "Suite Class"
                      : item?.coachClass === "Sleeper"
                      ? "Sleeper Coach"
                      : "Economy Class"}
                  </td>
                  <td className="border border-gray-300 px-2 text-sm">
                    {translate(
                      getDroppingTime(item, stationId, roundTrip) ||
                        "সময় পাওয়া যায়নি",
                      getDroppingTime(item, stationId, roundTrip) ||
                        "Time not found"
                    )}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                     {item?.coach?.seatPlan?.noOfSeat -
                      item?.orderSeat?.filter(
                        (s: any) => s.status === "Success"
                      ).length}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <Button
                      variant="viewSeat"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation(); // Prevent row click
                        handleToggleRow(index, item);
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
                    <td colSpan={10} className="p-2 text-center w-full">
                      <div className="border-2 border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] flex justify-center items-center max-w-[330px] mx-auto">
                        <SeatLayoutSelector
                          checkingSeat={checkingSeat}
                          coachClass={item?.coach?.coachClass}
                          bookingCoach={item}
                          handleBookingSeat={handleBookingSeat}
                          bookingFormState={bookingFormState}
                          addBookingSeatLoading={false}
                          removeBookingSeatLoading={false}
                          bookedSeatList={bookedSeatList}
                          // coachId={item.id}
                          handleCancelTicket={() => {}}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
      </tbody>
    </table>
  );
};

export default HomeRoundTripTickitTable;
