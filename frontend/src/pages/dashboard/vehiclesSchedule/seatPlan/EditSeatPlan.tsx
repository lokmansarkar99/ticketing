import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateSeatPlanDataProps,
  addUpdateSeatPlanSchema,
} from "@/schemas/vehiclesSchedule/addUpdateSeatPlanSchema";
import {
  useGetSingleSeatPlanQuery,
  useUpdateSeatPlanMutation,
} from "@/store/api/vehiclesSchedule/seatPlanApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ISeatPlanStateProps } from "./SeatPlan";

interface IUpdateSeatPlanProps {
  setSeatPlanState: (
    seatPlanState: (prevState: ISeatPlanStateProps) => ISeatPlanStateProps
  ) => void;
  id: number | undefined;
}

const addUpdateSeatPlanForm = {
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

const UpdateSeatPlan: FC<IUpdateSeatPlanProps> = ({ setSeatPlanState, id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const {
    watch,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AddUpdateSeatPlanDataProps>({
    resolver: zodResolver(addUpdateSeatPlanSchema),
    defaultValues: {
      name: "",
      noOfSeat: 0,
    },
  });

  const [updateSeatPlan, { isLoading: updateSeatPlanLoading, error: updateSeatPlanError }] =
    useUpdateSeatPlanMutation();
  const { data: seatPlanData, isLoading: seatPlanLoading } = useGetSingleSeatPlanQuery(id);

  const onSubmit = async (data: AddUpdateSeatPlanDataProps) => {
    const result = await updateSeatPlan({ id, data });
    if (result?.data?.success) {
      toast({
        title: translate(
          "সিট প্ল্যান সম্পাদনা করার বার্তা",
          "Message for updating seat plan"
        ),
        description: toastMessage("update", translate("সিট প্ল্যান", "seat plan")),
      });

      // Update the existing seat plan in the list instead of adding new one
      setSeatPlanState((prevState: ISeatPlanStateProps) => ({
        ...prevState,
        addSeatPlanOpen: false,
        seatPlansList: prevState.seatPlansList.map((plan) =>
          plan.id === id ? { ...plan, ...result.data.data } : plan
        ),
      }));
    }
  };

  useEffect(() => {
    if (seatPlanData?.data) {
      setValue("name", seatPlanData.data.name);
      setValue("noOfSeat", seatPlanData.data.noOfSeat);
    }
  }, [seatPlanData, setValue]);

  if (seatPlanLoading) {
    return <FormSkeleton columns={2} inputs={2} />;
  }

  return (
    <FormWrapper
      heading={translate("সিট প্ল্যান সম্পাদনা করুন", "Update Seat Plan")}
      subHeading={translate(
        "সিস্টেমে সিট প্ল্যান সম্পাদনা করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update the existing seat plan in the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper columns={2}>
          {/* SEAT PLAN NAME */}
          <InputWrapper
            labelFor="name"
            error={errors?.name?.message}
            label={translate(
              addUpdateSeatPlanForm?.name.label.bn,
              addUpdateSeatPlanForm.name.label.en
            )}
          >
            <Input
              defaultValue={watch("name")}
              placeholder={translate(
                addUpdateSeatPlanForm.name.placeholder.bn,
                addUpdateSeatPlanForm.name.placeholder.en
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
              addUpdateSeatPlanForm.noOfSeat.label.bn,
              addUpdateSeatPlanForm.noOfSeat.label.en
            )}
          >
            <Input
              defaultValue={watch("noOfSeat")}
              placeholder={translate(
                addUpdateSeatPlanForm.noOfSeat.placeholder.bn,
                addUpdateSeatPlanForm.noOfSeat.placeholder.en
              )}
              type="number"
              id="noOfSeat"
              min={1}
              max={200}
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
          loading={updateSeatPlanLoading}
          errors={updateSeatPlanError}
          submitTitle={translate("সিট প্ল্যান সম্পাদনা করুন", "Update Seat Plan")}
          errorTitle={translate(
            "সিট প্ল্যান সম্পাদনা করতে ত্রুটি",
            "Update Seat Plan Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateSeatPlan;