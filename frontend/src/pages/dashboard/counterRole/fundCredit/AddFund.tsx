/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
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
import {
  PaymentDataProps,
  paymentSchema,
} from "@/schemas/counter/addEditFundSchema";
import { useAddFundMutation } from "@/store/api/counter/fundApi";

import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

interface IAddFund {
  calenderOpen: boolean;
  date: Date | null;
}
interface IAddFundProps {
  setFundOpen: (fundOpen: boolean) => void;
}

const toLocalISODate = (date: Date) => {
  // Reset to local midnight
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return local.toISOString();
};

const AddFund: FC<IAddFundProps> = ({ setFundOpen }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const [addFundPrepaid, setAddFundPrepaid] = useState<IAddFund>({
    calenderOpen: false,
    date: new Date(),
  });

  const [addFund, { isLoading, error: isFundCreateError }] =
    useAddFundMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<PaymentDataProps>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
    date: toLocalISODate(new Date()), 
  },
  });

  const onSubmit = async (data: PaymentDataProps) => {
    try {
      // remove confirm fields before sending
      const { confirmAmount, confirmTxId, ...payload } = data;

      const result = await addFund(payload).unwrap();
      if (result?.success) {
        toast({
          title: translate(
            "ফান্ড সফলভাবে যোগ হয়েছে",
            "Fund added successfully"
          ),
        });

        setFundOpen(false);
      }
    } catch (error: any) {
      toast({
        title: translate("ত্রুটি ঘটেছে", "Error occurred"),
        description: translate(
          "একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।",
          error?.data?.message
        ),
      });
    }
  };

  return (
    <FormWrapper
      heading={translate("তহবিল যোগ করুন", "Add Fund")}
      subHeading={translate(
        "নতুন তহবিল যোগ করতে নিচের তথ্য পূরণ করুন।",
        "Fill in the details below to add a new fund."
      )}
    >
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {/* Payment Type */}
          <InputWrapper
            error={errors?.paymentType?.message}
            label={
              <>
                {translate("পেমেন্ট প্রকার", "Payment Type")}{" "}
                <span className="text-red-600 font-semibold">✼</span>
              </>
            }
          >
            <Select
              onValueChange={(value: string) =>
                setValue(
                  "paymentType",
                  value as "NAGAD" | "CHEQUE" | "CASH" | "BKASH"
                )
              }
              value={watch("paymentType") || ""}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={translate(
                    "পেমেন্ট প্রকার নির্বাচন করুন",
                    "Select Payment Type"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={"NAGAD"} value={"NAGAD"}>
                  {translate("নগদ", "Nagad")}
                </SelectItem>
                <SelectItem key={"CHEQUE"} value={"CHEQUE"}>
                  {translate("চেক", "Cheque")}
                </SelectItem>
                <SelectItem key={"CASH"} value={"CASH"}>
                  {translate("ক্যাশ", "Cash")}
                </SelectItem>
                <SelectItem key={"BKASH"} value={"BKASH"}>
                  {translate("বিকাশ", "bKash")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Amount */}
          <InputWrapper
            error={errors.amount?.message}
            label={
              <>
                {translate("পরিমাণ", "Amount")}{" "}
                <span className="text-red-600 font-semibold">✼</span>
              </>
            }
          >
            <Input
              type="number"
              {...register("amount", { valueAsNumber: true })}
              placeholder={translate("পরিমাণ", "Amount")}
            />
          </InputWrapper>

          {/* Confirm Amount */}
          <InputWrapper
            error={errors.confirmAmount?.message}
            label={
              <>
                {translate("পরিমাণ নিশ্চিত করুন", "Confirm Amount")}{" "}
                <span className="text-red-600 font-semibold">✼</span>
              </>
            }
          >
            <Input
              type="number"
              {...register("confirmAmount", { valueAsNumber: true })}
              placeholder={translate("পরিমাণ নিশ্চিত করুন", "Confirm Amount")}
            />
          </InputWrapper>

          {/* Transaction ID */}
          <InputWrapper
            error={errors.txId?.message}
            label={
              <>
                {translate("লেনদেন আইডি", "Transaction ID")}{" "}
                <span className="text-red-600 font-semibold">✼</span>
              </>
            }
          >
            <Input
              {...register("txId")}
              placeholder={translate("লেনদেন আইডি", "Transaction ID")}
            />
          </InputWrapper>

          {/* Confirm Transaction ID */}
          <InputWrapper
            error={errors.confirmTxId?.message}
            label={
              <>
                {translate(
                  "লেনদেন আইডি নিশ্চিত করুন",
                  "Confirm Transaction ID"
                )}{" "}
                <span className="text-red-600 font-semibold">✼</span>
              </>
            }
          >
            <Input
              {...register("confirmTxId")}
              placeholder={translate(
                "লেনদেন আইডি নিশ্চিত করুন",
                "Confirm Transaction ID"
              )}
            />
          </InputWrapper>

          {/* Payment Date */}
         
          <InputWrapper
            labelFor="showDiscountFromDate"
            label={translate("পেমেন্ট তারিখ", "Payment Date")}
            error={errors.date?.message}
          >
            <Popover
              open={addFundPrepaid.calenderOpen}
              onOpenChange={(open) =>
                setAddFundPrepaid((prevState) => ({
                  ...prevState,
                  calenderOpen: open,
                }))
              }
            >
              <PopoverTrigger id="discountFromDate" asChild>
                <Button variant="outline" className="text-left text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {addFundPrepaid.date
                    ? format(addFundPrepaid.date, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  captionLayout="dropdown-buttons"
                  style={{ pointerEvents: "auto" }}
                  mode="single"
                  selected={addFundPrepaid.date || new Date()} // default today
                  onSelect={(date) => {
                    if (date) {
                      const isoDate = toLocalISODate(date); // <-- use helper
                      setAddFundPrepaid((prevState) => ({
                        ...prevState,
                        date: date,
                        calenderOpen: false,
                      }));
                      setValue("date", isoDate);
                      setError("date", {
                        type: "custom",
                        message: "",
                      });
                    }
                  }}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
        </div>
        <Submit
          loading={isLoading}
          errors={isFundCreateError}
          submitTitle={translate("যুক্ত করুন", "Add Fund")}
          errorTitle={translate("যোগ করতে ত্রুটি", "Error Adding Fund")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddFund;
