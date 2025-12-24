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
import { useGetUserListQuery } from "@/store/api/adminReport/adminReportApi";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import {
  setCounterId,
  setUserId,
} from "@/store/api/counter/counterSearchFilterSlice";
import { closeModal } from "@/store/api/user/coachConfigModalSlice";
import { Counter } from "@/types/dashboard/vehicleeSchedule.ts/counter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { format } from "date-fns";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { IDashboardBookingStateProps } from "./CallcenterTickitSearchDashboard";

interface ICallcenterRoundTripSearchModalProps {
  bookingState: any;
  setBookingState: any;
  countersData: any[];
}

const CallcenterRoundTripSearchModal: React.FC<
  ICallcenterRoundTripSearchModalProps
> = ({ bookingState, setBookingState, countersData }) => {
  const dispatch = useDispatch();
  const { translate } = useCustomTranslator();
  const [counterIdSelect, setCounterIdSelect] = useState<number | null>(null);
  const [userIdSelect, setUserIdSelect] = useState<number | null>(null);
  const { data: counterData, isLoading: counterLoading } = useGetCountersQuery({
    page: 1,
    size: 99999,
  });

  const { data: userList, isLoading: userLoading } = useGetUserListQuery({
    page: 1,
    size: 99999,
  });
  const [formState, setFormState] = useState({
    fromStationId: bookingState.fromStationId || null,
    toStationId: bookingState.toStationId || null,
    coachType: bookingState.coachType || "",
    date: bookingState.date || null,
    returnDate: bookingState.returnDate || null,
  });

  // State to manage calendar popover visibility
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [isReturnDatePopoverOpen, setIsReturnDatePopoverOpen] = useState(false);

  const handleSubmit = () => {
    if (
      !formState.fromStationId ||
      !formState.toStationId ||
      !formState.coachType ||
      !formState.date ||
      !formState.returnDate
    ) {
      toast.error(
        translate("সব ক্ষেত্র নির্বাচন করুন", "Please Select All Fields")
      );
      return;
    }

    if (counterIdSelect === null && userIdSelect === null) {
      toast.error(
        translate(
          "Please select both counter and user before searching.",
          "অনুগ্রহ করে অনুসন্ধানের আগে কাউন্টার এবং ব্যবহারকারী নির্বাচন করুন।"
        )
      );
      return;
    }

    const formattedReturnDate = format(formState.returnDate, "yyyy-MM-dd");

    setBookingState({
      ...bookingState,
      ...formState,
      returnDate: formattedReturnDate,
      orderType: "Round_Trip",
    });
    localStorage.setItem("returnDate", formattedReturnDate);
    dispatch(closeModal());
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-">Round Trip Details</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Starting Counter */}
        <div className="">
          <label className="block text-sm font-medium py-2">
            Starting Counter
          </label>
          <Select
            value={formState.fromStationId?.toString() || ""}
            onValueChange={(value: string) =>
              setFormState((prev) => ({
                ...prev,
                fromStationId: +value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Starting Counter" />
            </SelectTrigger>
            {/* Starting Counter */}
            <SelectContent>
              {countersData
                ?.filter(
                  (counter: Counter) =>
                    counter.id !== formState.toStationId &&
                    counter?.isSegment === true
                )
                ?.map((counter: any) => (
                  <SelectItem key={counter.id} value={counter.id.toString()}>
                    {counter.name}
                  </SelectItem>
                ))}
              {!countersData?.length && <SelectSkeleton />}
            </SelectContent>
          </Select>
        </div>

        {/* Ending Counter */}
        <div className="mb-">
          <label className="block text-sm font-medium py-2">
            Ending Counter
          </label>
          <Select
            value={formState.toStationId?.toString() || ""}
            onValueChange={(value: string) =>
              setFormState((prev) => ({
                ...prev,
                toStationId: +value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Ending Counter" />
            </SelectTrigger>
            {/* Ending Counter */}
            <SelectContent>
              {countersData
                ?.filter(
                  (counter: Counter) =>
                    counter.id !== formState.fromStationId &&
                    counter?.isSegment === true
                )
                ?.map((counter: any) => (
                  <SelectItem key={counter.id} value={counter.id.toString()}>
                    {counter.name}
                  </SelectItem>
                ))}
              {!countersData?.length && <SelectSkeleton />}
            </SelectContent>
          </Select>
        </div>

        {/* Coach Type */}
        <div className="mb-">
          <label className="block text-sm font-medium py-2">Coach Type</label>
          <Select
            value={formState.coachType}
            onValueChange={(value: string) =>
              setFormState((prev) => ({
                ...prev,
                coachType: value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Coach Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AC">Air Condition</SelectItem>
              <SelectItem value="NON AC">Without Air Condition</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Going Date */}
        <div className="mb-">
          <label className="block text-sm font-medium py-2">Going Date</label>
          <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button className="w-full text-left">
                {formState.date
                  ? format(new Date(formState.date), "dd/MM/yyyy")
                  : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={formState.date ? new Date(formState.date) : undefined}
                onSelect={(date) => {
                  setFormState((prev) => ({
                    ...prev,
                    date: date ? date.toISOString() : null,
                  }));
                  setIsDatePopoverOpen(false);
                }}
                fromYear={1900}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date */}
        <div className="mb-">
          <label className="block text-sm font-medium py-2">Return Date</label>
          <Popover
            open={isReturnDatePopoverOpen}
            onOpenChange={setIsReturnDatePopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button className="w-full text-left">
                {formState.returnDate
                  ? format(new Date(formState.returnDate), "dd/MM/yyyy")
                  : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={
                  formState.returnDate
                    ? new Date(formState.returnDate)
                    : undefined
                }
                onSelect={(date) => {
                  setFormState((prev) => ({
                    ...prev,
                    returnDate: date ? date.toISOString() : null,
                  }));
                  setIsReturnDatePopoverOpen(false); // Close popover on select
                }}
                disabled={(date) =>
                  formState.date && date < new Date(formState.date)
                }
                fromYear={1900}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* COUNTER SELECT */}
        <div>
          <label className="block text-sm font-medium py-2">
            Select Counter
          </label>
          <Select
            value={bookingState?.counterId?.toString() || ""}
            onValueChange={(value: string) => {
              dispatch(setCounterId(+value));
              setCounterIdSelect(+value);
              setBookingState((prevState: IDashboardBookingStateProps) => ({
                ...prevState,
                counterId: +value,
              }));
            }}
          >
            <SelectTrigger className="bg-background">
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
                  <SelectItem key={counter.id} value={counter.id.toString()}>
                    {counter.name}
                  </SelectItem>
                ))}
              {counterLoading && <SelectSkeleton />}
            </SelectContent>
          </Select>
        </div>

        {/* USER SELECT */}
        <div>
          <label className="block text-sm font-medium py-2">Select user</label>
          <Select
            value={bookingState?.userId?.toString() || ""}
            onValueChange={(value: string) => {
              dispatch(setUserId(+value));
              setUserIdSelect(+value);
              setBookingState((prevState: IDashboardBookingStateProps) => ({
                ...prevState,
                userId: +value,
              }));
            }}
          >
            <SelectTrigger className="bg-background">
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
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          onClick={() => dispatch(closeModal())}
          className="mr-4"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default CallcenterRoundTripSearchModal;
