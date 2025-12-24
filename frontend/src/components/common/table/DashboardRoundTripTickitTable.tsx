import { Button } from "@/components/ui/button";
import {
  useAddBookingSeatMutation,
  useCheckingSeatMutation,
  useRemoveBookingSeatMutation,
} from "@/store/api/bookingApi";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect, useRef, useState } from "react";
import SeatLayoutSelector from "../busSeatLayout/SeatLayoutSelector";
import {
  getBoardingTime,
  getRoundTripAmountByClass,
  getRoundTripStationNameBySearch,
} from "@/utils/helpers/getRountTripAmountByClass";
import {
  getOriginalAmountByClassNew,
  getStationNameBySearch,
} from "@/utils/helpers/getOriginalAmountByClass";
import { getAmountInRoundTripBooking } from "@/utils/helpers/getAmountInRoundTripBooking";
import { useGetFundMoneyQuery } from "@/store/api/counter/fundApi";
import { calculateSeatAmounts } from "@/utils/helpers/calculateSeatAmount";
import { toast } from "sonner";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { formatDisplayDate } from "@/utils/helpers/dateFomateBD";

interface IGenericBookingTableProps {
  data: any; // Array of data for the table
  bookingFormState: any; // Current booking form state
  setBookingFormState: any; // Setter for booking form state
  setGoViaRoute: any;
  setReturnViaRoute: any;
  setBookingCoachSingle: any;
  // bookingCoachSingle: any;
  stationId: any;
  roundTrip: boolean;
  setGoReturnCoachId: any;
  bookedSeatList: any;
}

