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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useGetBookingCoachesQuery } from "@/store/api/bookingApi";
import {
  setBookedSeatList,
  setBookingCoachesList,
  setCoachType,
  setCounterId,
  setDate,
  setDestinationCounterId,
  setFromCounterId,
  setIsLoadingBookingCoachesList,
  setIsLoadingRoundTripGoBookingCoachesList,
  setIsLoadingRoundTripReturnBookingCoachesList,
  // setOrderType,
  setRoundTripGoBookingCoachesList,
  setRoundTripReturnBookingCoachesList,
  setUserId,
} from "@/store/api/counter/counterSearchFilterSlice";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetStationsQuery } from "@/store/api/vehiclesSchedule/stationApi";
import { Counter } from "@/types/dashboard/vehicleeSchedule.ts/counter";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import { useGetUserListQuery } from "@/store/api/adminReport/adminReportApi";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CounterFindTicket from "@/pages/dashboard/counterRole/tickit/CounterFindTicket";
import PageTransition from "../../effect/PageTransition";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../../typography/Label";

interface IDashboardBookingProps {
  bookingState: any;
  setBookingState: any;
}

export interface IDashboardBookingStateProps {
  calenderOpen: boolean;
  fromStationId: number | null;
  toStationId: number | null;
  coachType: string;
  counterId: number | null;
  userId: number | null;
  date: Date | null;
  bookingCoachesList: any[];
}

const CallcenterTickitSearchDashboard: FC<IDashboardBookingProps> = ({
  bookingState,
  setBookingState,
}) => {
  const [counterIdSelect, setCounterIdSelect] = useState<number | null>(null);
  const [userIdSelect, setUserIdSelect] = useState<number | null>(null);
  const dispatch = useDispatch();
  const { translate } = useCustomTranslator();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isManualSearch, setIsManualSearch] = useState(false);

  //   const user = useSelector((state: any) => state.user);

  const { data: counterData, isLoading: counterLoading } = useGetCountersQuery({
    page: 1,
    size: 99999,
  });

  const { data: userList, isLoading: userLoading } = useGetUserListQuery({
    page: 1,
    size: 99999,
  });

  const shouldFetchData = Boolean(
    (isManualSearch || bookingState.orderType === "Round_Trip") &&
      bookingState.fromStationId &&
      bookingState.toStationId &&
      bookingState.coachType &&
      bookingState.date &&
      (bookingState.orderType === "One_Trip" || bookingState.returnDate)
  );

  const { data: bookingCoachesData, isLoading: isLoadingBookingCoaches } =
    useGetBookingCoachesQuery(
      shouldFetchData
        ? {
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
          }
        : {},
      { skip: !shouldFetchData }
    ) as any;

  // Reset manual search flag when inputs change
  useEffect(() => {
    setIsManualSearch(false);
  }, [
    bookingState.fromStationId,
    bookingState.toStationId,
    bookingState.coachType,
    bookingState.date,
    bookingState.orderType,
    bookingState.counterId,
    bookingState.userId,
    setIsManualSearch,
  ]);

  // Dispatch loading flags for booking coaches
  useEffect(() => {
    if (bookingState.orderType === "One_Trip") {
      dispatch(setIsLoadingRoundTripGoBookingCoachesList(false));
      dispatch(setIsLoadingRoundTripReturnBookingCoachesList(false));
      dispatch(setIsLoadingBookingCoachesList(isLoadingBookingCoaches));
    } else if (bookingState.orderType === "Round_Trip") {
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

  useEffect(() => {
    if (!bookingState?.fromStationId && bookingState?.counterId) {
      dispatch(setFromCounterId(bookingState?.counterId));
      setBookingState((prevState: IDashboardBookingStateProps) => ({
        ...prevState,
        fromStationId: bookingState?.counterId,
      }));
    }
  }, [
    bookingState?.fromStationId,
    bookingState?.counterId,
    dispatch,
    setBookingState,
  ]);

  return (
    <div className="flex pb-2 justify-start items-center">
      <div className="w-auto">
        <div className="">
          <div className="rounded-xl">
            <ul className="flex items-center gap-1 justify-start">
              <li className="lg:col-span-2">
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
                      className="flex gap-2 justify-center items-center "
                    >
                      <div className="flex items-center space-x-2 text-white">
                        <RadioGroupItem value="One_Trip" id="one" />
                        <Label
                          htmlFor="one"
                          className="cursor-pointer font-medium text-white text-sm"
                        >
                          One Way
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Round_Trip" id="round" />
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

              {/* STARTING POINT */}
              <li>
                <Select
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
                  <SelectTrigger className="bg-background h-8">
                    <SelectValue
                      placeholder={translate(
                        "শুরু করার কাউন্টার",
                        "Start Counter"
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
                  <SelectTrigger className="bg-background h-8">
                    <SelectValue
                      placeholder={translate("গন্তব্য কাউন্টার", "End Counter")}
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

              {/* COACH TYPE */}
              <li>
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
              </li>

              {/* DATE */}
              <li>
                <Popover
                  open={popoverOpen}
                  onOpenChange={(open) => setPopoverOpen(open)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setPopoverOpen(true)}
                      className={cn(
                        "bg-background justify-start text-left font-normal text-sm h-8 px-3",
                        !bookingState.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingState.date
                        ? format(bookingState.date, "dd/MM/yyyy")
                        : translate(
                            "বুকিংয়ের তারিখ নির্বাচন করুন",
                            "Pick The Booking Date"
                          )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="bg-background">
                    <Calendar
                      mode="single"
                      selected={
                        bookingState.date
                          ? new Date(bookingState.date)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const dateString = date.toISOString();
                          dispatch(setDate(dateString));
                          setBookingState(
                            (prevState: IDashboardBookingStateProps) => ({
                              ...prevState,
                              date,
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
                  <Popover>
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
              {/* COUNTER SELECT */}
              <li>
                <Select
                  value={bookingState?.counterId?.toString() || ""}
                  onValueChange={(value: string) => {
                    dispatch(setCounterId(+value));
                    setCounterIdSelect(+value);
                    setBookingState(
                      (prevState: IDashboardBookingStateProps) => ({
                        ...prevState,
                        counterId: +value,
                      })
                    );
                  }}
                >
                  <SelectTrigger className="bg-background h-8">
                    <SelectValue
                      placeholder={translate(
                        "কাউন্টার নির্বাচন করুন",
                        "Select Counter"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {!counterLoading &&
                      counterData?.data?.map((counter: any) => (
                        <SelectItem
                          key={counter.id}
                          value={counter.id.toString()}
                        >
                          {counter.name}
                        </SelectItem>
                      ))}
                    {counterLoading && <SelectSkeleton />}
                  </SelectContent>
                </Select>
              </li>

              {/* USER SELECT */}
              <li>
                <Select
                  value={bookingState?.userId?.toString() || ""}
                  onValueChange={(value: string) => {
                    dispatch(setUserId(+value));
                    setUserIdSelect(+value);
                    setBookingState(
                      (prevState: IDashboardBookingStateProps) => ({
                        ...prevState,
                        userId: +value,
                      })
                    );
                  }}
                >
                  <SelectTrigger className="bg-background h-8">
                    <SelectValue
                      placeholder={translate(
                        "ব্যবহারকারী নির্বাচন করুন",
                        "Select User"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {!userLoading &&
                      userList?.data
                        ?.filter(
                          (u: any) => +u.counterId === +bookingState?.counterId
                        )
                        ?.map((user: any) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.userName}
                          </SelectItem>
                        ))}
                    {userLoading && <SelectSkeleton />}
                  </SelectContent>
                </Select>
              </li>

              {/* SEARCH BUTTON */}
              <li>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size={"xs"}
                        onClick={() => {
                          if (bookingState.orderType === "One_Trip") {
                            setIsManualSearch(true);
                          }
                        }}
                        className="bg-primary text-white p-1 h-8"
                        disabled={
                          counterIdSelect === null || userIdSelect === null
                        }
                      >
                        <Search />
                      </Button>
                    </TooltipTrigger>
                    {(!counterIdSelect || !userIdSelect) && (
                      <TooltipContent>
                        <p>
                          {translate(
                            "Select counter and user first",
                            "প্রথমে কাউন্টার এবং ব্যবহারকারী নির্বাচন করুন"
                          )}
                        </p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </li>

              {/* REFRESH BUTTON */}
              <li className="lg:ml-3 md:ml-12">
                {/* <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="text-muted-foreground bg-background h-8"
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
                            counterId: null,
                            userId: null,
                            date: format(new Date(), "yyyy-MM-dd"),
                            bookingCoachesList: [],
                          });
                          setIsManualSearch(false);
                        }}
                        variant="outline"
                        size="icon"
                      >
                        <LuRefreshCw className="size-[21px]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{translate("ফিল্টার রিসেট", "Reset Filter")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full flex justify-start py-2 h-8 mr-5"
                      size="sm"
                    >
                      Find Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[1200px] max-h-[90%] overflow-y-auto">
                    {/* EXPENSE DETAILS */}

                    <CounterFindTicket />
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallcenterTickitSearchDashboard;
