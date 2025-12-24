"use client";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomerChangePasswordMutation } from "@/store/api/authenticationApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { Eye, EyeOff } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

const CustomerChangePassword = () => {
  const [customerChangePassword, { isLoading }] =
    useCustomerChangePasswordMutation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { translate } = useCustomTranslator();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error(translate("পাসওয়ার্ড প্রয়োজন", "Password is required"));
      return;
    }

    try {
      const response = await customerChangePassword({
        newPassword: password,
      }).unwrap();

      if (response.success) {
        toast.success(
          translate(
            "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে",
            "Password changed successfully"
          )
        );
        setPassword(""); // Clear the input after successful change
      } else {
        toast.error(
          translate(
            "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে",
            "Password change failed"
          )
        );
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error(
        translate(
          "পাসওয়ার্ড পরিবর্তন করার সময় কিছু ভুল হয়েছে",
          "Something went wrong while changing password"
        )
      );
    }
  };

  return (
    <div className="bg-white p-2 lg:p-6 shadow-sm dark:bg-black dark:border border-gray-300 rounded-md dark:text-white">
      <div className="w-full lg:w-3/6 mx-auto">
        <div className="mb-2 lg:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {translate("পাসওয়ার্ড পরিবর্তন করুন", "Change Password")}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {translate(
              "আপনার নতুন পাসওয়ার্ড লিখুন এবং সেভ করুন",
              "Enter your new password and save changes"
            )}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWrapper
              labelFor="New Password"
              label="New Password"
              className="md:col-span-2"
            >
              <div className="relative w-full">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={password}
                  onChange={handleInputChange}
                  placeholder={translate(
                    "আপনার নতুন পাসওয়ার্ড লিখুন",
                    "Enter your new password"
                  )}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </InputWrapper>
          </div>

          <div className="pt-2 flex justify-end items-end">
            <Button
              type="submit"
              className="w-full  lg:w-[180px] h-[40px] bg-[#830494] hover:bg-primary text-white font-semibold py-2 rounded-md transition"
              disabled={isLoading || !password.trim()}
            >
              {isLoading
                ? translate("পরিবর্তন হচ্ছে...", "Changing...")
                : translate("পাসওয়ার্ড পরিবর্তন করুন", "Change Password")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerChangePassword;