const DashboardRoundTripTickitTable: FC<IGenericBookingTableProps> = ({
  data,
  bookingFormState,
  setBookingFormState,
  setGoViaRoute,
  setReturnViaRoute,
  setBookingCoachSingle,
  stationId,
  roundTrip,
  setGoReturnCoachId,
  bookedSeatList,
}) => {
  const { permission } = shareAuthentication();
  const { translate } = useCustomTranslator();
  const [checkingSeat] = useCheckingSeatMutation();
  const [selectedBookingCoach, setSelectedBookingCoach] = useState<any>({});
  const { data: fund } = useGetFundMoneyQuery({});
  const [openRowIndex, setOpenRowIndex] = useState<any>({});
  const [removeBookingSeat, { isLoading: removeBookingSeatLoading }] =
    useRemoveBookingSeatMutation({}) as any;
  const expandedRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (openRowIndex !== null && expandedRowRef.current) {
      expandedRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Scrolls to center vertically
      });
    }
  }, [openRowIndex]);

  const handleToggleRow = (index: number, coachInfo: any) => {
    setOpenRowIndex((prevIndex: any) => (prevIndex === index ? null : index)); // Toggle index

    setSelectedBookingCoach(coachInfo);
  };
  const [addBookingSeat, { isLoading: addBookingSeatLoading }] =
    useAddBookingSeatMutation();

  const handleBookingSeat = async (seatData: any, id: any) => {
    try {
      const { currentAmount, previousAmount } = calculateSeatAmounts(
        seatData,
        selectedBookingCoach,
        stationId
      );

      // Calculate total if this seat is added
      const newTotal =
        bookingFormState.selectedSeats.reduce(
          (total: number, seat: any) =>
            total + ((seat?.currentAmount || 0) - (seat?.previousAmount || 0)),
          0
        ) +
        (currentAmount - previousAmount);

      // Prevent selection if balance is not enough → auto-unselect
      if (
        permission?.isPrepaid == true &&
        newTotal > (fund?.data?.balance || 0)
      ) {
        toast.error("Not enough balance!");
        setBookingFormState((prevState: any) => ({
          ...prevState,
          selectedSeats: prevState.selectedSeats.filter(
            (seat: any) => seat.seat !== seatData.seat
          ),
        }));
        return;
      }
      const isSeatAlreadySelected = bookingFormState.selectedSeats.some(
        (current: any) =>
          current.seat === seatData.seat && current.coachConfigId === id
      );

      if (isSeatAlreadySelected) {
        // Remove the seat if it's already selected
        const result = await removeBookingSeat({
          coachConfigId: selectedBookingCoach?.id,
          // fromStationId: stationId?.fromStationId,
          // destinationStationId: stationId?.toStationId,
          seat: seatData.seat,
        });

        if (result?.data?.success) {
          setBookingFormState((prevState: any) => ({
            ...prevState,
            selectedSeats: prevState.selectedSeats.filter(
              (seat: any) => seat.seat !== seatData.seat
            ),
          }));
        } else {
          console.error("Failed to remove seat:", result?.error);
        }
      } else {
        const { currentAmount, previousAmount } = calculateSeatAmounts(
          seatData,
          selectedBookingCoach,
          stationId
        );

        // Calculate total if this seat is added
        const newTotal =
          bookingFormState.selectedSeats.reduce(
            (total: number, seat: any) =>
              total +
              ((seat?.currentAmount || 0) - (seat?.previousAmount || 0)),
            0
          ) +
          (currentAmount - previousAmount);

        // Prevent selection if balance is not enough → auto-unselect
        if (
          permission?.isPrepaid === true &&
          newTotal > (fund?.data?.balance || 0)
        ) {
          toast.error("Not enough balance!");
          setBookingFormState((prevState: any) => ({
            ...prevState,
            selectedSeats: prevState.selectedSeats.filter(
              (seat: any) => seat.seat !== seatData.seat
            ),
          }));
          return;
        }
        // Add the seat if it's not already selected
        const result = await addBookingSeat({
          coachConfigId: selectedBookingCoach?.id,
          // fromStationId: stationId?.fromStationId,
          // destinationStationId: stationId?.toStationId,
          seat: seatData.seat,
        });

        if (result?.data?.data?.available) {
          setBookingFormState((prevState: any) => ({
            ...prevState,
            selectedSeats: [
              ...prevState.selectedSeats,
              {
                seat: seatData.seat,
                coachConfigId: selectedBookingCoach.id,
                date: selectedBookingCoach.departureDate,
                currentAmount: getAmountInRoundTripBooking(
                  selectedBookingCoach?.coach,
                  selectedBookingCoach?.coach?.coachType,
                  selectedBookingCoach?.coach?.coachClass,
                  stationId,
                  seatData.seat,
                  roundTrip
                ),
                schedule: (() => {
                  const matchedRoute =
                    selectedBookingCoach?.coach?.CoachViaRoute?.find(
                      (s: any) =>
                        s?.counter?.stationId === stationId?.fromStationId
                    );

                  if (!matchedRoute) return null;

                  if (matchedRoute.isBoardingPoint)
                    return matchedRoute.boardingTime;
                  if (matchedRoute.isDroppingPoint)
                    return matchedRoute.droppingTime;

                  return null;
                })(),
                previousAmount: selectedBookingCoach?.discount,
              },
            ],
          }));
          setGoReturnCoachId((prevState: any) => ({
            ...prevState,
            goCoachConfigId:
              !roundTrip && selectedBookingCoach?.id
                ? selectedBookingCoach.id
                : prevState.goCoachConfigId,
            returnCoachConfigId:
              roundTrip && selectedBookingCoach?.id
                ? selectedBookingCoach.id
                : prevState.returnCoachConfigId,
          }));
          setBookingCoachSingle(selectedBookingCoach); // Set only when booking successfully
        } else {
          console.error("Seat is not available or failed to book:", result);
        }
      }
    } catch (error) {
      console.error("Error handling booking seat:", error);
    }
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
  // if (data.length) {
  //   return <TableSkeleton />;
  // }

  return (
    <table className="min-w-full text-center border-collapse border border-gray-300">
      <thead>
        <tr className="bg-primary text-white">
          <th className="border-2 border-[#3491b1] p-2">
            {translate("সিরিয়াল নং", "SL No")}
          </th>

          <th className="border-2 border-[#3491b1] p-2">
            {translate("যাত্রা শুরু সময়", "Dep. Date & Time")}
          </th>

          <th className="border-2 border-[#3491b1] p-1 w-[20%]">
            {translate("কোচ নং", "Coach No")}
          </th>
          <th className="border-2 border-[#3491b1] p-1">
            {translate("শুরুর কাউন্টার", "Starting Station")}
          </th>
          <th className="border-2 border-[#3491b1] p-1">
            {translate("শেষের কাউন্টার", "End Station")}
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
        {[...data]
          .sort((a: any, b: any) => {
            const scheduleA = a?.coach?.CoachViaRoute?.find(
              (s: any) => s.counter?.stationId === stationId?.fromStationId
            )?.boardingTime;

            const scheduleB = b?.coach?.CoachViaRoute?.find(
              (s: any) => s.counter?.stationId === stationId?.fromStationId
            )?.boardingTime;

            // Convert to Date or comparable value
            const timeA = scheduleA ? new Date(`${scheduleA}:00`) : new Date(0);
            const timeB = scheduleB ? new Date(`${scheduleB}:00`) : new Date(0);

            return timeA.getTime() - timeB.getTime();
          })
          ?.map((item: any, index: number) => (
            <>
              <tr
                onClick={() => handleToggleRow(index, item)}
                key={index}
                className={`text-sm ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-100 dark:bg-gray-800"
                } hover:bg-[#e074ee] cursor-pointer`}
              >
                <td>{index + 1}</td>

                <td className="border border-gray-300 px-2 py-1">
                  {translate(
                    getBoardingTime(item, stationId, roundTrip) ||
                      "সময় পাওয়া যায়নি",
                    getBoardingTime(item, stationId, roundTrip) ||
                      "Time not found"
                  )}
                  {formatDisplayDate(item?.departureDate)}
                </td>

                <td className="border border-gray-300 px-2 py-1 text-center">
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
                <td className="border border-gray-300 px-2 py-1">
                  {item.registrationNo || translate("N/A", "N/A")}
                </td>
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
                                    ? getRoundTripAmountByClass(item, stationId)
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
                                    ? getRoundTripAmountByClass(item, stationId)
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
                <td className="border border-gray-300 py-1 px-2">
                  {item?.coachType || "N/A"}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {item?.orderSeat?.length
                    ? translate(
                        `${convertToBnDigit(
                          item?.orderSeat?.filter(
                            (s: any) => s.status === "Success"
                          ).length
                        )}`,
                        item?.orderSeat?.filter(
                          (s: any) => s.status === "Success"
                        ).length
                      )
                    : "0"}
                </td>

                <td className="border border-gray-300 px-2 py-1">
                  {item?.CounterBookedSeat?.length
                    ? translate(
                        `${convertToBnDigit(item?.CounterBookedSeat?.length)}`,
                        item.CounterBookedSeat?.length
                      )
                    : "0"}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {item?.coach?.seatPlan?.noOfSeat -
                      item?.orderSeat?.filter(
                        (s: any) => s.status === "Success"
                      ).length}
                </td>

                {/* <td className="border border-gray-300 p-2">
                {translate(
                  item.coachType === "AC"
                    ? "শীতাতপ নিয়ন্ত্রিত"
                    : "শীতাতপ নিয়ন্ত্রিত বিহীন",
                  item.coachType === "AC" ? "Air Conditioned" : "Non-AC"
                )}
              </td> */}

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
                  <td
                    colSpan={10} // Adjust according to the number of columns in the parent table
                    className="p-2 text-center w-full"
                  >
                    <div className="border-2 border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] flex justify-center items-center max-w-[330px] mx-auto">
                      <SeatLayoutSelector
                        checkingSeat={checkingSeat}
                        coachClass={item?.coach?.coachClass}
                        bookingCoach={item}
                        handleBookingSeat={handleBookingSeat}
                        bookingFormState={bookingFormState}
                        addBookingSeatLoading={addBookingSeatLoading}
                        removeBookingSeatLoading={removeBookingSeatLoading}
                        // coachId={item.id}
                        bookedSeatList={bookedSeatList}
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

export default DashboardRoundTripTickitTable;
