import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import {
  AddUpdateSeatDataProps,
  addUpdateSeatSchema,
} from "@/schemas/vehiclesSchedule/addUpdateSeatSchema";
import { useAddSeatMutation } from "@/store/api/vehiclesSchedule/seatApi";
import { Input } from "@/components/ui/input";
import { ISeatStateProps } from "./SeatList";

interface IAddSeatProps {
  setSeatState: (
    driverState: (prevState: ISeatStateProps) => ISeatStateProps
  ) => void;
}

const AddSeat: FC<IAddSeatProps> = ({ setSeatState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AddUpdateSeatDataProps>({
    resolver: zodResolver(addUpdateSeatSchema),
  });

  const [addSeat, { isLoading: addSeatLoading, error: addSeatError }] =
    useAddSeatMutation();

  const onSubmit = async (data: AddUpdateSeatDataProps) => {
    const result = await addSeat(data);
    if (result?.data?.success) {
      toast({
        title: translate("আসন যোগ করার বার্তা", "Message for adding seat"),
        description: toastMessage("add", translate("আসন", "seat")),
      });

      setSeatState((prevState: ISeatStateProps) => ({
        ...prevState,
        addSeatOpen: false,
      }));
    }
  };
  return (
    <FormWrapper
      heading={translate("আসন যোগ করুন", "Add Seat")}
      subHeading={translate(
        "সিস্টেমে নতুন আসন যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new seat to the system."
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
              type="text"
              id="seat"
              {...register("name")}
              placeholder={translate("আসনের নাম লিখুন", "Enter seat name")}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={addSeatLoading}
          errors={addSeatError}
          submitTitle={translate("আসন যুক্ত করুন", "Add Seat")}
          errorTitle={translate("আসন যোগ করতে ত্রুটি", "Add Seat Error")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddSeat;
