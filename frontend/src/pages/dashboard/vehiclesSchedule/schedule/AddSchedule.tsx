import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import { TimePicker } from "@/components/common/form/TimePicker";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateScheduleDataProps,
  addUpdateScheduleSchema,
} from "@/schemas/vehiclesSchedule/addUpdateScheduleSchema";
import { useAddScheduleMutation } from "@/store/api/vehiclesSchedule/scheduleApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IScheduleStateProps } from "./ScheduleList";

interface IAddScheduleProps {
  setScheduleState: (
    driverState: (prevState: IScheduleStateProps) => IScheduleStateProps
  ) => void;
}

const AddSchedule: FC<IAddScheduleProps> = ({ setScheduleState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AddUpdateScheduleDataProps>({
    resolver: zodResolver(addUpdateScheduleSchema),
  });

  useEffect(() => {
    if (date) {
      // Format the time to exclude seconds
      setValue(
        "time",
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      setError("time", { type: "custom", message: "" });
    } else {
      setError("time", { type: "custom", message: "Time is required" });
    }
  }, [date, setValue, setError]);

  const [
    addSchedule,
    { isLoading: addScheduleLoading, error: addScheduleError },
  ] = useAddScheduleMutation();

  const onSubmit = async (data: AddUpdateScheduleDataProps) => {
    const result = await addSchedule(data);
    if (result?.data?.success) {
      toast({
        title: translate(
          "সময়সূচী যোগ করার বার্তা",
          "Message for adding schedule"
        ),
        description: toastMessage("add", translate("সময়সূচী", "schedule")),
      });

      setScheduleState((prevState: IScheduleStateProps) => ({
        ...prevState,
        addScheduleOpen: false,
      }));
    }
  };
  return (
    <FormWrapper
      heading={translate("সময়সূচী যোগ করুন", "Add Schedule")}
      subHeading={translate(
        "সিস্টেমে নতুন সময়সূচী যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new schedule to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {/* TIME */}
          <InputWrapper
            error={errors?.time?.message}
            labelFor="time"
            label={translate("সময়সূচী ✼", "Schedule ✼")}
          >
            <TimePicker date={date} setDate={setDate} />
            <div className="mt-3">
              {translate("নির্বাচিত সময়সূচীঃ ", " Selected Time: ")}
              {
                //@ts-ignore
                date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            </div>
          </InputWrapper>
        </div>
        <Submit
          loading={addScheduleLoading}
          errors={addScheduleError}
          submitTitle={translate("সময়সূচী যুক্ত করুন", "Add Schedule")}
          errorTitle={translate(
            "সময়সূচী যোগ করতে ত্রুটি",
            "Add Schedule Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddSchedule;
