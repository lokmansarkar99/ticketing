/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import { useGetFuelCompanyAllListQuery } from "@/store/api/superviosr/fuelCompanyApi";
import { useGetTodaysCoachConfigListQuery } from "@/store/api/superviosr/supervisorCollectionApi";
import {
  useGetSingleSupervisorExpenseQuery,
  useUpdateSupervisorExpenseMutation,
} from "@/store/api/superviosr/supervisorExpenseApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import {
  SupervisorExpenseData,
  supervisorExpenseSchema,
} from "@/schemas/supervisor/supervisorExpenseSchema";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { useGetSupervisorExpenseCategoriesQuery } from "@/store/api/superviosr/supervisorExpenseCategoryApi";
import { UploadIcon } from "lucide-react";

interface IUpdateExpenseProps {
  id: number;
  setOpen: (open: boolean) => void;
}
//@ts-ignore
//@ts-ignore
const UpdateExpense: FC<IUpdateExpenseProps> = ({ id, setOpen }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const user = useSelector((state: any) => state.user);
  const [file, setFile] = useState<File | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const { data: fuelCompanyListData, isLoading: loadingFuelCompanies } =
    useGetFuelCompanyAllListQuery({});

  const { data: coachConfigs, isLoading: coachConfigLoading } =
    useGetTodaysCoachConfigListQuery("supervisor");

  const { data: expenseData, isLoading: loadingExpenseData } =
    useGetSingleSupervisorExpenseQuery(id);

  const [updateExpense, { isLoading: updatingExpense, error: errorUpdate }] =
    useUpdateSupervisorExpenseMutation();

  const { data: expenseCategoriesData, isLoading: loadingCategories } =
    useGetSupervisorExpenseCategoriesQuery({});

  const {
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useForm<SupervisorExpenseData>({
    resolver: zodResolver(supervisorExpenseSchema),
    defaultValues: expenseData?.data,
  });

  const expenseType = watch("expenseType");
  const coachConfigId = watch("coachConfigId");
  const fuelCompanyId = watch("fuelCompanyId");
  const fuelWeight = watch("fuelWeight");
  const fuelPrice = watch("fuelPrice");

  useEffect(() => {
    if (expenseData?.data) {
      const expense = expenseData.data;
      setValue("coachConfigId", expense.coachConfigId);
      //setValue("fuelCompanyId", expense.fuelCompanyId);
      setValue("expenseCategoryId", expense.expenseCategoryId);
      setValue("routeDirection", expense.routeDirection);
      setValue("expenseType", expense.expenseType);
      //setValue("fuelWeight", expense.fuelWeight);
      // setValue("fuelPrice", expense.fuelPrice);
      setValue("amount", expense.amount);
      setValue("paidAmount", expense.paidAmount);
      setValue("file", expense.file);

      const parsedDate = parseISO(expense.date);
      setSelectedDate(parsedDate);
      setValue("date", format(parsedDate, "yyyy-MM-dd"));
      setFileUrl(expense.file);
      if (expense.expenseType === "Fuel") {
        setValue("fuelCompanyId", expense.fuelCompanyId);
        setValue("fuelWeight", expense.fuelWeight);
        setValue("fuelPrice", expense.fuelPrice);
      }
    }
  }, [expenseData, setValue]);

  useEffect(() => {
    if (expenseType === "Fuel") {
      const weight = parseFloat(fuelWeight?.toString() || "0");
      const price = parseFloat(fuelPrice?.toString() || "0");
      const totalCost = weight * price;
      setValue("amount", totalCost || 0);
    }
  }, [fuelWeight, fuelPrice, expenseType, setValue]);
  //const formValues = watch();
  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation();
  const onSubmit = async (data: SupervisorExpenseData) => {
    try {
      // Create a copy of the data to avoid modifying the original form values
      const cleanedData = { ...data };

      // Remove `expenseType` from the payload as it is not allowed by the backend
      //@ts-ignore
      delete cleanedData.expenseType;

      let updatedFileUrl = cleanedData.file;

      // File handling logic for new file upload
      if (file) {
        if (!fileUrl || file.name !== fileUrl.split("/").pop()) {
          const uploadResult = await uploadPhoto(file).unwrap();
          if (uploadResult?.data) {
            updatedFileUrl = uploadResult.data;
          }
        }
      }

      const updatedPayload = {
        ...cleanedData,
        supervisorId: user?.id,
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        file: updatedFileUrl, // Ensure updated file URL is included
      };

      // Submit the updated payload to the backend
      await updateExpense({ id, data: updatedPayload }).unwrap();

      toast({
        title: translate(
          "খরচ সফলভাবে আপডেট হয়েছে",
          "Expense updated successfully"
        ),
        description: translate(
          "আপনার খরচ সফলভাবে আপডেট হয়েছে",
          "The expense was updated successfully."
        ),
      });

      setOpen(false);
    } catch (error) {
      console.error("Error during update:", error);
      toast({
        title: translate("আপডেট করতে ত্রুটি", "Error updating expense"),
        description: translate(
          "অনুগ্রহ করে আবার চেষ্টা করুন",
          "Please try again."
        ),
      });
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      const uploadedUrl = URL.createObjectURL(uploadedFile);
      setFile(uploadedFile); // Set the new file for upload
      setFileUrl(uploadedUrl); // Update the preview URL
    }
  };
  if (
    loadingExpenseData ||
    coachConfigLoading ||
    loadingFuelCompanies ||
    loadingCategories
  ) {
    return <FormSkeleton columns={3} inputs={17} />;
  }

  return (
    <DialogContent>
      <FormWrapper
        heading={translate("খরচ আপডেট করুন", "Update Expense")}
        subHeading={translate(
          "খরচ আপডেট করতে নিচের তথ্য পূরণ করুন।",
          "Fill out the details below to update the expense."
        )}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            {/* Coach Config */}
            <InputWrapper label={translate("কোচ কনফিগ", "Coach Config")}>
              <Select
                onValueChange={(value: any) =>
                  setValue("coachConfigId", parseInt(value))
                }
                value={String(coachConfigId) || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Coach Config" />
                </SelectTrigger>
                <SelectContent>
                  {coachConfigs?.data.map((config: any) => (
                    <SelectItem key={config.id} value={String(config.id)}>
                      {config.coachNo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWrapper>

            {/* Expense Type (Disabled) */}
            <InputWrapper
              label={translate("খরচ নির্বাচন করুন", "Select Expense Type")}
            >
              <Select value={expenseType} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select Expense Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fuel">Fuel</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </InputWrapper>

            {/* Conditional Fields for Fuel */}
            {expenseType === "Fuel" && (
              <>
                <InputWrapper
                  label={translate("জ্বালানী কোম্পানি", "Fuel Company")}
                >
                  <Select
                    onValueChange={(value: any) =>
                      setValue("fuelCompanyId", parseInt(value))
                    }
                    value={String(fuelCompanyId) || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Fuel Company" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelCompanyListData?.data.map((company: any) => (
                        <SelectItem key={company.id} value={String(company.id)}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </InputWrapper>

                <InputWrapper label={translate("জ্বালানী ওজন", "Fuel Weight")}>
                  <Input
                    {...register("fuelWeight", { valueAsNumber: true })}
                    placeholder="Enter Fuel Weight"
                  />
                </InputWrapper>

                <InputWrapper label={translate("জ্বালানীর দাম", "Fuel Price")}>
                  <Input
                    {...register("fuelPrice", { valueAsNumber: true })}
                    placeholder="Enter Fuel Price"
                  />
                </InputWrapper>
              </>
            )}

            {/* Expense Category */}
            <InputWrapper
              label={translate("খরচ বিভাগ নির্বাচন করুন", "Expense Category")}
            >
              <Select
                onValueChange={(value: any) =>
                  setValue("expenseCategoryId", parseInt(value))
                }
                value={String(watch("expenseCategoryId")) || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Expense Category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategoriesData?.data.map((category: any) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWrapper>

            {/* Amount */}
            <InputWrapper label={translate("টাকার পরিমাণ", "Amount")}>
              <Input
                {...register("amount", { valueAsNumber: true })}
                placeholder="Enter Amount"
              />
            </InputWrapper>

            {/* Paid Amount */}
            <InputWrapper label={translate("পরিশোধিত", "Paid Amount")}>
              <Input
                {...register("paidAmount", { valueAsNumber: true })}
                placeholder="Enter Paid Amount"
              />
            </InputWrapper>

            {/* File Upload */}
            {/* File Upload */}
            <InputWrapper
              label={translate("ফাইল আপলোড করুন", "Upload File")}
              error={errors.file?.message}
              className="col-span-3 w-full "
            >
              <div className="flex items-center gap-4 w-full">
                <Button asChild className="w-4/12" variant="outline">
                  <label>
                    <UploadIcon />
                    <input type="file" hidden onChange={handleFileChange} />
                  </label>
                </Button>
                {fileUrl && (
                  <div className="flex-shrink-0 w-6/12">
                    {fileUrl.endsWith(".png") ||
                    fileUrl.endsWith(".jpg") ||
                    fileUrl.endsWith(".jpeg") ? (
                      <img
                        src={fileUrl}
                        alt="Preview"
                        className="h-24 w-48 object-cover border rounded"
                      />
                    ) : (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View File
                      </a>
                    )}
                  </div>
                )}
              </div>
            </InputWrapper>
          </div>

          <Submit
            loading={uploadPhotoLoading || updatingExpense}
            submitTitle={translate("আপডেট করুন", "Update")}
            errors={errorUpdate}
            errorTitle={translate("যোগ করতে ত্রুটি", "Add Expense Error")}
          />
        </form>
      </FormWrapper>
    </DialogContent>
  );
};

export default UpdateExpense;
