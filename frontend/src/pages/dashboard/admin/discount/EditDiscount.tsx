import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
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
  useUpdateDiscountMutation,
  useGetSingleDiscountQuery,
} from "@/store/api/discount/discountApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Define the schema for discount validation
const discountSchema = z.object({
  title: z.string().min(1, "Title is required"),
  discountType: z.enum(["Fixed", "Percentage"]),
  discount: z.number().min(0, "Discount must be a positive number"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

type DiscountFormData = z.infer<typeof discountSchema>;

interface IDiscountFormStateProps {
  startDate: Date | null;
  endDate: Date | null;
  calendarOpen: "start" | "end" | null;
}

interface IEditDiscountProps {
  id: number;
  setDiscountState?: React.Dispatch<React.SetStateAction<any>>;
}

const EditDiscount: FC<IEditDiscountProps> = ({ id, setDiscountState }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const [formState, setFormState] = useState<IDiscountFormStateProps>({
    startDate: null,
    endDate: null,
    calendarOpen: null,
  });

  const {
    register,
    setValue,
    setError,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
  });

  // Fetch existing discount data
  const { data: discountData, isLoading: isFetching } =
    useGetSingleDiscountQuery(id);
  const [updateDiscount, { isLoading: isUpdating, error: updateError }] =
    useUpdateDiscountMutation();

  // Set form values when data is loaded
  useEffect(() => {
    if (discountData?.data) {
      const discount = discountData.data;
      const startDate = discount.startDate
        ? parseISO(discount.startDate)
        : null;
      const endDate = discount.endDate ? parseISO(discount.endDate) : null;

      reset({
        title: discount.title,
        discountType: discount.discountType,
        discount: discount.discount,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
      });

      setFormState({
        startDate,
        endDate,
        calendarOpen: null,
      });
    }
  }, [discountData, reset]);

  const onSubmit = async (data: DiscountFormData) => {
    try {
      const formattedData = {
        ...data,
        startDate: new Date(`${data.startDate}T00:00:00`).toISOString(),
        endDate: new Date(`${data.endDate}T23:59:59`).toISOString(),
      };

      const result = await updateDiscount({
        id,
        updateData: formattedData,
      });

      if (result?.data?.success) {
        toast({
          title: translate("ডিসকাউন্ট আপডেট করা হয়েছে", "Discount Updated"),
          description: translate(
            "ডিসকাউন্ট সফলভাবে আপডেট করা হয়েছে।",
            "Discount updated successfully."
          ),
        });

        if (setDiscountState) {
          setDiscountState((prevState: any) => ({
            ...prevState,
            addDiscountOpen: false,
          }));
        }
      }
    } catch (error) {
      toast({
        title: translate("ত্রুটি", "Error"),
        description: translate(
          "ডিসকাউন্ট আপডেট করতে সমস্যা হয়েছে।",
          "There was a problem updating the discount."
        ),
      });
    }
  };

  if (isFetching) {
    return (
      <FormWrapper
        heading={translate("ডিসকাউন্ট সম্পাদনা করুন", "Edit Discount")}
        subHeading={translate(
          "ডিসকাউন্ট তথ্য লোড হচ্ছে...",
          "Loading discount data..."
        )}
        children={undefined}
      />
    );
  }

  return (
    <FormWrapper
      heading={translate("ডিসকাউন্ট সম্পাদনা করুন", "Edit Discount")}
      subHeading={translate(
        "ডিসকাউন্ট তথ্য আপডেট করতে নিচের ফর্ম পূরণ করুন।",
        "Fill out the form below to update discount information."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper>
          {/* TITLE */}
          <InputWrapper
            labelFor="title"
            label={translate("শিরোনাম", "Title")}
            error={errors?.title?.message}
          >
            <Input
              {...register("title")}
              id="title"
              type="text"
              placeholder={translate(
                "ডিসকাউন্টের শিরোনাম লিখুন",
                "Enter discount title"
              )}
            />
          </InputWrapper>

          {/* DISCOUNT TYPE */}
          <InputWrapper
            error={errors?.discountType?.message}
            labelFor="discountType"
            label={translate("ডিসকাউন্ট ধরন", "Discount Type")}
          >
            <Controller
              name="discountType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value: "Fixed" | "Percentage") => {
                    field.onChange(value);
                    setError("discountType", { type: "custom", message: "" });
                  }}
                >
                  <SelectTrigger id="discountType" className="w-full">
                    <SelectValue
                      placeholder={translate(
                        "ডিসকাউন্ট ধরন নির্বাচন করুন",
                        "Select discount type"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">
                      {translate("নির্দিষ্ট পরিমাণ", "Fixed Amount")}
                    </SelectItem>
                    <SelectItem value="Percentage">
                      {translate("শতাংশ", "Percentage")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </InputWrapper>

          {/* DISCOUNT AMOUNT */}
          <InputWrapper
            labelFor="discount"
            label={translate("ডিসকাউন্ট পরিমাণ", "Discount Amount")}
            error={errors?.discount?.message}
          >
            <Input
              {...register("discount", { valueAsNumber: true })}
              id="discount"
              type="number"
              placeholder={translate(
                "ডিসকাউন্ট পরিমাণ লিখুন",
                "Enter discount amount"
              )}
            />
          </InputWrapper>

          {/* START DATE */}
          <InputWrapper
            labelFor="startDate"
            label={translate("শুরুর তারিখ", "Start Date")}
            error={errors?.startDate?.message}
          >
            <Popover
              open={formState.calendarOpen === "start"}
              onOpenChange={(open) =>
                setFormState((prevState) => ({
                  ...prevState,
                  calendarOpen: open ? "start" : null,
                }))
              }
            >
              <PopoverTrigger id="startDate" asChild>
                <Button variant="outline" className="text-left w-full">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formState.startDate
                    ? format(formState.startDate, "PPP")
                    : translate("তারিখ নির্বাচন করুন", "Pick a date")}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  selected={formState.startDate || undefined}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = format(date, "yyyy-MM-dd");
                      setFormState((prevState) => ({
                        ...prevState,
                        startDate: date,
                        calendarOpen: null,
                      }));
                      setValue("startDate", formattedDate);
                      setError("startDate", { type: "custom", message: "" });
                    }
                  }}
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>

          {/* END DATE */}
          <InputWrapper
            labelFor="endDate"
            label={translate("শেষ তারিখ", "End Date")}
            error={errors?.endDate?.message}
          >
            <Popover
              open={formState.calendarOpen === "end"}
              onOpenChange={(open) =>
                setFormState((prevState) => ({
                  ...prevState,
                  calendarOpen: open ? "end" : null,
                }))
              }
            >
              <PopoverTrigger id="endDate" asChild>
                <Button variant="outline" className="text-left w-full">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formState.endDate
                    ? format(formState.endDate, "PPP")
                    : translate("তারিখ নির্বাচন করুন", "Pick a date")}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  selected={formState.endDate || undefined}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = format(date, "yyyy-MM-dd");
                      setFormState((prevState) => ({
                        ...prevState,
                        endDate: date,
                        calendarOpen: null,
                      }));
                      setValue("endDate", formattedDate);
                      setError("endDate", { type: "custom", message: "" });
                    }
                  }}
                  fromDate={formState.startDate || new Date()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
        </GridWrapper>

        <Submit
          submitTitle={translate("ডিসকাউন্ট আপডেট করুন", "Update Discount")}
          errorTitle={translate(
            "ডিসকাউন্ট আপডেট করতে ত্রুটি",
            "Update Discount Error"
          )}
          errors={updateError}
          loading={isUpdating}
        />
      </form>
    </FormWrapper>
  );
};

export default EditDiscount;
