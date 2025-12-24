import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  AddEditPartnerDataProps,
  addEditPartnerSchema,
} from "@/schemas/financial/addUpdatePartnerSchema";
import {
  useGetSinglePartnerQuery,
  useUpdatePartnerMutation,
} from "@/store/api/finance/partnerApi";
import { addUpdatePartnerForm } from "@/utils/constants/form/addUpdatePartnerForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";

interface IUpdatePartnerProps {
  id: number | null;
}

const UpdatePartner: FC<IUpdatePartnerProps> = ({ id }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AddEditPartnerDataProps>({
    resolver: zodResolver(addEditPartnerSchema),
  });

  const { data: partnerData, isLoading: partnerLoading } =
    useGetSinglePartnerQuery(id);

  const [
    updatePartner,
    { isLoading: updatePartnerLoading, error: updatePartnerError },
  ] = useUpdatePartnerMutation({});

  useEffect(() => {
    setValue("address", partnerData?.data?.address);
    setValue("city", partnerData?.data?.city);
    setValue("country", partnerData?.data?.country);
    setValue("email", partnerData?.data?.email);
    setValue("name", partnerData?.data?.name);
    setValue("phone", partnerData?.data?.phone);
    setValue("postalCode", partnerData?.data?.postalCode);
  }, [partnerData, setValue]);

  const onSubmit = async (data: AddEditPartnerDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "email",
      "address",
      "city",
      "postalCode",
      "country",
    ]) as AddEditPartnerDataProps;

    const result = await updatePartner({ data: updateData, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "অংশিদার সম্পাদন করার বার্তা",
          "Message for updating partner"
        ),
        description: toastMessage("update", translate("অংশিদার", "partner")),
      });
    }
  };

  if (partnerLoading) {
    return <FormSkeleton columns={2} inputs={7} />;
  }

  return (
    <FormWrapper
      heading={translate("অংশিদার সম্পাদন করুন", "Update Partner")}
      subHeading={translate(
        "সিস্টেমে অংশিদার সম্পাদন করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update existing partner to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {/* NAME */}
          <InputWrapper
            labelFor="name"
            error={errors.name?.message}
            label={translate(
              addUpdatePartnerForm.name.label.bn,
              addUpdatePartnerForm.name.label.en
            )}
          >
            <Input
              id="name"
              {...register("name")}
              type="text"
              placeholder={translate(
                addUpdatePartnerForm.name.placeholder.bn,
                addUpdatePartnerForm.name.placeholder.en
              )}
            />
          </InputWrapper>
          {/* EMAIL */}
          <InputWrapper
            labelFor="email"
            error={errors?.email?.message}
            label={translate(
              addUpdatePartnerForm.email.label.bn,
              addUpdatePartnerForm.email.label.en
            )}
          >
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder={translate(
                addUpdatePartnerForm.email.placeholder.bn,
                addUpdatePartnerForm.email.placeholder.en
              )}
            />
          </InputWrapper>

          {/* PHONE */}

          <InputWrapper
            error={errors.phone?.message}
            labelFor="phone"
            label={translate(
              addUpdatePartnerForm?.phone.label.bn,
              addUpdatePartnerForm.phone.label.en
            )}
          >
            <Input
              {...register("phone")}
              id="phone"
              type="tel"
              placeholder={translate(
                addUpdatePartnerForm.phone.placeholder.bn,
                addUpdatePartnerForm.phone.placeholder.en
              )}
            />
          </InputWrapper>

          {/* ADDRESS */}
          <InputWrapper
            error={errors?.address?.message}
            labelFor="address"
            label={translate(
              addUpdatePartnerForm.address.label.bn,
              addUpdatePartnerForm.address.label.en
            )}
          >
            <Input
              {...register("address")}
              id="address"
              type="text"
              placeholder={translate(
                addUpdatePartnerForm.address.placeholder.bn,
                addUpdatePartnerForm.address.placeholder.en
              )}
            />
          </InputWrapper>
          {/* CITY */}

          <InputWrapper
            error={errors.city?.message}
            labelFor="city"
            label={translate(
              addUpdatePartnerForm.city.label.bn,
              addUpdatePartnerForm.city.label.en
            )}
          >
            <Input
              {...register("city")}
              id="city"
              type="text"
              placeholder={translate(
                addUpdatePartnerForm.city.placeholder.bn,
                addUpdatePartnerForm.city.placeholder.en
              )}
            />
          </InputWrapper>
          {/* POSTAL CODE */}
          <InputWrapper
            labelFor="postalCode"
            error={errors.postalCode?.message}
            label={translate(
              addUpdatePartnerForm.postalCode.label.bn,
              addUpdatePartnerForm.postalCode.label.en
            )}
          >
            <Input
              {...register("postalCode")}
              id="postalCode"
              type="text"
              placeholder={translate(
                addUpdatePartnerForm.postalCode.placeholder.bn,
                addUpdatePartnerForm.postalCode.placeholder.en
              )}
            />
          </InputWrapper>
          {/* COUNTRY */}
          <InputWrapper
            labelFor="country"
            error={errors?.country?.message}
            label={translate(
              addUpdatePartnerForm.country.label.bn,
              addUpdatePartnerForm.country.label.en
            )}
          >
            <Input
              {...register("country")}
              id="country"
              type="text"
              placeholder={translate(
                addUpdatePartnerForm.country.placeholder.bn,
                addUpdatePartnerForm.country.placeholder.en
              )}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={updatePartnerLoading}
          errors={updatePartnerError}
          submitTitle={translate("অংশিদার সম্পাদন করুন", "Update Partner")}
          errorTitle={translate(
            "অংশিদার সম্পাদন করতে ত্রুটি",
            "Update Partner Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdatePartner;
