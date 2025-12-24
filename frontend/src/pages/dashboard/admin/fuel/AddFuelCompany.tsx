import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  AddFuelCompanyData,
  addFuelCompanySchema,
} from "@/schemas/supervisor/addFuelCompanySchema";
import { useAddFuelCompanyMutation } from "@/store/api/superviosr/fuelCompanyApi";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface IAddFuelCompanyProps {
  setOpen: (open: boolean) => void;
}

const AddFuelCompany: FC<IAddFuelCompanyProps> = ({ setOpen }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator(); // Using translator for i18n
  const [addFuelCompany, { isLoading, error: submiterror }] =
    useAddFuelCompanyMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddFuelCompanyData>({
    resolver: zodResolver(addFuelCompanySchema),
  });

  const onSubmit = async (data: AddFuelCompanyData) => {
    try {
      const cleanedData = removeFalsyProperties(data, ["website", "email"]);
      const result = await addFuelCompany(cleanedData).unwrap(); // Unwraps the promise to handle errors properly

      if (result?.success) {
        toast({
          title: translate(
            "ফুয়েল কোম্পানি সফলভাবে যোগ করা হয়েছে", // Bengali first
            "Fuel Company Added" // English second
          ),
        });

        setOpen(false); // Close the dialog after success
      }
    } catch (error) {
      console.error("Error adding fuel company:", error);
      toast({
        title: translate(
          "ত্রুটি ঘটেছে", // Bengali first
          "An error occurred" // English second
        ),
        description: translate(
          "ফুয়েল কোম্পানি যোগ করা যায়নি।", // Bengali first
          "Failed to add fuel company." // English second
        ),
      });
    }
  };

  return (
    <FormWrapper
      heading={translate(
        "ফুয়েল কোম্পানি যোগ করুন", // Bengali first
        "Add Fuel Company" // English second
      )}
      subHeading={translate(
        "নতুন ফুয়েল কোম্পানি যোগ করতে নিচের তথ্য পূরণ করুন।", // Bengali first
        "Fill in the details below to add a new fuel company." // English second
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          {/* Name Field */}
          <InputWrapper
            label={translate("নাম ✼", "Name ✼")}
            labelFor="name"
            error={errors.name?.message}
          >
            <Input
              {...register("name")}
              placeholder={translate(
                "কোম্পানির নাম লিখুন", // Bengali first
                "Enter company name" // English second
              )}
            />
          </InputWrapper>

          {/* Address Field */}
          <InputWrapper
            label={translate("ঠিকানা ✼", "Address ✼")}
            labelFor="address"
            error={errors.address?.message}
          >
            <Input
              {...register("address")}
              placeholder={translate(
                "ঠিকানা লিখুন", // Bengali first
                "Enter address" // English second
              )}
            />
          </InputWrapper>

          {/* Phone Field */}
          <InputWrapper
            label={translate("ফোন ✼", "Phone ✼")}
            labelFor="phone"
            error={errors.phone?.message}
          >
            <Input
              {...register("phone")}
              type="tel"
              maxLength={11}
              placeholder={translate(
                "ফোন নম্বর লিখুন", // Bengali first
                "Enter phone number" // English second
              )}
            />
          </InputWrapper>

          {/* Email Field */}
          <InputWrapper
            label={translate("ইমেল", "Email")}
            labelFor="email"
            error={errors.email?.message}
          >
            <Input
              {...register("email")}
              placeholder={translate(
                "ইমেল লিখুন (ঐচ্ছিক)", // Bengali first
                "Enter email (optional)" // English second
              )}
            />
          </InputWrapper>

          {/* Website Field */}
          <InputWrapper
            label={translate("ওয়েবসাইট", "Website")}
            labelFor="website"
            error={errors.website?.message}
          >
            <Input
              {...register("website")}
              placeholder={translate(
                "ওয়েবসাইট লিখুন (ঐচ্ছিক)", // Bengali first
                "Enter website (optional)" // English second
              )}
            />
          </InputWrapper>
        </div>

        <Submit
          loading={isLoading}
          errorTitle="Add Fuel Company Failed"
          errors={submiterror}
          submitTitle={translate(
            "ফুয়েল কোম্পানি যোগ করুন", // Bengali first
            "Add Fuel Company" // English second
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddFuelCompany;
