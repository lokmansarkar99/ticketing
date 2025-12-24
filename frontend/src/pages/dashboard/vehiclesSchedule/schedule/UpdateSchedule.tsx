import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import { TimePicker } from "@/components/common/form/TimePicker";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateScheduleDataProps,
  addUpdateScheduleSchema,
} from "@/schemas/vehiclesSchedule/addUpdateScheduleSchema";
import {
  useGetSingleScheduleQuery,
  useUpdateScheduleMutation,
} from "@/store/api/vehiclesSchedule/scheduleApi";
import { convertTimeStringToISO } from "@/utils/helpers/convertTimeStringToISO";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IUpdateScheduleProps {
  id: number | null;
}
const UpdateSchedule: FC<IUpdateScheduleProps> = ({ id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [date, setDate] = useState<Date | undefined>(undefined);

  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AddUpdateScheduleDataProps>({
    resolver: zodResolver(addUpdateScheduleSchema),
  });

  const { data: scheduleData, isLoading: scheduleLoading } =
    useGetSingleScheduleQuery(id);

  useEffect(() => {
    if (scheduleData?.data?.time) {
      const date = convertTimeStringToISO(scheduleData.data.time);
      if (date) {
        setDate(date);
      } else {
        console.error("Invalid time format received from backend.");
      }
    }
  }, [scheduleData]);

  useEffect(() => {
    if (date) {
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
    updateSchedule,
    { isLoading: updateScheduleLoading, error: updateScheduleError },
  ] = useUpdateScheduleMutation();

  const onSubmit = async (data: AddUpdateScheduleDataProps) => {
    const result = await updateSchedule({ data, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "সময়সূচী সম্পাদনা করার বার্তা",
          "Message for updating schedule"
        ),
        description: toastMessage("update", translate("সময়সূচী", "schedule")),
      });
    }
  };

  if (scheduleLoading || date === undefined) {
    return <FormSkeleton columns={1} inputs={1} />;
  }

  return (
    <FormWrapper
      heading={translate("সময়সূচী সম্পাদনা করুন", "Update Schedule")}
      subHeading={translate(
        "সিস্টেমে নতুন সময়সূচী সম্পাদনা করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update existing schedule to the system."
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
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </InputWrapper>
        </div>
        <Submit
          loading={updateScheduleLoading}
          errors={updateScheduleError}
          submitTitle={translate("সময়সূচী সম্পাদনা করুন", "Update Schedule")}
          errorTitle={translate(
            "সময়সূচী সম্পাদনা করতে ত্রুটি",
            "Update Schedule Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateSchedule;
