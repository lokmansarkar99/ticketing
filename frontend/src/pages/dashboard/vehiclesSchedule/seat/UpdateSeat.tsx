import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateSeatDataProps,
  addUpdateSeatSchema,
} from "@/schemas/vehiclesSchedule/addUpdateSeatSchema";
import {
  useGetSingleSeatQuery,
  useUpdateSeatMutation,
} from "@/store/api/vehiclesSchedule/seatApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ISeatStateProps } from "./SeatList";

interface IUpdateSeatProps {
  id: number | boolean;
  setSeatState: (
    driverState: (prevState: ISeatStateProps) => ISeatStateProps
  ) => void;
}

const UpdateSeat: FC<IUpdateSeatProps> = ({ id, setSeatState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddUpdateSeatDataProps>({
    resolver: zodResolver(addUpdateSeatSchema),
  });

  const [updateSeat, { isLoading: updateSeatLoading, error: updateSeatError }] =
    useUpdateSeatMutation();

  const { data: seatDate, isLoading: seatLoading } = useGetSingleSeatQuery(id);

  const onSubmit = async (data: AddUpdateSeatDataProps) => {
    const result = await updateSeat({ data, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "আসন সম্পাদনা করার বার্তা",
          "Message for updating seat"
        ),
        description: toastMessage("update", translate("আসন", "seat")),
      });

      setSeatState((prevState: ISeatStateProps) => ({
        ...prevState,
        addSeatOpen: false,
      }));
    }
  };

  useEffect(() => {
    setValue("name", seatDate?.data?.name);
  }, [seatDate, setValue]);

  if (seatLoading) {
    return <FormSkeleton columns={1} inputs={1} />;
  }

  return (
    <FormWrapper
      heading={translate("আসন সম্পাদনা করুন", "Update Seat")}
      subHeading={translate(
        "সিস্টেমে আসন সম্পাদনা করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update the existing seat to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {/* SEAT NAME */}
          <InputWrapper
            error={errors?.name?.message}
            labelFor="time"
            label={translate("আসনের নাম ✼", "Seat Nama ✼")}
          >
            <Input
              defaultValue={watch("name")}
              type="text"
              id="seat"
              {...register("name")}
              placeholder={translate("আসনের নাম লিখুন", "Enter seat name")}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={updateSeatLoading}
          errors={updateSeatError}
          submitTitle={translate("আসন সম্পাদনা করুন", "Update Seat")}
          errorTitle={translate(
            "আসন সম্পাদনা করতে ত্রুটি",
            "Update Seat Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateSeat;
