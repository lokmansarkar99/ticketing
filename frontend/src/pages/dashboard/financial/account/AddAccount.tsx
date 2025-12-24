import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
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
  AddAccountDataProps,
  addAccountSchema,
} from "@/schemas/financial/addUpdateAccountSchema";
import { useAddAccountMutation } from "@/store/api/finance/accountApi";
import { addUpdateAccountForm } from "@/utils/constants/form/addUpdateAccountForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, FC } from "react";
import { useForm } from "react-hook-form";
import { IAccountStateProps } from "./AccountList";

interface IAddAccountProps {
  setAccountState: (
    accountState: (prevState: IAccountStateProps) => IAccountStateProps
  ) => void;
}

const AddAccount: FC<IAddAccountProps> = ({ setAccountState }) => {
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
  } = useForm<AddAccountDataProps>({
    resolver: zodResolver(addAccountSchema),
  });

  const [addAccount, { isLoading: addAccountLoading, error: addAccountError }] =
    useAddAccountMutation({});

  const onSubmit = async (data: AddAccountDataProps) => {
    const result = await addAccount(data);
    if (result?.data?.success) {
      toast({
        title: translate(
          "অ্যাকাউন্ট যোগ করার বার্তা",
          "Message for adding account"
        ),
        description: toastMessage("add", translate("অ্যাকাউন্ট", "account")),
      });

      setAccountState((prevState: IAccountStateProps) => ({
        ...prevState,
        addAccountOpen: false,
      }));
    }
  };

  return (
    <FormWrapper
      heading={translate("একাউন্ট যোগ করুন", "Add Account")}
      subHeading={translate(
        "সিস্টেমে নতুন একাউন্ট যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new account to the system."
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
          {/* OPENING BALANCE */}
          <InputWrapper
            error={errors?.openingBalance?.message}
            labelFor="openingBalance"
            label={translate(
              addUpdateAccountForm?.openingBalance.label.bn,
              addUpdateAccountForm.openingBalance.label.en
            )}
          >
            <Input
              type="number"
              id="openingBalance"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const inputValue = +e.target.value;
                setValue("openingBalance", inputValue);
                if (inputValue) {
                  setError("openingBalance", { type: "custom", message: "" });
                } else {
                  setError("openingBalance", {
                    type: "custom",
                    message: "Opening balance is required",
                  });
                }
              }}
              placeholder={translate(
                addUpdateAccountForm.openingBalance.placeholder.bn,
                addUpdateAccountForm.openingBalance.placeholder.en
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
          loading={addAccountLoading}
          errors={addAccountError}
          submitTitle={translate("অ্যাকাউন্ট যুক্ত করুন", "Add Account")}
          errorTitle={translate(
            "অ্যাকাউন্ট যোগ করতে ত্রুটি",
            "Add Account Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddAccount;
