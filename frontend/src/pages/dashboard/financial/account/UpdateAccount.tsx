import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
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
  UpdateAccountDataProps,
  updateAccountSchema,
} from "@/schemas/financial/addUpdateAccountSchema";
import {
  useGetSingleAccountQuery,
  useUpdateAccountMutation,
} from "@/store/api/finance/accountApi";
import { addUpdateAccountForm } from "@/utils/constants/form/addUpdateAccountForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";

interface IUpdateAccountProps {
  id: number | null;
}

const UpdateAccount: FC<IUpdateAccountProps> = ({ id }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateAccountDataProps>({
    resolver: zodResolver(updateAccountSchema),
  });

  const [
    updateAccount,
    { isLoading: updateAccountLoading, error: updateAccountError },
  ] = useUpdateAccountMutation({});

  const { data: accountData, isLoading: accountLoading } =
    useGetSingleAccountQuery(id);

  useEffect(() => {
    setValue("accountHolderName", accountData?.data?.accountHolderName);
    setValue("accountName", accountData?.data?.accountName);
    setValue("accountNumber", accountData?.data?.accountNumber);
    setValue("accountType", accountData?.data?.accountType);
    setValue("bankName", accountData?.data?.bankName);
  }, [accountData, setValue]);

  const onSubmit = async (data: UpdateAccountDataProps) => {
    const result = await updateAccount({ data, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "অ্যাকাউন্ট সম্পাদনা করার বার্তা",
          "Message for updating account"
        ),
        description: toastMessage("update", translate("অ্যাকাউন্ট", "account")),
      });
    }
  };

  if (accountLoading) {
    return <FormSkeleton columns={2} inputs={5} />;
  }

  return (
    <FormWrapper
      heading={translate("একাউন্ট সম্পাদনা করুন", "Add Account")}
      subHeading={translate(
        "সিস্টেমে একাউন্ট সম্পাদনা করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update existing account to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {/* ACCOUNT HOLDER NAME */}
          <InputWrapper
            error={errors?.accountHolderName?.message}
            labelFor="accountHolderName"
            label={translate(
              addUpdateAccountForm?.accountHolderName.label.bn,
              addUpdateAccountForm.accountHolderName.label.en
            )}
          >
            <Input
              id="accountHolderName"
              {...register("accountHolderName")}
              type="text"
              placeholder={translate(
                addUpdateAccountForm.accountHolderName.placeholder.bn,
                addUpdateAccountForm.accountHolderName.placeholder.en
              )}
            />
          </InputWrapper>
          {/* ACCOUNT NAME */}
          <InputWrapper
            error={errors?.accountName?.message}
            labelFor="accountName"
            label={translate(
              addUpdateAccountForm?.accountName.label.bn,
              addUpdateAccountForm.accountName.label.en
            )}
          >
            <Input
              id="accountName"
              {...register("accountName")}
              type="text"
              placeholder={translate(
                addUpdateAccountForm.accountName.placeholder.bn,
                addUpdateAccountForm.accountName.placeholder.en
              )}
            />
          </InputWrapper>

          {/* ACCOUNT NUMBER */}
          <InputWrapper
            error={errors.accountNumber?.message}
            labelFor="accountNumber"
            label={translate(
              addUpdateAccountForm?.accountNumber.label.bn,
              addUpdateAccountForm.accountNumber.label.en
            )}
          >
            <Input
              id="accountNumber"
              {...register("accountNumber")}
              type="text"
              placeholder={translate(
                addUpdateAccountForm.accountNumber.placeholder.bn,
                addUpdateAccountForm.accountNumber.placeholder.en
              )}
            />
          </InputWrapper>
          {/* BANK NAME */}
          <InputWrapper
            error={errors?.bankName?.message}
            labelFor="bankName"
            label={translate(
              addUpdateAccountForm?.bankName.label.bn,
              addUpdateAccountForm.bankName.label.en
            )}
          >
            <Input
              id="bankName"
              {...register("bankName")}
              type="text"
              placeholder={translate(
                addUpdateAccountForm.bankName.placeholder.bn,
                addUpdateAccountForm.bankName.placeholder.en
              )}
            />
          </InputWrapper>

          <InputWrapper
            error={errors?.accountType?.message}
            labelFor="accountType"
            label={translate(
              addUpdateAccountForm?.accountType.label.bn,
              addUpdateAccountForm.accountType.label.en
            )}
          >
            <Select
              value={watch("accountType") || ""}
              onValueChange={(value: "MobileBanking" | "Bank" | "Cash") => {
                setValue("accountType", value);
                setError("accountType", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateAccountForm.accountType.placeholder.bn,
                    addUpdateAccountForm.accountType.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MobileBanking">
                  {translate("মোবাইল ব্যাংকিং", "Mobile Banking")}
                </SelectItem>
                <SelectItem value="Bank">
                  {translate("ব্যাংক", "Bank")}
                </SelectItem>
                <SelectItem value="Cash">
                  {translate("ক্যাশ", "Cash")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
        </div>
        <Submit
          loading={updateAccountLoading}
          errors={updateAccountError}
          submitTitle={translate("অ্যাকাউন্ট সম্পাদনা করুন", "Update Account")}
          errorTitle={translate(
            "অ্যাকাউন্ট সম্পাদনা করতে ত্রুটি",
            "Update Account Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateAccount;
