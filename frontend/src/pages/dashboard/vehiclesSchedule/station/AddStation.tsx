import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateStationDataProps,
  addUpdateStationSchema,
} from "@/schemas/vehiclesSchedule/addUpdateStationSchema";
import { useAddStationMutation } from "@/store/api/vehiclesSchedule/stationApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IStationStateProps } from "./StationList";

interface IAddStationProps {
  setStationState: (
    driverState: (prevState: IStationStateProps) => IStationStateProps
  ) => void;
}

const AddStation: FC<IAddStationProps> = ({ setStationState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUpdateStationDataProps>({
    resolver: zodResolver(addUpdateStationSchema),
  });

  const [addStation, { isLoading: addStationLoading, error: addStationError }] =
    useAddStationMutation();

  const onSubmit = async (data: AddUpdateStationDataProps) => {
    const result = await addStation(data);
    if (result?.data?.success) {
      toast({
        title: translate(
          "স্টেশন যোগ করার বার্তা",
          "Message for adding station"
        ),
        description: toastMessage("add", translate("স্টেশন", "station")),
      });

      setStationState((prevState: IStationStateProps) => ({
        ...prevState,
        addStationOpen: false,
      }));
    }
  };
  return (
    <FormWrapper
      heading={translate("স্টেশন যোগ করুন", "Add Station")}
      subHeading={translate(
        "সিস্টেমে নতুন স্টেশন যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new station to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {/* NAME */}
          <InputWrapper
            error={errors?.name?.message}
            labelFor="name"
            label={translate("স্টেশনের নাম ✼", "Station Name ✼")}
          >
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder={translate(
                "স্টেশনের নাম লিখুন",
                "Enter station name"
              )}
            />
          </InputWrapper>
          <InputWrapper
            className="mt-3"
            error={errors?.isSegment?.message}
            labelFor="isSegment"
            label=""
          >
            <div className="flex items-center gap-2">
              <Input
                id="isSegment"
                type="checkbox"
                {...register("isSegment")}
                className="w-5 h-5 mt-2"
              />
              <label htmlFor="isSegment" className="text-sm mt-2">
                {translate("সেগমেন্ট স্টেশন?", "Is Segment Station?")}
              </label>
            </div>
          </InputWrapper>
          {/* isActive */}
          <InputWrapper
            className="mt-3"
            error={errors?.isActive?.message}
            labelFor="isActive"
            label=""
          >
            <div className="flex items-center gap-2">
              <Input
                id="isActive"
                type="checkbox"
                {...register("isActive")}
                className="w-5 h-5 mt-2"
              />{" "}
              <label htmlFor="isActive" className="text-sm mt-2">
                {translate("সেগমেন্ট স্টেশন?", "Is Active?")}
              </label>
            </div>
          </InputWrapper>
        </div>
        <Submit
          loading={addStationLoading}
          errors={addStationError}
          submitTitle={translate("স্টেশন যুক্ত করুন", "Add Station")}
          errorTitle={translate("স্টেশন যোগ করতে ত্রুটি", "Add Station Error")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddStation;
