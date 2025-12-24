import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  setBookedSeatList,
  setBookingCoachesList,
  setCoachNo,
  // setCoachType,
  setDate,
  setDestinationCounterId,
  setFromCounterId,
  setIsLoadingBookingCoachesList,
  setIsLoadingRoundTripGoBookingCoachesList,
  setIsLoadingRoundTripReturnBookingCoachesList,
  // setOrderType,
  setRoundTripGoBookingCoachesList,
  setRoundTripReturnBookingCoachesList,
  setSchedule,
} from "@/store/api/counter/counterSearchFilterSlice";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetStationsQuery } from "@/store/api/vehiclesSchedule/stationApi";
import { Counter } from "@/types/dashboard/vehicleeSchedule.ts/counter";
import { useLazyGetBookingCoachesQuery } from "@/store/api/bookingApi";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import PageTransition from "@/components/common/effect/PageTransition";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/common/typography/Label";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { addUpdateCoachConfigurationForm } from "@/utils/constants/form/addUpdateCoachConfigurationForm";
import { useGetSchedulesQuery } from "@/store/api/vehiclesSchedule/scheduleApi";

interface IDashboardBookingProps {
  bookingState: any;
  setBookingState: any;
}
interface ICounter {
  id: number;
  name: string;
  isSegment: boolean;
}

export interface IDashboardBookingStateProps {
  calenderOpen: boolean;
  fromStationId: number | null;
  toStationId: number | null;
  coachType: string;
  coachNo: string;
  schedule: string;
  date: Date | null;
  bookingCoachesList: any[];
}

