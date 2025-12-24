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
import { useToast } from "@/components/ui/use-toast";
import { useNewPaaswordChangeMutation } from "@/store/api/authenticationApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { AlertCircle } from "lucide-react";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ApiError {
  message: string;
}
const NewPassword: FC = () => {
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const navigate = useNavigate(); // Use navigate for redirection
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newPaaswordChange, { isLoading }] = useNewPaaswordChangeMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmPassword) {
      setError(
        translate(
          "পাসওয়ার্ড মেলেনি। অনুগ্রহ করে আবার চেষ্টা করুন।",
          "Passwords do not match. Please try again."
        )
      );
      return;
    }

    try {
      const otpNumber = parseInt(localStorage.getItem("otp") as string);
      const otpToken = localStorage.getItem("otp-token");
      // Make API call to change password
      const response = await newPaaswordChange({
        otp: otpNumber,
        otpToken,
        newPassword,
        confirmPassword,
      }).unwrap();
      if (response.success) {
        localStorage.removeItem("otp");
        localStorage.removeItem("otp-token");

        toast({
          title: translate(
            "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।",
            "Your password has been successfully changed."
          ),
          description: toastMessage(
            "changePassword",
            "Your password has changed."
          ),
        });
        navigate("/login");
      }
    } catch (err) {
      const apiError = err as ApiError;

      setError(
        //@ts-ignore
        apiError?.data.message ||
          translate(
            "পাসওয়ার্ড সেট করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।",
            "Failed to set password. Please try again."
          )
      );
    }
  };

  return (
    <PageWrapper>
      <SectionWrapper>
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-2xl">
              {translate("নতুন পাসওয়ার্ড সেট করুন", "Set New Password")}
            </CardTitle>
            <CardDescription>
              {translate(
                "আপনার অ্যাকাউন্টের জন্য একটি নতুন পাসওয়ার্ড লিখুন।",
                "Enter a new password for your account."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* New Password */}
              <InputWrapper
                label={translate("নতুন পাসওয়ার্ড", "New Password")}
              >
                <Input
                  type="password"
                  placeholder={translate(
                    "নতুন পাসওয়ার্ড লিখুন",
                    "Enter New Password"
                  )}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </InputWrapper>

              {/* Confirm Password */}
              <InputWrapper
                label={translate(
                  "নতুন পাসওয়ার্ড নিশ্চিত করুন",
                  "Confirm New Password"
                )}
              >
                <Input
                  type="password"
                  placeholder={translate(
                    "পাসওয়ার্ড পুনরায় লিখুন",
                    "Re-enter Password"
                  )}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </InputWrapper>

              <div className="flex justify-end">
                <Button className="my-6" disabled={isLoading} type="submit">
                  {isLoading && <Loader />}
                  {translate("সংরক্ষণ করুন", "Save")}
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
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </SectionWrapper>
    </PageWrapper>
  );
};

export default NewPassword;
