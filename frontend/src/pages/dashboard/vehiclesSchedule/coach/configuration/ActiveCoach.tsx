import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/common/typography/Label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useGetCoachesQuery } from "@/store/api/vehiclesSchedule/coachApi";
import { useAddCoachConfigurationMutation } from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import { addUpdateCoachConfigurationForm } from "@/utils/constants/form/addUpdateCoachConfigurationForm";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { eachDayOfInterval, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  activeInactiveCoachSchema,
  IAddUpdateCoachConfigurationDataProps,
} from "@/schemas/vehiclesSchedule/activeInactiveCoachSchema";

interface IActiveCoachProps {
  setActiveCoachOpen: (open: boolean) => void;
  defaultStatus?: boolean | null;
  selectedCoach?: any;
}

const ActiveCoach: FC<IActiveCoachProps> = ({ setActiveCoachOpen, defaultStatus,  selectedCoach, }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const generateDateRangeArray = (from: Date, to: Date): string[] => {
    const dates = eachDayOfInterval({ start: from, end: to });
    return dates.map((date) => format(date, "yyyy-MM-dd"));
  };

  const {
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddUpdateCoachConfigurationDataProps>({
    resolver: zodResolver(activeInactiveCoachSchema),
    defaultValues: {
      coachNo: "",
      active: true,
      departureDates: [],
    },
  });

  useEffect(() => {
  if (selectedCoach) {
    // Set coach number
    setValue("coachNo", selectedCoach.coachNo || "");

    // Set active status
    if (selectedCoach.active !== undefined) {
      setValue("active", selectedCoach.active);
    }

    // Set date (single date for today)
    if (selectedCoach.departureDate) {
      setDate({
        from: new Date(selectedCoach.departureDate),
        to: new Date(selectedCoach.departureDate),
      });
      setValue("departureDates", [
        format(new Date(selectedCoach.departureDate), "yyyy-MM-dd"),
      ]);
    }
  } else {
    // Default today
    const today = new Date();
    setDate({ from: today, to: today });
    setValue("departureDates", [format(today, "yyyy-MM-dd")]);
  }
}, [selectedCoach, setValue]);


  const { data: coachListData, isLoading: coachListDataLoading } =
    useGetCoachesQuery({}) as any;

  const [
    addCoachConfiguration,
    {
      isLoading: addCoachConfigurationLoading,
      error: addCoachConfigurationError,
    },
  ] = useAddCoachConfigurationMutation();

  // Sync dateRange with departureDates and form state
  useEffect(() => {
    if (date?.from && date.to) {
      const rangeDates = generateDateRangeArray(date.from, date.to);

      setValue("departureDates", rangeDates);
    } else if (date?.from) {
      const singleDate = [format(date.from, "yyyy-MM-dd")];

      setValue("departureDates", singleDate);
    } else {
      setValue("departureDates", []);
    }
  }, [date, setValue]);

  // Update the `onSelect` function to handle the date array
  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
  };
  

    useEffect(() => {
    if (defaultStatus !== null && defaultStatus !== undefined) {
      setValue("active", defaultStatus);
    }
  }, [defaultStatus, setValue]);

  const onSubmit = async (data: IAddUpdateCoachConfigurationDataProps) => {

    const result = await addCoachConfiguration(data);
    if (result?.data?.success) {
      toast({
        title: translate(
          "কোচ কনফিগারেইশন যোগ করার বার্তা",
          "Message for adding coach configuration"
        ),
        description: toastMessage(
          "add",
          translate("কোচ কনফিগারেইশন", "coach configuration")
        ),
      });
      setActiveCoachOpen(false);
    } 
  };

  return (
    <FormWrapper
      heading={translate("কোচ কনফিগারেইশন যোগ করুন", "Add Coach Configuration")}
      subHeading={translate(
        "সিস্টেমে কোচ কনফিগারেইশন যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new coach configuration to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 w-5/6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* COACH NUMBER */}
          <InputWrapper
            error={errors.coachNo?.message}
            labelFor="coachNo"
            label={translate(
              addUpdateCoachConfigurationForm?.coachNo.label.bn,
              addUpdateCoachConfigurationForm.coachNo.label.en
            )}
          >
            <Select
              value={watch("coachNo") || ""}
              onValueChange={(value: string) => {
                setValue("coachNo", value);
                setError("coachNo", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="coachNo" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.coachNo.placeholder.bn,
                    addUpdateCoachConfigurationForm.coachNo.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!coachListDataLoading &&
                  coachListData?.data?.length > 0 &&
                  coachListData.data.map((coach: any, index: number) => (
                    <SelectItem key={index} value={coach.coachNo?.toString()}>
                      {formatter({
                        type: "words",
                        words: coach.coachNo,
                      })}
                    </SelectItem>
                  ))}
                {coachListDataLoading && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* DEPARTURE DATE */}
          <InputWrapper
            label={translate("", "Select Date Range✼")}
            labelFor="date_range"
            error={errors.departureDates?.message}
          >
            <Popover>
              <PopoverTrigger id="date_range" asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-sm text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span className="font-normal">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  style={{ pointerEvents: "auto" }}
                  className="cursor-pointer"
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>

          {/* ACTIVE */}
          <InputWrapper
            labelFor="active"
            error={errors.active?.message}
            label={translate("", "Active")}
          >
            <RadioGroup
              className="flex flex-row items-center gap-4"
              value={watch("active")?.toString() || "true"}
              onValueChange={(value) => setValue("active", value === "true")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="active_true" />
                <Label htmlFor="active_true">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="active_false" />
                <Label htmlFor="active_false">Inactive</Label>
              </div>
            </RadioGroup>
          </InputWrapper>
        </div>

        <Submit
          loading={addCoachConfigurationLoading}
          errors={addCoachConfigurationError}
          submitTitle={translate(
            "কোচ কনফিগারেইশন যুক্ত করুন",
            "Add Coach Configuration"
          )}
          errorTitle={translate(
            "কোচ কনফিগারেইশন যোগ করতে ত্রুটি",
            "Add Coach Configuration Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default ActiveCoach;
