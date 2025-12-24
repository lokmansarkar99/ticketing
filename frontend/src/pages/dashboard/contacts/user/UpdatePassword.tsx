import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  UpdatePasswordDataProps,
  updatePasswordSchema,
} from "@/schemas/contact/addUpdateUserSchema";
import { useResetPasswordMutation } from "@/store/api/authenticationApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideEye, LucideEyeOff } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

interface IUpdatePasswordProps {}

interface IUpdatePasswordFormStateProps {
  oldPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
}

const UpdatePassword: FC<IUpdatePasswordProps> = () => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const [addUserFormState, setAddUserFormState] =
    useState<IUpdatePasswordFormStateProps>({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordDataProps>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const [
    resetPassword,
    { isLoading: updatePasswordLoading, error: updatePasswordError },
  ] = useResetPasswordMutation({});

  const onSubmit = async (data: UpdatePasswordDataProps) => {
    const result = await resetPassword(data);
    if (result?.data?.success) {
      toast({
        title: translate(
          "পাসওয়ার্ড সম্পাদনা করার বার্তা",
          "Message for updating password"
        ),
        description: toastMessage("update", translate("পাসওয়ার্ড", "password")),
      });
    }
  };

  return (
    <FormWrapper
      heading={translate("পাসওয়ার্ড সম্পাদনা করুন", "Update Password")}
      subHeading={translate(
        "সিস্টেমে পাসওয়ার্ড সম্পাদনা করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add update a new password to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-x-4 gap-y-2">
          {/* OLD PASSWORD */}
          <InputWrapper
            labelFor="oldPassword"
            label={translate("পুরনো পাসওয়ার্ড ✼", "Old Password ✼")}
            error={errors?.oldPassword?.message}
          >
            <div className="relative">
              <Input
                {...register("oldPassword")}
                className="pr-10"
                id="oldPassword"
                type={addUserFormState.oldPassword ? "password" : "text"}
                placeholder={translate(
                  "পুরনো পাসওয়ার্ড লিখুন",
                  "Enter old password"
                )}
              />
              <button
                type="button"
                className="text-lg absolute top-1/2 -translate-y-1/2 right-1 cursor-pointer whitespace-nowrap rounded-md p-1 hover:bg-muted"
                onClick={() =>
                  setAddUserFormState(
                    (prevState: IUpdatePasswordFormStateProps) => ({
                      ...prevState,
                      oldPassword: !prevState.oldPassword,
                    })
                  )
                }
              >
                {addUserFormState.oldPassword ? (
                  <LucideEye className="h-5 w-5" />
                ) : (
                  <LucideEyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </InputWrapper>
          {/* NEW PASSWORD  */}
          <InputWrapper
            labelFor="newPassword"
            label={translate("নতুন পাসওয়ার্ড ✼", "New Password ✼")}
            error={errors?.newPassword?.message}
          >
            <div className="relative">
              <Input
                {...register("newPassword")}
                type={addUserFormState.newPassword ? "password" : "text"}
                id="re_password"
                placeholder={translate(
                  "নতুন পাসওয়ার্ড লিখুন",
                  "Enter new password"
                )}
              />
              <button
                type="button"
                className="text-lg absolute top-1/2 -translate-y-1/2 right-1 cursor-pointer whitespace-nowrap rounded-md p-1 hover:bg-muted"
                onClick={() =>
                  setAddUserFormState(
                    (prevState: IUpdatePasswordFormStateProps) => ({
                      ...prevState,
                      newPassword: !prevState.newPassword,
                    })
                  )
                }
              >
                {addUserFormState.newPassword ? (
                  <LucideEye className="h-5 w-5" />
                ) : (
                  <LucideEyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </InputWrapper>

          {/* CONFIRM PASSWORD */}
          <InputWrapper
            labelFor="confirmPassword"
            label={translate("নিশ্চিত পাসওয়ার্ড ✼", "Confirm Password ✼")}
            error={errors?.confirmPassword?.message}
          >
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                type={addUserFormState.confirmPassword ? "password" : "text"}
                id="re_password"
                placeholder={translate(
                  "নিশ্চিত পাসওয়ার্ড লিখুন",
                  "Enter confirm password"
                )}
              />
              <button
                type="button"
                className="text-lg absolute top-1/2 -translate-y-1/2 right-1 cursor-pointer whitespace-nowrap rounded-md p-1 hover:bg-muted"
                onClick={() =>
                  setAddUserFormState(
                    (prevState: IUpdatePasswordFormStateProps) => ({
                      ...prevState,
                      confirmPassword: !prevState.confirmPassword,
                    })
                  )
                }
              >
                {addUserFormState.confirmPassword ? (
                  <LucideEye className="h-5 w-5" />
                ) : (
                  <LucideEyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </InputWrapper>
        </div>
        <Submit
          loading={updatePasswordLoading}
          errors={updatePasswordError}
          submitTitle={translate("পাসওয়ার্ড সম্পাদনা করুন", "Update Password")}
          errorTitle={translate(
            "পাসওয়ার্ড সম্পাদনা করতে ত্রুটি",
            "Update Password Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdatePassword;
