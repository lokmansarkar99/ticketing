import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, FC } from "react";
import { useForm } from "react-hook-form";
import { useAddSeatPlanMutation } from "@/store/api/vehiclesSchedule/seatPlanApi";
import {
  AddUpdateSeatPlanDataProps,
  addUpdateSeatPlanSchema,
} from "@/schemas/vehiclesSchedule/addUpdateSeatPlanSchema";
import { ISeatPlanStateProps } from "./SeatPlan";

interface ICreateSeatPlanData {
  name: string;
  noOfSeat: number;
}

interface ICreateSeatPlanProps {
  setSeatPlanState: (
    driverState: (prevState: ISeatPlanStateProps) => ISeatPlanStateProps
  ) => void;
}

const createSeatPlanForm = {
  name: {
    label: {
      bn: "সিট প্ল্যানের নাম",
      en: "Seat Plan Name",
    },
    placeholder: {
      bn: "সিট প্ল্যানের নাম লিখুন",
      en: "Enter seat plan name",
    },
  },
  noOfSeat: {
    label: {
      bn: "সিটের সংখ্যা",
      en: "Number of Seats",
    },
    placeholder: {
      bn: "সিটের সংখ্যা লিখুন",
      en: "Enter number of seats",
    },
  },
};

const CreateSeatPlan: FC<ICreateSeatPlanProps> = ({ setSeatPlanState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const {
    watch,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ICreateSeatPlanData>({
    resolver: zodResolver(addUpdateSeatPlanSchema),
    defaultValues: {
      name: "",
      noOfSeat: 0,
    },
  });

  const [
    addSeatPlan,
    { isLoading: addSeatPlanLoading, error: addSeatPlanError },
  ] = useAddSeatPlanMutation();

  const onSubmit = async (data: AddUpdateSeatPlanDataProps) => {
    const result = await addSeatPlan(data);
    if (result?.data?.success) {
      toast({
        title: translate(
          "সিট প্ল্যান যোগ করার বার্তা",
          "Message for adding seat plan"
        ),
        description: toastMessage("add", translate("সিট প্ল্যান", "seat plan")),
      });

      setSeatPlanState((prevState: ISeatPlanStateProps) => ({
        ...prevState,
        addSeatPlanOpen: false,
        seatPlansList: [...prevState.seatPlansList, result.data],
      }));
    }
  };

  return (
    <FormWrapper
      heading={translate("সিট প্ল্যান যোগ করুন", "Add Seat Plan")}
      subHeading={translate(
        "সিস্টেমে নতুন সিট প্ল্যান যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new seat plan to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper columns={2}>
          {/* SEAT PLAN NAME */}
          <InputWrapper
            labelFor="name"
            error={errors?.name?.message}
            label={translate(
              createSeatPlanForm?.name.label.bn,
              createSeatPlanForm.name.label.en
            )}
          >
            <Input
              placeholder={translate(
                createSeatPlanForm.name.placeholder.bn,
                createSeatPlanForm.name.placeholder.en
              )}
              type="text"
              id="name"
              value={watch("name") || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const input = e.target.value;

                setValue("name", input);
                if (input) {
                  setError("name", { type: "custom", message: "" });
                } else {
                  setError("name", {
                    type: "custom",
                    message: "Seat plan name is required",
                  });
                }
              }}
            />
          </InputWrapper>

          {/* NUMBER OF SEATS */}
          <InputWrapper
            error={errors?.noOfSeat?.message}
            labelFor="noOfSeat"
            label={translate(
              createSeatPlanForm.noOfSeat.label.bn,
              createSeatPlanForm.noOfSeat.label.en
            )}
          >
            <Input
              placeholder={translate(
                createSeatPlanForm.noOfSeat.placeholder.bn,
                createSeatPlanForm.noOfSeat.placeholder.en
              )}
              type="number"
              id="noOfSeat"
              min={1}
              value={watch("noOfSeat") || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const input = +e.target.value;

                setValue("noOfSeat", input);
                if (input >= 1) {
                  setError("noOfSeat", {
                    type: "custom",
                    message: "",
                  });
                } else {
                  setError("noOfSeat", {
                    type: "custom",
                    message: "Number of seats must be at least 1",
                  });
                }
              }}
            />
          </InputWrapper>
        </GridWrapper>

        <Submit
          loading={addSeatPlanLoading}
          errors={addSeatPlanError}
          submitTitle={translate("সিট প্ল্যান যুক্ত করুন", "Add Seat Plan")}
          errorTitle={translate(
            "সিট প্ল্যান যোগ করতে ত্রুটি",
            "Add Seat Plan Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default CreateSeatPlan;
