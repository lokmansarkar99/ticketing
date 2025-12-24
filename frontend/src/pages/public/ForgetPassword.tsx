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
import { useForgetPasswordMailMutation } from "@/store/api/authenticationApi";
import { fallback } from "@/utils/constants/common/fallback";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useLocaleContext } from "@/utils/hooks/useLocaleContext";
import { AlertCircle } from "lucide-react";
import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface ApiError {
  message: string;
}

interface IResetPasswordProps {}

const ForgetPassword: FC<IResetPasswordProps> = () => {
  const { translate } = useCustomTranslator();
  const { locale } = useLocaleContext();
  const navigate = useNavigate(); // Use navigate for redirection

  const [
    forgetPasswordMail,
    { isLoading: loginLoading, error: resetPasswordError },
  ] = useForgetPasswordMailMutation();

  const [userName, setUserName] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    try {
      const response = await forgetPasswordMail({ userName }).unwrap();
      if (response.success) {
        setSuccessMessage(
          translate(
            "পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে।",
            "Password reset userName has been sent."
          )
        );
        localStorage.setItem("otp-token", response?.data?.otpToken);
        localStorage.setItem("email", response?.email);
        navigate("/otp", { state: { userName } });
      }
    } catch (error) {
      console.error("Error while sending password reset userName:", error);
    }
  };

  return (
    <PageWrapper>
      <SectionWrapper>
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-2xl">
              {translate(
                "ভুলিয়া যাত্তয়া পাসওয়ার্ড উদ্ধার করুন",
                "Forget Password"
              )}
            </CardTitle>
            <CardDescription>
              {translate(
                "আপনার অ্যাকাউন্টের পাসওয়ার্ড উদ্ধার করতে পুনরায় ইউজার নেম লিখুন।",
                "Enter userName again to rescue your account password."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <InputWrapper
                label={translate(
                  "আপনার ইউজার নেম লিখুন",
                  "Enter Your User Name"
                )}
              >
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={translate(
                      "আপনার ইউজার নেম লিখুন",
                      "Enter Your User Name"
                    )}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
              </InputWrapper>

              <div className="flex justify-end">
                <Button className="my-6" disabled={loginLoading} type="submit">
                  {loginLoading && <Loader />}
                  {translate("পরবর্তী", "Next")}
                </Button>
              </div>

              {successMessage && (
                <Alert variant="default">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              {/* Safely Handle Error */}
              {resetPasswordError && "data" in resetPasswordError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{translate("ত্রুটি", "Error")}</AlertTitle>
                  <AlertDescription>
                    {(resetPasswordError.data as ApiError).message ||
                      (locale === "en" ? fallback.error.en : fallback.error.bn)}
                  </AlertDescription>
                </Alert>
              )}
            </form>

            <div className="flex justify-center items-center">
              <Paragraph size="sm">
                {translate(
                  "আপনার কি আগে থেকেই একটি অ্যাকাউন্ট আছে?",
                  "Do you have an account already?"
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

export default ForgetPassword;