const TickitSearchDashboard: FC<IDashboardBookingProps> = ({
  bookingState,
  setBookingState,
}) => {
  const dispatch = useDispatch();
  const { translate } = useCustomTranslator();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [returnPopoverOpen, setReturnPopoverOpen] = useState(false);
  const { counter } = shareAuthentication();
  const navigate = useNavigate();

  const { data: schedulesData, isLoading: schedulesLoading } =
    useGetSchedulesQuery({}) as any;
  const [
    trigger,
    { data: bookingCoachesData, isLoading: isLoadingBookingCoaches },
  ] = useLazyGetBookingCoachesQuery();

  const shouldFetchData = Boolean(
    bookingState.fromStationId &&
      bookingState.toStationId &&
      bookingState.coachType &&
      bookingState.date &&
      (bookingState.orderType === "One_Trip" || bookingState.returnDate) &&
      bookingState.orderType
  );

  // Handler for search button click
  const handleSearch = () => {
    if (shouldFetchData) {
      trigger({
        fromStationId: bookingState.fromStationId,
        toStationId: bookingState.toStationId,
        coachType: bookingState.coachType,
        date: bookingState.date
          ? format(new Date(bookingState.date), "yyyy-MM-dd")
          : undefined,
        returnDate:
          bookingState.orderType !== "One_Trip" && bookingState.returnDate
            ? format(new Date(bookingState.returnDate), "yyyy-MM-dd")
            : undefined,
        orderType: bookingState.orderType,
        coachNo: bookingState.coachNo,
        schedule: bookingState.schedule,
      });

      navigate(`search-ticket`);
    }
  };

  // Dispatch loading flags for booking coaches
  useEffect(() => {
    if (bookingState.orderType === "One_Trip") {
      dispatch(setIsLoadingRoundTripGoBookingCoachesList(false));
      dispatch(setIsLoadingRoundTripReturnBookingCoachesList(false));
      dispatch(setIsLoadingBookingCoachesList(isLoadingBookingCoaches));
    } else if (bookingState.orderType === "Round_Trip") {
      // Assuming the same query fetches both go and return data
      dispatch(
        setIsLoadingRoundTripGoBookingCoachesList(isLoadingBookingCoaches)
      );
      dispatch(
        setIsLoadingRoundTripReturnBookingCoachesList(isLoadingBookingCoaches)
      );
      dispatch(setIsLoadingBookingCoachesList(false));
    }
  }, [bookingState.orderType, isLoadingBookingCoaches, dispatch]);

  useEffect(() => {
    if (bookingState.orderType === "One_Trip") {
      if (
        bookingState.fromStationId &&
        bookingState.toStationId &&
        bookingState.date &&
        bookingState.coachType
      ) {
        dispatch(setBookingCoachesList(bookingCoachesData?.data || []));
        dispatch(setBookedSeatList(bookingCoachesData?.bookedSeat || []));
      } else {
        dispatch(setBookingCoachesList([]));
      }
    } else if (bookingState.orderType === "Round_Trip") {
      if (
        bookingState.fromStationId &&
        bookingState.toStationId &&
        bookingState.date &&
        bookingState.returnDate &&
        bookingState.coachType
      ) {
        dispatch(
          setRoundTripGoBookingCoachesList(bookingCoachesData?.data || [])
        );
        dispatch(
          setRoundTripReturnBookingCoachesList(
            bookingCoachesData?.returnData || []
          )
        );
        dispatch(setBookedSeatList(bookingCoachesData?.bookedSeat || []));
      } else {
        dispatch(setRoundTripGoBookingCoachesList([]));
        dispatch(setRoundTripReturnBookingCoachesList([]));
      }
    }
  }, [
    bookingState.fromStationId,
    bookingState.toStationId,
    bookingState.date,
    bookingState.returnDate,
    bookingState.coachType,
    bookingState.orderType,
    bookingCoachesData,
    dispatch,
  ]);
  // Fetch counters data
  const { data: countersData, isLoading: countersLoading } =
    useGetStationsQuery({}) as any;

  const [myCounter, setMyCounter] = useState<ICounter | null>(null);

  useEffect(() => {
    const filterStation = countersData?.data?.filter(
      (c: any) => c.isSegment === true
    );

    let myStation = filterStation?.find((s: any) => s.id === counter.stationId);
    if (!myStation) {
      myStation = filterStation?.find(
        (s: any) => s?.name?.toLowerCase() === "dhaka"
      );
    }
    if (myStation) {
      setMyCounter(myStation);
    } else {
      setMyCounter(null);
    }
  }, [counter?.stationId, countersData?.data]);

  useEffect(() => {
    if (!bookingState?.fromStationId && myCounter) {
      const counterId = myCounter?.id ?? null;

      dispatch(setFromCounterId(counterId));
      setBookingState((prevState: IDashboardBookingStateProps) => ({
        ...prevState,
        fromStationId: counterId,
      }));
    }
  }, [bookingState?.fromStationId, dispatch, setBookingState, myCounter]);

  function useDeviceWidth() {
    const [width, setWidth] = useState(window.screen.width);

    useEffect(() => {
      const handleResize = () => setWidth(window.screen.width);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
  }

  return (
    <div className="flex pb-2 justify-start items-center px-4">
      <div className="w-auto">
        <div className="">
          <div className="">
            <ul className="grid lg:grid-cols-9 gap-4 justify-start">
              <li className="lg:col-span-1 pt-2">
                <PageTransition className="w-full">
                  <div className="">
                    <RadioGroup
                      value={bookingState?.orderType || "One_Trip"}
                      onValueChange={(value) => {
                        const newType = value as "One_Trip" | "Round_Trip";
                        setBookingState({
                          ...bookingState,
                          orderType: newType,
                        });
                      }}
                      className="flex flex-col gap-2 justify-center"
                    >
                      <div className="flex items-center space-x-2 text-white">
                        <RadioGroupItem
                          value="One_Trip"
                          id="one"
                          className="text-white bg-white fill-primary"
                        />
                        <Label
                          htmlFor="one"
                          className="cursor-pointer font-medium text-white text-sm"
                        >
                          One Way
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Round_Trip"
                          id="round"
                          className="text-white bg-white fill-primary"
                        />
                        <Label
                          htmlFor="round"
                          className="cursor-pointer font-medium text-white text-sm"
                        >
                          Round Trip
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </PageTransition>
              </li>
              {useDeviceWidth() < 767 && (
                <div className="flex w-full items-center justify-between pt-5">
                  <Button
                    disabled={!shouldFetchData}
                    onClick={handleSearch}
                    className="h-8 px-3 ml-3"
                  >
                    Search
                  </Button>
                </div>
              )}

              {/* STARTING POINT */}
              <li>
                <label htmlFor="" className="text-sm font-semibold text-white">
                  Leaving From:{" "}
                </label>
                <Select
                  value={bookingState.fromStationId?.toString()}
                  onValueChange={(value: string) => {
                    const selectedCounterId = +value;

                    dispatch(setFromCounterId(selectedCounterId));
                    setBookingState(
                      (prevState: IDashboardBookingStateProps) => ({
                        ...prevState,
                        fromStationId: selectedCounterId,
                      })
                    );
                  }}
                >
                  <SelectTrigger className="bg-background h-8 text-sm font-semibold">
                    <SelectValue
                      placeholder={translate(
                        "শুরু করার কাউন্টার",
                        "Starting Counter"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {!countersLoading &&
                      countersData?.data
                        ?.filter(
                          (counter: Counter) =>
                            counter.id !== bookingState.toStationId &&
                            counter?.isSegment === true
                        )
                        ?.map((counter: any) => (
                          <SelectItem
                            key={counter.id}
                            value={counter.id.toString()}
                            className="text-sm font-semibold"
                          >
                            {counter.name}
                          </SelectItem>
                        ))}
                    {countersLoading && !countersData?.data?.length && (
                      <SelectSkeleton />
                    )}
                  </SelectContent>
                </Select>
              </li>

              {/* ENDING POINT */}
              <li>
                <label htmlFor="" className="text-sm font-semibold text-white">
                  Going To:{" "}
                </label>
                <Select
                  value={bookingState?.toStationId?.toString() || ""}
                  onValueChange={(value: string) => {
                    dispatch(setDestinationCounterId(+value));
                    setBookingState(
                      (prevState: IDashboardBookingStateProps) => ({
                        ...prevState,
                        toStationId: +value,
                      })
                    );
                  }}
                >
                  <SelectTrigger className="bg-background h-8 text-sm font-semibold">
                    <SelectValue
                      placeholder={translate(
                        "গন্তব্য কাউন্টার",
                        "Ending Counter"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {!countersLoading &&
                      countersData?.data
                        .filter(
                          (counter: Counter) =>
                            counter.id !== bookingState.fromStationId &&
                            counter?.isSegment === true
                        )
                        ?.map((counter: any) => (
                          <SelectItem
                            key={counter.id}
                            value={counter.id.toString()}
                            className="text-sm font-bold"
                          >
                            {counter.name}
                          </SelectItem>
                        ))}
                    {countersLoading && !countersData?.data?.length && (
                      <SelectSkeleton />
                    )}
                  </SelectContent>
                </Select>
              </li>
              {/* COACH NO */}
              <li>
                <label htmlFor="" className="text-sm font-semibold text-white">
                  Coach No:{" "}
                </label>
                <Input
                  type="text"
                  className="h-8"
                  value={bookingState?.coachNo || ""}
                  onChange={(e) => {
                    dispatch(setCoachNo(e.target.value));
                    setBookingState(
                      (prevState: IDashboardBookingStateProps) => ({
                        ...prevState,
                        coachNo: e.target.value,
                      })
                    );
                  }}
                />
              </li>

              {/* COACH TYPE */}
              {/* <li>
                <Select
                  value={bookingState.coachType || ""}
                  onValueChange={(value: string) => {
                    dispatch(setCoachType(value));
                    setBookingState(
                      (prevState: IDashboardBookingStateProps) => ({
                        ...prevState,
                        coachType: value,
                      })
                    );
                  }}
                >
                  <SelectTrigger className="bg-background h-8">
                    <SelectValue
                      placeholder={translate("কোচের ধরণ", "Coach Type")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="AC">
                      {translate("শীতাতপ নিয়ন্ত্রিত", "Air Condition")}
                    </SelectItem>
                    <SelectItem value="NON AC">
                      {translate(
                        "শীতাতপ নিয়ন্ত্রিত বিহীন",
                        "Without Air Condition"
                      )}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </li> */}

              {/* DATE */}
              <li>
                <label htmlFor="" className="text-sm font-semibold text-white">
                  Departing On:{" "}
                </label>
                <Popover
                  open={popoverOpen}
                  onOpenChange={(open) => setPopoverOpen(open)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setPopoverOpen(true)}
                      className={cn(
                        "bg-background justify-start w-full text-left font-normal h-8 text-sm px-3",
                        !bookingState.date && "text-muted-foreground"
                      )}
                    >
                      {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                      {bookingState.date
                        ? format(bookingState.date, "dd/MM/yyyy")
                        : translate(
                            "বুকিংয়ের তারিখ নির্বাচন করুন",
                            "Pick The Booking Date"
                          )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="bg-background h-8">
                    <Calendar
                      mode="single"
                      selected={
                        bookingState.date
                          ? new Date(bookingState.date)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const dateString = date.toISOString(); // Convert to string if dispatching
                          dispatch(setDate(dateString)); // Dispatch to Redux as string
                          setBookingState(
                            (prevState: IDashboardBookingStateProps) => ({
                              ...prevState,
                              date, // Or dateString if setting as string in local state
                            })
                          );
                          setPopoverOpen(false);
                        }
                      }}
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      captionLayout="dropdown-buttons"
                    />
                  </PopoverContent>
                </Popover>
              </li>
              {bookingState?.orderType === "Round_Trip" && (
                <li>
                  <label
                    htmlFor=""
                    className="text-sm font-semibold text-white"
                  >
                    Return On:{" "}
                  </label>
                  <Popover
                    open={returnPopoverOpen}
                    onOpenChange={(open) => setReturnPopoverOpen(open)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "bg-background justify-start w-full text-left font-normal h-8 text-sm px-3",
                          !bookingState.returnDate && "text-muted-foreground"
                        )}
                      >
                        {bookingState.returnDate
                          ? format(bookingState.returnDate, "dd/MM/yyyy")
                          : "Return Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end">
                      <Calendar
                        mode="single"
                        selected={
                          bookingState.returnDate
                            ? new Date(bookingState.returnDate)
                            : undefined
                        }
                        onSelect={(date) => {
                          if (!date) {
                            // If user clears date, set returnDate to null
                            setBookingState({
                              ...bookingState,
                              returnDate: null,
                            });
                            return;
                          }

                          const formattedReturnDate = format(
                            date,
                            "yyyy-MM-dd"
                          );
                          localStorage.setItem(
                            "returnDate",
                            formattedReturnDate
                          );
                          setBookingState({
                            ...bookingState,
                            returnDate: formattedReturnDate,
                          });
                          setReturnPopoverOpen(false)
                        }}
                        disabled={(date) =>
                          !bookingState.date ||
                          date <= new Date(bookingState.date)
                        }
                        fromDate={
                          bookingState.date
                            ? new Date(bookingState.date)
                            : new Date()
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </li>
              )}
              <li>
                {/* SCHEDULE */}
                <InputWrapper
                  error={""}
                  labelFor="schedule"
                  className="text-white"
                  label={"Departing Time:"}
                >
                  <Select
                    value={bookingState?.schedule || ""}
                    onValueChange={(value: string) => {
                      dispatch(setSchedule(value));
                      setBookingState(
                        (prevState: IDashboardBookingStateProps) => ({
                          ...prevState,
                          schedule: value,
                        })
                      );
                    }}
                  >
                    <SelectTrigger id="schedule" className="w-full h-8">
                      <SelectValue
                        placeholder={translate(
                          addUpdateCoachConfigurationForm.schedule.placeholder
                            .bn,
                          addUpdateCoachConfigurationForm.schedule.placeholder
                            .en
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {!schedulesLoading &&
                        schedulesData?.data?.length > 0 &&
                        schedulesData?.data?.map(
                          (singleSchedule: any, scheduleIndex: number) => (
                            <SelectItem
                              key={scheduleIndex}
                              value={singleSchedule?.time}
                            >
                              {singleSchedule?.time}
                            </SelectItem>
                          )
                        )}

                      {schedulesLoading && !schedulesData?.data?.length && (
                        <SelectSkeleton />
                      )}
                    </SelectContent>
                  </Select>
                </InputWrapper>
              </li>

              {/* SEARCH BUTTON */}
              <div className="flex items-center gap-2 w-full">
                {useDeviceWidth() > 767 && (
                  <li className="flex w-full items-center justify-between mt-[18px]">
                    <Button
                      disabled={!shouldFetchData}
                      onClick={handleSearch}
                      className="h-[34px] px-5 ml-3"
                      size={"sm"}
                    >
                      Search
                    </Button>
                  </li>
                )}
                {/* REFRESH BUTTON */}
                {/* <li>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="text-muted-foreground w-full px-2 bg-background h-8 text-sm"
                          onClick={() => {
                            dispatch(setFromCounterId(null));
                            dispatch(setDestinationCounterId(null));
                            dispatch(setCoachType("AC"));
                            dispatch(setOrderType("One_Trip"));
                            dispatch(setDate(format(new Date(), "yyyy-MM-dd")));
                            setBookingState({
                              calenderOpen: false,
                              fromStationId: null,
                              toStationId: null,
                              coachType: "AC",
                              date: format(new Date(), "yyyy-MM-dd"),
                              bookingCoachesList: [],
                            });
                          }}
                          variant="outline"
                        >
                          Reset
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{translate("ফিল্টার রিসেট", "Reset Filter")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li> */}
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TickitSearchDashboard;
