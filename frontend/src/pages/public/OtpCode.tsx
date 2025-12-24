import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Loader } from "@/components/common/Loader";
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
import { useOtpVerifyMutation } from "@/store/api/authenticationApi";
import { fallback } from "@/utils/constants/common/fallback";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useLocaleContext } from "@/utils/hooks/useLocaleContext";
import { AlertCircle } from "lucide-react";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpCode: FC = () => {
  const { translate } = useCustomTranslator();
  const { locale } = useLocaleContext();

  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [otpVerify] = useOtpVerifyMutation();
  const navigate = useNavigate(); // Use navigate for redirection
  const email = localStorage.getItem("email")
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      setIsLoading(true);
      const otpToken = localStorage.getItem("otp-token");
      const otpNumber = parseInt(otp);
      const response = await otpVerify({ otp: otpNumber, otpToken }).unwrap();
      if (response.success) {
        localStorage.setItem("otp", otp);
        setSuccessMessage(
          translate(
            "ওটিপি সফলভাবে যাচাই করা হয়েছে।",
            "OTP verified successfully."
          )
        );
        navigate("/new-password");
      }
    } catch (err) {
      //const apiError = err as ApiError;
      setError(
        //@ts-ignore
        err?.data?.message ||
        translate(
          "ওটিপি যাচাই করতে ব্যর্থ। আবার চেষ্টা করুন।",
          "Failed to verify OTP. Please try again."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <SectionWrapper>
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-2xl">
              {translate("ওটিপি যাচাই করুন", "Verify OTP")}
            </CardTitle>
            <CardDescription>
              {translate(
                "আপনার ইমেইলে পাঠানো ওটিপি লিখুন।",
                `Enter the OTP sent to your email: ${email}`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOtpSubmit}>
              {/* OTP INPUT */}
              <InputWrapper label={translate("ওটিপি লিখুন", "Enter OTP")}>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={translate("ওটিপি লিখুন", "Enter OTP")}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </InputWrapper>

              <div className="flex justify-end">
                <Button className="my-6" disabled={isLoading} type="submit">
                  {isLoading && <Loader />}
                  {translate("যাচাই করুন", "Verify")}
                </Button>
              </div>

              {/* SUCCESS MESSAGE */}
              {successMessage && (
                <Alert variant="default">
                  <AlertTitle>{translate("সফল", "Success")}</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              {/* ERROR MESSAGE */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{translate("ত্রুটি", "Error")}</AlertTitle>
                  <AlertDescription>
                    {error ||
                      (locale === "en" ? fallback.error.en : fallback.error.bn)}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </SectionWrapper>
    </PageWrapper>
  );
};

export default OtpCode;
