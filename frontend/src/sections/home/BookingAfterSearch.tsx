import PageTransition from "@/components/common/effect/PageTransition";
import { Loader } from "@/components/common/Loader";
import { Label } from "@/components/common/typography/Label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useGetBookingCoachesQuery } from "@/store/api/bookingApi";
import { useGetStationsQuery } from "@/store/api/vehiclesSchedule/stationApi";
import { Counter } from "@/types/dashboard/vehicleeSchedule.ts/counter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";

interface IBookingProps {
  bookingState: any;
  setBookingState: any;
}

export interface IBookingStateProps {
  calenderOpen: boolean;
  fromStationId: number | null;
  toStationId: number | null;
  returnCalenderOpen: boolean;
  coachType: string;
  date: Date | null;
  returnDate?: Date | null;
  bookingCoachesList: any[];
  roundTripGobookingCoachesList?: any[];
  roundTripReturnBookingCoachesList?: any[];
  bookedSeatList: any[];
  notFoundMessage: boolean;
}

const BookingAfterSearch: FC<IBookingProps> = ({ bookingState, setBookingState }) => {
  const { translate } = useCustomTranslator();
  const [tripType, setTripType] = useState("One_Trip");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const dropdownFromRef = useRef<HTMLDivElement>(null);
  const dropdownToRef = useRef<HTMLDivElement>(null);

  const shouldFetchData = Boolean(
    searchTriggered && // Only after clicking search
      bookingState.fromStationId &&
      bookingState.toStationId &&
      bookingState.coachType &&
      bookingState.date &&
      (tripType === "One_Trip" || bookingState.returnDate) &&
      tripType
  );

  const { data: bookingCoachesData, isLoading: bookingCoachLoading } =
    useGetBookingCoachesQuery(
      shouldFetchData
        ? {
            fromStationId: bookingState?.fromStationId,
            toStationId: bookingState?.toStationId,
            orderType: tripType,
            coachType: bookingState.coachType,
            date: bookingState.date && format(bookingState.date, "yyyy-MM-dd"),
            returnDate:
              tripType !== "One_Trip" && bookingState.returnDate
                ? format(bookingState.returnDate, "yyyy-MM-dd")
                : undefined,
          }
        : {},
      { skip: !shouldFetchData }
    ) as any;

  useEffect(() => {
    setBookingState((prevState: IBookingStateProps) => ({
      ...prevState,
      bookingCoachesList: [],
      roundTripGobookingCoachesList: [],
      roundTripReturnBookingCoachesList: [],
      bookedSeatList: [],
      notFoundMessage: false,
    }));
  }, [tripType, setBookingState]);

  useEffect(() => {
    if (shouldFetchData) {
      if (bookingCoachesData?.data && bookingCoachesData.data.length > 0) {
        if (tripType === "Round_Trip") {
          setBookingState((prevState: IBookingStateProps) => ({
            ...prevState,
            roundTripGobookingCoachesList: bookingCoachesData.data,
            roundTripReturnBookingCoachesList: bookingCoachesData.returnData,
            notFoundMessage: false,
          }));
        } else {
          setBookingState((prevState: IBookingStateProps) => ({
            ...prevState,
            bookingCoachesList: bookingCoachesData.data,
            roundTripGobookingCoachesList: [],
            roundTripReturnBookingCoachesList: [],
            notFoundMessage: false,
          }));
        }
      } else {
        if (!bookingCoachLoading) {
          setBookingState((prevState: IBookingStateProps) => ({
            ...prevState,
            bookingCoachesList: [],
            roundTripGobookingCoachesList: [],
            roundTripReturnBookingCoachesList: [],
            notFoundMessage: true,
          }));
        }
      }

      if (bookingCoachesData?.bookedSeat) {
        setBookingState((prevState: IBookingStateProps) => ({
          ...prevState,
          bookedSeatList: bookingCoachesData.bookedSeat,
        }));
      }
    }
  }, [
    shouldFetchData,
    bookingState.fromStationId,
    bookingState.toStationId,
    bookingState.coachType,
    bookingState.date,
    bookingState.returnDate,
    bookingCoachesData,
    setBookingState,
    tripType,
    translate,
    bookingCoachLoading,
  ]);

  const { data: countersData, isLoading: countersLoading } =
    useGetStationsQuery({}) as any;

  useEffect(() => {
    if (tripType === "One_Trip") {
      localStorage.removeItem("returnDate");
      localStorage.removeItem("tripType");
    } else if (tripType === "Round_Trip" && bookingState.returnDate) {
      localStorage.setItem("tripType", tripType);
      const formattedReturnDate = format(
        new Date(bookingState.returnDate),
        "yyyy-MM-dd"
      );
      const formattedGoingDate = format(
        new Date(bookingState.date),
        "yyyy-MM-dd"
      );
      localStorage.setItem("returnDate", formattedReturnDate);
      localStorage.setItem("goingDate", formattedGoingDate);
    }
  }, [tripType, bookingState.date, bookingState.returnDate]);

  const closeDropdowns = () => {
    setBookingState((prevState: any) => ({
      ...prevState,
      fromCounterDropdownOpen: false,
      destinationCounterDropdownOpen: false,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownFromRef.current &&
        !dropdownFromRef.current.contains(event.target as Node) &&
        dropdownToRef.current &&
        !dropdownToRef.current.contains(event.target as Node)
      ) {
        closeDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const handleDropdownToggle = (dropdown: "from" | "to") => {
  //   setBookingState((prevState: any) => ({
  //     ...prevState,
  //     fromCounterDropdownOpen:
  //       dropdown === "from" ? !prevState.fromCounterDropdownOpen : false,
  //     destinationCounterDropdownOpen:
  //       dropdown === "to" ? !prevState.destinationCounterDropdownOpen : false,
  //   }));
  // };

  const handleCounterSelect = (dropdown: "from" | "to", counterId: number) => {
    if (dropdown === "from") {
      setBookingState((prevState: any) => ({
        ...prevState,
        fromStationId: counterId,
        fromCounterDropdownOpen: false,
      }));
    } else {
      setBookingState((prevState: any) => ({
        ...prevState,
        toStationId: counterId,
        destinationCounterDropdownOpen: false,
      }));
    }
  };

  if (countersLoading) {
    return <Loader />;
  }
  return (
    <div className="flex justify-center items-center">
      <PageTransition className=" w-full ">
        <div className="">
          <div id="booking" className="rounded-lg ">
            <div className="rounded-xl px-3 py-3 bg-gradient-to-tr from-primary to-tertiary text-primary-foreground">
              <PageTransition className="flex flex-col gap-3 items-center justify-center h-full w-full">
                <RadioGroup
                  className="flex gap-4 mb-2"
                  value={tripType}
                  onValueChange={setTripType}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="One_Trip" id="r2" />
                    <Label htmlFor="r2">One Trip</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Round_Trip" id="r3" />
                    <Label htmlFor="r3">Round Trip</Label>
                  </div>
                </RadioGroup>
              </PageTransition>

              <ul className="grid grid-cols-2 gap-3 pb-1">
                {/* STARTING STATION */}
                <li>
                  <div className="relative">
                    <select
                      value={bookingState.fromStationId || ""}
                      onChange={(e) =>
                        handleCounterSelect("from", Number(e.target.value))
                      }
                      className="w-full cursor-pointer appearance-none bg-white dark:bg-background dark:text-white dark:placeholder:text-white text-sm font-medium text-gray-700 
                 px-4 py-[7px] pr-10 border border-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition duration-200 uppercase"
                    >
                      <option value="" disabled>
                        Select Starting Station
                      </option>
                      {countersData?.data
                        ?.filter(
                          (counter: Counter) =>
                            counter.id !== bookingState.toStationId &&
                            counter?.isSegment === true
                        )
                        .map((counter: Counter) => (
                          <option key={counter.id} value={counter.id}>
                            {counter.name}
                          </option>
                        ))}
                    </select>

                    {/* Custom dropdown arrow */}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      ▼
                    </span>
                  </div>
                </li>

                {/* DESTINATION STATION */}
                <li>
                  <div className="relative">
                    <select
                      value={bookingState.toStationId || ""}
                      onChange={(e) =>
                        handleCounterSelect("to", Number(e.target.value))
                      }
                      className="w-full cursor-pointer appearance-none bg-white dark:bg-background dark:text-white dark:placeholder:text-white text-sm font-medium text-gray-700 
                 px-4 py-[7px] pr-10 border border-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition duration-200 uppercase"
                    >
                      <option value="" disabled>
                        Select Destination Station
                      </option>
                      {countersData?.data
                        ?.filter(
                          (counter: Counter) =>
                            counter.id !== bookingState.fromStationId &&
                            counter?.isSegment === true
                        )
                        .map((counter: Counter) => (
                          <option key={counter.id} value={counter.id}>
                            {counter.name}
                          </option>
                        ))}
                    </select>

                    {/* Custom dropdown arrow */}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      ▼
                    </span>
                  </div>
                </li>

                {/* COACH TYPE */}
                <li>
                  <div className="relative">
                    <select
                      value={bookingState.coachType || ""}
                      onChange={(e) =>
                        setBookingState((prevState: IBookingStateProps) => ({
                          ...prevState,
                          coachType: e.target.value as "AC" | "NON AC",
                        }))
                      }
                      className="w-full cursor-pointer appearance-none bg-white dark:bg-background dark:text-white dark:placeholder:text-white text-sm font-medium text-gray-700 
                 px-4 py-[7px] pr-10 border border-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition duration-200 uppercase"
                    >
                      <option value="" disabled>
                        {translate("কোচের ধরণ", "Coach Type")}
                      </option>
                      <option value="AC">
                        {translate("শীতাতপ নিয়ন্ত্রিত", "Air Condition")}
                      </option>
                      <option value="NON AC">
                        {translate(
                          "শীতাতপ নিয়ন্ত্রিত বিহীন",
                          "Without Air Condition"
                        )}
                      </option>
                    </select>

                    {/* Custom arrow */}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      ▼
                    </span>
                  </div>
                </li>

                {/* GOING DATE */}
                <li>
                  <Popover
                    open={bookingState.calenderOpen}
                    onOpenChange={(open) =>
                      setBookingState((prevState: IBookingStateProps) => ({
                        ...prevState,
                        calenderOpen: open,
                      }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full cursor-pointer appearance-none bg-white dark:bg-background dark:text-white dark:placeholder:text-white text-sm font-medium text-gray-700 px-4 py-[7px] pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 uppercase",
                          !bookingState.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingState.date ? (
                          format(bookingState.date, "dd/MM/yyyy")
                        ) : (
                          <span>
                            {translate("বুকিংয়ের তারিখ", "Booking Date")}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end">
                      <Calendar
                        mode="single"
                        selected={bookingState?.date || new Date()}
                        onSelect={(date) => {
                          setBookingState((prevState: IBookingStateProps) => ({
                            ...prevState,
                            date: date || new Date(),
                            calenderOpen: false,
                          }));
                        }}
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        disabled={(date) => {
                          const today = new Date();
                          return (
                            date <
                            new Date(
                              today.getFullYear(),
                              today.getMonth(),
                              today.getDate()
                            )
                          );
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </li>

                {/* RETURN DATE */}
                {tripType === "Round_Trip" && (
                  <li>
                    <Popover
                      open={bookingState.returnCalenderOpen}
                      onOpenChange={(open) =>
                        setBookingState((prevState: IBookingStateProps) => ({
                          ...prevState,
                          returnCalenderOpen: open,
                        }))
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full cursor-pointer appearance-none bg-white dark:bg-background dark:text-white dark:placeholder:text-white text-sm font-medium text-gray-700 px-4 py-[7px] pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 uppercase",
                            !bookingState.returnDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingState.returnDate ? (
                            format(bookingState.returnDate, "dd/MM/yyyy")
                          ) : (
                            <span>
                              {translate("ফেরার তারিখ", "Return Date")}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end">
                        <Calendar
                          mode="single"
                          selected={bookingState?.returnDate || new Date()}
                          onSelect={(date) => {
                            setBookingState(
                              (prevState: IBookingStateProps) => ({
                                ...prevState,
                                returnDate: date || new Date(),
                                returnCalenderOpen: false,
                              })
                            );
                          }}
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          disabled={(date) => {
                            const today = new Date();
                            return (
                              date <
                              new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate()
                              )
                            );
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </li>
                )}
              </ul>
              <div className="flex justify-end gap-2 items-end mt-1">
                {/* RESET BUTTON */}
                <p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="w-full bg-gray-200 text-black hover:bg-[#830494] hover:text-white"
                          onClick={() => {
                            setBookingState(
                              (prevState: IBookingStateProps) => ({
                                ...prevState,
                                fromStationId: null,
                                toStationId: null,
                                schedule: "",
                                coachType: "",
                                date: null,
                                returnDate: null,
                                bookingCoachesList: [],
                              })
                            );
                            setSearchTriggered(false);
                          }}
                          variant="outline"
                        >
                          {translate("রিসেট", "Reset")}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{translate("রিসেট", "Reset")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </p>

                {/* SEARCH BUTTON */}
                <p className="col-span-2">
                  <Button
                    className="w-full bg-[#840495] text-white hover:bg-[#560361] hover:text-white"
                    onClick={() => {
                      if (
                        bookingState.fromStationId &&
                        bookingState.toStationId &&
                        // bookingState.coachType &&
                        // bookingState.date &&
                        (tripType === "One_Trip" || bookingState.returnDate)
                      ) {
                        setSearchTriggered(true);
                      }
                    }}
                    disabled={
                      !bookingState.fromStationId ||
                      !bookingState.toStationId ||
                      !bookingState.coachType ||
                      !bookingState.date ||
                      (tripType === "Round_Trip" && !bookingState.returnDate)
                    }
                  >
                    {translate("সার্চ করুন", "Search")}
                  </Button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default BookingAfterSearch;
