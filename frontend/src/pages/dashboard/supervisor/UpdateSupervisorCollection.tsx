import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/components/ui/use-toast";
import { addUpdateCollectionSchema } from "@/schemas/addUpdateCollectionSchema";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import { useUpdateCollectionSupervisorMutation } from "@/store/api/superviosr/supervisorCollectionApi";
import { useGetCoachConfigurationsQuery } from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
interface IAddSupervisorCollectionProps {
  setCollectionState: (state: (prevState: any) => any) => void;
  collectionData?: any; // Pass existing collection data for updates
}

const UpdateSupervisorCollection: FC<IAddSupervisorCollectionProps> = ({
  setCollectionState,
  collectionData,
}) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const user = useSelector((state: any) => state.user); // Fetching user from Redux
  const [collectionDate, setCollectionDate] = useState<Date | null>(
    collectionData?.date ? new Date(collectionData.date) : null
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [updateCollectionSupervisor, { isLoading, error }] =
    useUpdateCollectionSupervisorMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(addUpdateCollectionSchema),
  });

  const { data: coachConfigs, isLoading: coachConfigLoading } =
    useGetCoachConfigurationsQuery({});
  const { data: counters, isLoading: counterLoading } = useGetCountersQuery({
    size: 1000,
    page: 1,
  });

  // Populate form with default values when the modal opens
  useEffect(() => {
    if (collectionData?.id) {
      setValue("supervisorId", collectionData.supervisorId);
      setValue("coachConfigId", collectionData.coachConfigId);
      setValue("counterId", collectionData.counterId);
      setValue("collectionType", collectionData.collectionType);
      setValue("routeDirection", collectionData.routeDirection);
      setValue("noOfPassenger", collectionData.noOfPassenger);
      setValue("amount", collectionData.amount);
      setValue("token", collectionData.token);
      setValue("date", collectionData.date);
      if (collectionData?.date) {
        setCollectionDate(new Date(collectionData.date));
      }
    }
  }, [collectionData, setValue]);

  const onSubmit = async (data: any) => {
    const cleanData = {
      ...data,
      supervisorId: user.id,
      date: new Date(data.date),
    };
    try {
      const result = await updateCollectionSupervisor({
        data: cleanData,
        id: collectionData.id,
      });

      if (result?.data?.success) {
        toast({
          title: translate(
            "সংগ্রহ আপডেট করা হয়েছে",
            "Collection Update Successfully"
          ),
          description: toastMessage(
            "update",
            translate("সংগ্রহ", "Collection")
          ),
        });
        playSound("add");

        setCollectionState((prevState: any) => ({
          ...prevState,
          addCollectionOpen: false,
        }));
      }
    } catch (err) {
      console.error("Error submitting data:", err);
      toast({
        title: translate(
          "সংগ্রহ আপডেট করতে ব্যর্থ",
          "Failed to Update Collection"
        ),
        description: "An unexpected error occurred.",
      });
    }
  };

  if (counterLoading || coachConfigLoading) {
    return <FormSkeleton />;
  }

  return (
    <FormWrapper
      heading={translate("হাল নাগাদ করুন", "Update Collection")}
      subHeading={translate(
        "হাল নাগাদ করতে নিচের তথ্য পূরণ করুন।",
        "Fill in the details below to update collection."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {/* Coach Config */}
          <InputWrapper
            labelFor="coachConfigId"
            label={translate("কোচ কনফিগ", "Coach Config")}
          >
            <Select
              defaultValue={collectionData?.coachConfigId?.toString()}
              onValueChange={(value: string) =>
                setValue("coachConfigId", parseInt(value))
              }
            >
              <SelectTrigger id="coachConfigId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    "কোচ কনফিগ নির্বাচন করুন",
                    "Select Coach Config"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!coachConfigLoading &&
                  coachConfigs?.data?.map((config: any) => (
                    <SelectItem key={config.id} value={config.id.toString()}>
                      {config.coachNo}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Counter */}
          <InputWrapper
            labelFor="counterId"
            label={translate("কাউন্টার", "Counter")}
          >
            <Select
              defaultValue={collectionData?.counterId?.toString()}
              onValueChange={(value: string) =>
                setValue("counterId", parseInt(value))
              }
            >
              <SelectTrigger id="counterId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    "কাউন্টার নির্বাচন করুন",
                    "Select Counter"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!counterLoading &&
                  counters?.data?.map((counter: any) => (
                    <SelectItem key={counter.id} value={counter.id.toString()}>
                      {counter.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Collection Type */}
          <InputWrapper
            labelFor="collectionType"
            label={translate("সংগ্রহের ধরন", "Collection Type")}
          >
            <Select
              defaultValue={collectionData?.collectionType}
              onValueChange={(value: string) =>
                setValue("collectionType", value)
              }
            >
              <SelectTrigger id="collectionType" className="w-full">
                <SelectValue
                  placeholder={translate(
                    "সংগ্রহের ধরন নির্বাচন করুন",
                    "Select Collection Type"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CounterCollection">
                  {translate("কাউন্টার সংগ্রহ", "Counter Collection")}
                </SelectItem>
                <SelectItem value="OthersIncome">
                  {translate("অন্যান্য সংগ্রহ", "Others Collection")}
                </SelectItem>
                <SelectItem value="OpeningBalance">
                  {translate("প্রারম্ভিক ব্যালেন্স", "Opening Balance")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Route Direction */}
          <InputWrapper
            labelFor="routeDirection"
            label={translate("রুটের দিক", "Route Direction")}
          >
            <Select
              defaultValue={collectionData?.routeDirection}
              onValueChange={(value: string) =>
                setValue("routeDirection", value)
              }
            >
              <SelectTrigger id="routeDirection" className="w-full">
                <SelectValue
                  placeholder={translate(
                    "রুটের দিক নির্বাচন করুন",
                    "Select Route Direction"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Up_Way">
                  {translate("উপায়", "Up Way")}
                </SelectItem>
                <SelectItem value="Down_Way">
                  {translate("ডাউন ওয়ে", "Down Way")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Number of Passengers */}
          <InputWrapper
            labelFor="noOfPassenger"
            label={translate("যাত্রীর সংখ্যা", "Number of Passengers")}
          >
            <Input
              {...register("noOfPassenger")}
              type="number"
              placeholder={translate(
                "যাত্রীর সংখ্যা লিখুন",
                "Enter Number of Passengers"
              )}
            />
          </InputWrapper>

          {/* Amount */}
          <InputWrapper labelFor="amount" label={translate("পরিমাণ", "Amount")}>
            <Input
              {...register("amount")}
              type="number"
              placeholder={translate("পরিমাণ লিখুন", "Enter Amount")}
            />
          </InputWrapper>
          {/* Token */}
          <InputWrapper
            labelFor="token"
            //@ts-ignore
            error={errors.token?.message}
            label={translate("টোকেন", "Token")}
          >
            <Input
              {...register("token", { valueAsNumber: true })}
              type="number"
              placeholder={translate("টোকেন লিখুন", "Enter Token")}
            />
          </InputWrapper>
          {/* Date */}
          <div className="w-full px-4">
            <div className="mt-5">
              {/* Calendar Input */}
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`justify-start text-left font-normal w-[240.16px] text-muted-foreground hover:bg-background text-sm h-9 ${
                      !collectionDate ? "text-muted-foreground" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {collectionDate ? (
                      format(collectionDate, "PPP")
                    ) : (
                      <span>Select Collection Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end">
                  <Calendar
                    mode="single"
                    selected={collectionDate || new Date()}
                    onSelect={(date) => {
                      setCollectionDate(date || new Date());
                      setCalendarOpen(false);
                    }}
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <Submit
          loading={isLoading}
          errors={error}
          submitTitle={translate("হাল নাগাদ করুন", "Update Collection")}
          errorTitle={translate(
            "হাল নাগাদ করতে ব্যর্থ",
            "Failed to Update Collection"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateSupervisorCollection;
