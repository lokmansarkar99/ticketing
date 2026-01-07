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
import { MdSearch } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

interface IBookingProps {
  bookingState: any;
  setBookingState: any;
  tripTypeHome: any;
  setTripTypeHome: any;
  searchTriggered:any;
  setSearchTriggered:any
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
  hasSearched: boolean;
}

const Booking: FC<IBookingProps> = ({
  bookingState,
  setBookingState,
  setTripTypeHome,
  setSearchTriggered,
  searchTriggered
}) => {
  const { translate } = useCustomTranslator();
  const [tripType, setTripType] = useState<"Round_Trip" | "One_Trip">(
    "One_Trip"
  );

  useEffect(() => {
    setTripTypeHome(tripType);
  }, [tripType]);
 
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
            hasSearched: true,
          }));
        } else {
          setBookingState((prevState: IBookingStateProps) => ({
            ...prevState,
            bookingCoachesList: bookingCoachesData.data,
            roundTripGobookingCoachesList: [],
            roundTripReturnBookingCoachesList: [],
            notFoundMessage: false,
            hasSearched: true,
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
    <div className="bg-transparent lg:bg-white dark:bg-background shadow-md lg:border rounded-md">
      <PageTransition
        className={`${
          bookingState?.hasSearched === true ? "w-full" : "w-full lg:w-[900px] p-2 lg:p-5"
        }`}
      >
        <div className="">
          <div id="booking" className="rounded-lg ">
            <div
              className={`rounded-xl p-2 lg:p-3 bg-transparent text-white ${
                bookingState?.hasSearched === true ? "flex items-center" : ""
              }`}
            >
              <PageTransition
                className={`${
                  bookingState?.hasSearched === true
                    ? "w-64"
                    : "w-full py-2 h-full mb-2 px-3 bg-gray-200 dark:bg-background"
                }`}
              >
                <RadioGroup
                  className="flex gap-4"
                  value={tripType}
                  onValueChange={(value) =>
                    setTripType(value as "One_Trip" | "Round_Trip")
                  }
                >
                  <div className="flex items-center space-x-2 text-white">
                    <RadioGroupItem
                      value="One_Trip"
                      id="r2"
                      className="text-white bg-white dark:bg-background"
                    />
                    <Label htmlFor="r2" className="cursor-pointer">
                      One Way
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Round_Trip"
                      id="r3"
                      className="text-white bg-white dark:bg-background"
                    />
                    <Label htmlFor="r3" className="cursor-pointer">
                      Round Trip
                    </Label>
                  </div>
                </RadioGroup>
              </PageTransition>

              <ul
                className={`${
                  bookingState?.hasSearched
                    ? "flex items-center gap-2"
                    : "grid grid-cols-2 gap-3 pb-1"
                }`}
              >
                {/* STARTING STATION */}
                <li>
                  <div className="relative w-full border border-gray-400">
                    <label className="absolute top-0.5 left-2 dark:bg-background px-1 text-[10px] lg:text-xs font-medium text-gray-400 dark:text-gray-300">
                      Leaving From
                    </label>

                    <select
                      value={bookingState.fromStationId || ""}
                      onChange={(e) =>
                        handleCounterSelect("from", Number(e.target.value))
                      }
                      className="w-full cursor-pointer appearance-none dark:bg-background dark:text-white text-sm font-medium text-gray-700 
        px-3 pt-3.5 pb-0.5 pr-8 border-none bg-gray-200
        focus:outline-none focus:ring-0 focus:ring-none focus:border-none
        transition duration-200"
                    >
                      <option value="" disabled>
                        From
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
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <IoIosArrowDown />
                    </span>
                  </div>
                </li>

                {/* DESTINATION STATION */}
                <li>
                  <div className="relative w-full border border-gray-400">
                    <label className="absolute top-0.5 left-2 dark:bg-background px-1 text-[10px] lg:text-xs font-medium text-gray-400 dark:text-gray-300">
                      Going To
                    </label>
                    <select
                      value={bookingState.toStationId || ""}
                      onChange={(e) =>
                        handleCounterSelect("to", Number(e.target.value))
                      }
                      className="w-full cursor-pointer appearance-none dark:bg-background dark:text-white text-sm font-medium text-gray-700 
        px-3 pt-3.5 pb-0.5 pr-8 border-none bg-gray-200
        focus:outline-none focus:ring-0 focus:ring-none focus:border-none
        transition duration-200"
                    >
                      <option value="" disabled>
                        To
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
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <IoIosArrowDown />
                    </span>
                  </div>
                </li>

                {/* GOING DATE */}
                <li className="bg-gray-200 dark:bg-background dark:text-white dark:placeholder:text-white text-sm font-medium text-gray-700  border border-gray-400 shadow-sm uppercase grid grid-cols-2 items-center">
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
                          `flex justify-start cursor-pointer rounded-none appearance-none ${tripType==="One_Trip"? "border-none":"border-t-0 border-l-0 border-b-0 border-r"} bg-gray-200 dark:bg-background text-xs lg:text-sm px-1 lg:px-3`,
                          !bookingState.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-0 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
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
                              "w-full cursor-pointer flex justify-start rounded-none appearance-none border-none bg-gray-200 dark:bg-background text-xs lg:text-sm px-1 lg:px-3",
                              !bookingState.returnDate &&
                                "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-0 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
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
                </li>

                {/* COACH TYPE */}
                <li>
                  <RadioGroup
                    className="grid grid-cols-2 gap-0"
                    value={bookingState.coachType}
                    onValueChange={(value) =>
                      setBookingState((prevState: IBookingStateProps) => ({
                        ...prevState,
                        coachType: value as "AC" | "NON AC",
                      }))
                    }
                  >
                    <div className="flex items-center space-x-1 text-white border-r border-gray-400 border bg-gray-200 dark:bg-background py-2.5 lg:py-2 pl-1.5 lg:pl-3">
                      <RadioGroupItem
                        value="AC"
                        id="r4"
                        className="text-white"
                      />
                      <Label
                        htmlFor="r4"
                        className="text-xs lg:text-sm cursor-pointer"
                      >
                        {translate("শীতাতপ নিয়ন্ত্রিত", "AC")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-background border-r border-b border-t py-2 pl-1.5 lg:px-3">
                      <RadioGroupItem
                        value="NON AC"
                        id="r5"
                        className="text-white bg-white dark:bg-background"
                      />
                      <Label
                        htmlFor="r5"
                        className="text-xs lg:text-sm cursor-pointer"
                      >
                        {" "}
                        {translate("শীতাতপ নিয়ন্ত্রিত বিহীন", "Non AC")}
                      </Label>
                    </div>
                  </RadioGroup>
                </li>

                {bookingState?.hasSearched === true && (
                  <li>
                    <div className="flex justify-end gap-2 items-end">
                      <p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="w-full h-7 text-xs lg:text-[18px] px-4 lg:px-auto lg:h-auto bg-gray-200 text-black hover:bg-[#ed1c24] hover:text-white"
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
                                      roundTripGobookingCoachesList: [],
                                      roundTripReturnBookingCoachesList: [],
                                      hasSearched: false,
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

                      <p className="col-span-2">
                        <Button
                          className="w-full h-7 px-4 lg:px-auto lg:h-[34px] text-xs lg:text-[18px] bg-[#ed1c24] text-white hover:bg-[#560361] hover:text-white"
                          onClick={() => {
                            if (
                              bookingState.fromStationId &&
                              bookingState.toStationId &&
                              (tripType === "One_Trip" ||
                                bookingState.returnDate)
                            ) {
                              setSearchTriggered(true);
                            }
                          }}
                          disabled={
                            !bookingState.fromStationId ||
                            !bookingState.toStationId ||
                            !bookingState.coachType ||
                            !bookingState.date ||
                            (tripType === "Round_Trip" &&
                              !bookingState.returnDate)
                          }
                        >
                          {translate("সার্চ করুন", "Search")}
                        </Button>
                      </p>
                    </div>
                  </li>
                )}
              </ul>

              {/* SEARCH BUTTON */}
              <div
                className={`${
                  bookingState?.hasSearched === true
                    ? "hidden"
                    : "block mt-[8px] lg:mt-[10px]"
                }`}
              >
                {/* RESET BUTTON */}
                {/* <p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="w-full h-7 text-xs lg:text-[18px] lg:h-auto px-[13px] lg:px-auto bg-gray-200 text-black hover:bg-[#830494] hover:text-white"
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
                                    hasSearched: false,
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
                    </p> */}

                {/* SEARCH BUTTON */}
                <Button
                  className="w-full rounded-none uppercase h-[34px] px-[13px] text-xs lg:text-sm lg:px-auto bg-secondary text-white hover:bg-secondary hover:text-white"
                  onClick={() => {
                    if (
                      bookingState.fromStationId &&
                      bookingState.toStationId &&
                      bookingState.coachType &&
                      bookingState.date
                    ) {
                      setSearchTriggered(true);
                    }
                  }}
                  disabled={
                    !bookingState.fromStationId ||
                    !bookingState.toStationId ||
                    !bookingState.coachType ||
                    !bookingState.date ||
                    bookingCoachLoading
                  }
                  size={"icon"}
                >
                  <MdSearch size={27} className="pt-1" />
                  {translate("সার্চ করুন", "Search")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default Booking;
