import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  CancelRequestDataProps,
  cancelRequestSchema,
} from "@/schemas/cancelTicket/acceptCancelRequestSchema";
import { useAcceptCancelTicketMutation } from "@/store/api/bookingApi";
import { refundTypeOptions } from "@/utils/constants/common/refundType";
import { acceptRequestForm } from "@/utils/constants/form/acceptRequestForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, FC } from "react";
import { useForm } from "react-hook-form";

interface IAcceptProps {
  requestData: any;
}

const AcceptRequest: FC<IAcceptProps> = ({ requestData }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const { id } = requestData;
  const {
    setValue,
    setError,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CancelRequestDataProps>({
    resolver: zodResolver(cancelRequestSchema),
    defaultValues: {
      refundType: "NO_Charge",
    },
  });

  const [
    acceptRequest,
    { isLoading: acceptRequestLoading, error: acceptRequestError },
  ] = useAcceptCancelTicketMutation();

  const onSubmit = async (data: CancelRequestDataProps) => {
    const cleanData = removeFalsyProperties(data, ["cancelNote"]);

    const result = await acceptRequest({
      id,
      data: cleanData,
    }).unwrap();
    if (result?.data?.success || result?.success) {
      toast({
        title: translate(
          "অনুরোধ সফলভাবে গৃহীত হয়েছে",
          "Request Successfully Accepted"
        ),
        description: toastMessage("update", translate("অনুরোধ", "Request")),
      });
    }
  };

  return (
    <FormWrapper
      heading={translate("বাতিল অনুরোধ গৃহীত", "Accept Cancellation Request")}
      subHeading={translate(
        "নিচের বিস্তারিত পূরণ করুন বাতিল অনুরোধ গ্রহণ করার জন্য।",
        "Fill out the details below to accept the cancellation request."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper>
          {/* REFUND TYPE */}
          <InputWrapper
            labelFor="refundType"
            label={translate(
              acceptRequestForm.refundType.label.bn,
              acceptRequestForm.refundType.label.en
            )}
            error={errors?.refundType?.message}
          >
            <Select
              value={watch("refundType") || "NO_Charge"}
              onValueChange={(
                value: "NO_Charge" | "No_Cancellation" | "%_Of_Ticket_Fare"
              ) => {
                setValue("refundType", value);
                setError("refundType", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="refundType" className="w-full">
                <SelectValue
                  placeholder={translate(
                    acceptRequestForm.refundType.placeholder.bn,
                    acceptRequestForm.refundType.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {refundTypeOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {translate(option.label.bn, option.label.en)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* REFUND PERCENTAGE */}
          <InputWrapper
            labelFor="refundPercentage"
            label={translate(
              acceptRequestForm.refundPercentage.label.bn,
              acceptRequestForm.refundPercentage.label.en
            )}
            error={errors?.refundAmount?.message}
          >
            <Input
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const inputValue = +e.target.value;
                setValue("refundAmount", inputValue);
              }}
              id="refundPercentage"
              type="number"
              placeholder={translate(
                acceptRequestForm.refundPercentage.placeholder.bn,
                acceptRequestForm.refundPercentage.placeholder.en
              )}
            />
          </InputWrapper>

          {/* CANCEL NOTE */}
          <InputWrapper
            labelFor="cancelNote"
            label={translate(
              acceptRequestForm.cancelNote.label.bn,
              acceptRequestForm.cancelNote.label.en
            )}
            error={errors?.cancelNote?.message}
          >
            <Input
              {...register("cancelNote")}
              id="cancelNote"
              type="text"
              placeholder={translate(
                acceptRequestForm.cancelNote.placeholder.bn,
                acceptRequestForm.cancelNote.placeholder.en
              )}
            />
          </InputWrapper>
        </GridWrapper>

        <Submit
          loading={acceptRequestLoading}
          errors={acceptRequestError}
          submitTitle={translate("অনুরোধ গ্রহণ করুন", "Accept Request")}
          errorTitle={translate(
            "অনুরোধ গ্রহণ করতে ত্রুটি",
            "Error Accepting Request"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AcceptRequest;
