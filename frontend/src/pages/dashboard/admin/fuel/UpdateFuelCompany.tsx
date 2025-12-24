import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  AddFuelCompanyData,
  addFuelCompanySchema,
} from "@/schemas/supervisor/addFuelCompanySchema";
import {
  useGetSingleFuelCompanyQuery,
  useUpdateFuelCompanyMutation,
} from "@/store/api/superviosr/fuelCompanyApi";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IUpdateFuelCompanyProps {
  id: number | null;
  setOpen: (open: boolean) => void;
}

const UpdateFuelCompany: FC<IUpdateFuelCompanyProps> = ({ id, setOpen }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();

  const { data: fuelCompanyData, isLoading: fuelCompanyLoading } =
    useGetSingleFuelCompanyQuery(id);
  const [updateFuelCompany, { isLoading: updateLoading, error: updateError }] =
    useUpdateFuelCompanyMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddFuelCompanyData>({
    resolver: zodResolver(addFuelCompanySchema),
  });

  const [isDataReady, setIsDataReady] = useState(false); // Control when the form renders

  useEffect(() => {
    if (fuelCompanyData?.data) {
      setValue("name", fuelCompanyData.data.name);
      setValue("address", fuelCompanyData.data.address);
      setValue("phone", fuelCompanyData.data.phone);
      setValue("email", fuelCompanyData.data.email || "");
      setValue("website", fuelCompanyData.data.website || "");
      setIsDataReady(true); // Mark the data as ready
    }
  }, [fuelCompanyData, setValue]);

  const onSubmit = async (data: AddFuelCompanyData) => {
    const cleanedData = removeFalsyProperties(data, ["website", "email"]);
    const result = await updateFuelCompany({ id, data: cleanedData });

    if (result?.data?.success) {
      toast({
        title: translate(
          "ফুয়েল কোম্পানি সফলভাবে সম্পাদনা করা হয়েছে",
          "Fuel Company Updated"
        ),
      });
      setOpen(false); // Close dialog on success
    }
  };

  if (fuelCompanyLoading || !isDataReady) {
    return <FormSkeleton columns={3} inputs={17} />;
  }

  return (
    <DialogContent>
      <DialogTitle>
        {translate("ফুয়েল কোম্পানি সম্পাদনা করুন", "Update Fuel Company")}
      </DialogTitle>

      <FormWrapper
        heading={translate(
          "ফুয়েল কোম্পানি সম্পাদনা করুন",
          "Update Fuel Company"
        )}
        subHeading={translate(
          "নির্বাচিত ফুয়েল কোম্পানির জন্য নিচের বিবরণ সম্পাদনা করুন।",
          "Update the details below for the selected fuel company."
        )}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <InputWrapper
              label={translate("নাম", "Name")}
              labelFor="name"
              error={errors.name?.message}
            >
              <Input
                {...register("name")}
                defaultValue={fuelCompanyData?.name}
                placeholder={translate(
                  "কোম্পানির নাম লিখুন",
                  "Enter company name"
                )}
                className="text-left rtl:text-right" // Aligns text based on language
              />
            </InputWrapper>

            <InputWrapper
              label={translate("Address", "ঠিকানা")}
              labelFor="address"
              error={errors.address?.message}
            >
              <Input
                {...register("address")}
                defaultValue={fuelCompanyData?.address}
                placeholder={translate("ঠিকানা লিখুন", "Enter address")}
                className="text-left rtl:text-right"
              />
            </InputWrapper>

            <InputWrapper
              label={translate("Phone", "ফোন")}
              labelFor="phone"
              error={errors.phone?.message}
            >
              <Input
                {...register("phone")}
                defaultValue={fuelCompanyData?.phone}
                placeholder={translate("ফোন নম্বর লিখুন", "Enter phone number")}
                className="text-left rtl:text-right"
              />
            </InputWrapper>

            <InputWrapper
              label={translate("ইমেল", "Email")}
              labelFor="email"
              error={errors.email?.message}
            >
              <Input
                {...register("email")}
                defaultValue={fuelCompanyData?.email}
                placeholder={translate(
                  "ইমেল লিখুন (ঐচ্ছিক)",
                  "Enter email (optional)"
                )}
                className="text-left rtl:text-right"
              />
            </InputWrapper>

            <InputWrapper
              label={translate("ওয়েবসাইট", "Website")}
              labelFor="website"
              error={errors.website?.message}
            >
              <Input
                {...register("website")}
                defaultValue={fuelCompanyData?.website}
                placeholder={translate(
                  "ওয়েবসাইট লিখুন (ঐচ্ছিক)",
                  "Enter website (optional)"
                )}
                className="text-left rtl:text-right"
              />
            </InputWrapper>
          </div>

          <Submit
            errorTitle="Update Fuel Company Failed"
            errors={updateError}
            loading={updateLoading}
            submitTitle={translate(
              "ফুয়েল কোম্পানি সম্পাদনা করুন",
              "Update Fuel Company"
            )}
          />
        </form>
      </FormWrapper>
    </DialogContent>
  );
};

export default UpdateFuelCompany;
