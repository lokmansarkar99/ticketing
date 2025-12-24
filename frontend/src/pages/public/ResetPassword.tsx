import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Loader } from "@/components/common/Loader";
import { Paragraph } from "@/components/common/typography/Paragraph";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/store/api/authenticationApi";
import { fallback } from "@/utils/constants/common/fallback";
import { userLoginForm } from "@/utils/constants/form/loginForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useLocaleContext } from "@/utils/hooks/useLocaleContext";
import { AlertCircle, LucideEye, LucideEyeOff } from "lucide-react";
import { FC, useState } from "react";
import { Link } from "react-router-dom";

interface IVisibleProps {
  password: boolean;
  rePassword: boolean;
}

interface IResetPasswordProps {}

const ResetPassword: FC<IResetPasswordProps> = () => {
  const [visible, setVisible] = useState<IVisibleProps>({
    password: false,
    rePassword: false,
  });

  const { translate } = useCustomTranslator();

  const { locale } = useLocaleContext();

  const [{ isLoading: loginLoading, error: resetPasswordError }] =
    useResetPasswordMutation({}) as any;

  return (
    <PageWrapper>
      <SectionWrapper>
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-2xl">
              {translate("পাসওয়ার্ড পুনঃস্থাপন করুন", "Reset Password")}
            </CardTitle>
            <CardDescription>
              {translate(
                "আপনার অ্যাকাউন্টের পাসওয়ার্ড রিসেট করতে পুনরায় পাসওয়ার্ড লিখুন।",
                "Enter password again to reset your account password."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* PASSWORD */}
            <InputWrapper
              label={translate(
                userLoginForm.password.label.bn,
                userLoginForm.password.label.en
              )}
            >
              <div className="relative">
                <Input
                  type={visible.password ? "text" : "password"}
                  placeholder={translate(
                    userLoginForm.password.placeholder.bn,
                    userLoginForm.password.placeholder.en
                  )}
                />

                <button
                  type="button"
                  className="text-lg absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer whitespace-nowrap rounded-md p-1 hover:bg-accent"
                  onClick={() =>
                    setVisible((previousState: IVisibleProps) => ({
                      ...previousState,
                      password: !previousState.password,
                    }))
                  }
                >
                  {visible.password ? (
                    <LucideEye className="h-5 w-5" />
                  ) : (
                    <LucideEyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </InputWrapper>

            {/* RE-ENTER PASSWORD */}
            <InputWrapper
              label={translate(
                userLoginForm.rePassword.label.bn,
                userLoginForm.rePassword.label.en
              )}
            >
              <div className="relative">
                <Input
                  type={visible.rePassword ? "text" : "password"}
                  placeholder={translate(
                    userLoginForm.rePassword.placeholder.bn,
                    userLoginForm.rePassword.placeholder.en
                  )}
                />

                <button
                  type="button"
                  className="text-lg absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer whitespace-nowrap rounded-md p-1 hover:bg-accent"
                  onClick={() =>
                    setVisible((previousState: IVisibleProps) => ({
                      ...previousState,
                      rePassword: !previousState.rePassword,
                    }))
                  }
                >
                  {visible.rePassword ? (
                    <LucideEye className="h-5 w-5" />
                  ) : (
                    <LucideEyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </InputWrapper>
            {/* SUBMIT & ERROR MESSAGE */}
            <div className="flex justify-end">
              <Button className="my-6" disabled={loginLoading} type="submit">
                {loginLoading && <Loader />}
                {translate("রিসেট পাসওয়ার্ড", "Reset Password")}
              </Button>
            </div>

            {resetPasswordError && "data" in resetPasswordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Error</AlertTitle>
                <AlertDescription>
                  {resetPasswordError?.data.message || locale === "en"
                    ? fallback.error.en
                    : fallback.error.bn}
                </AlertDescription>
              </Alert>
            )}
            <div className="flex justify-center items-center">
              <Paragraph size="sm">
                {translate(
                  "আপনার কি আগে থেকেই একটি অ্যাকাউন্ট আছে?",
                  "Do you have account already?"
                )}
              </Paragraph>
              <Link to="../login" className="-mt-2">
                <Button variant="link" className="text-sm">
                  {translate("লগইন", "Login")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>
    </PageWrapper>
  );
};

export default ResetPassword;
