"use client";
import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LoginImage from "./LoginImage";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useCreateCustomerMutation,
  useCreateCustomerOtpVerifyMutation,
  useCustomerRequestOtpMutation,
  useCustomerVerifyOtpMutation,
  useLoginCustomerMutation,
} from "@/store/api/authenticationApi";
import { toast } from "@/components/ui/use-toast";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { jwtDecode } from "jwt-decode";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { shareWithCookies } from "@/utils/helpers/shareWithCookies";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { loadUserFromToken } from "@/utils/helpers/loadUserFromToken";
import { useDispatch } from "react-redux";
import { playSound } from "@/utils/helpers/playSound";
import { useNavigate } from "react-router-dom";

interface CustomerAuthFormProps {
  activeTab: "login" | "register";
  loginMethod: "phone" | "password";
  setActiveTab: (tab: "login" | "register") => void;
  setLoginMethod: (method: "phone" | "password") => void;
}

const CustomerAuthForm = ({
  activeTab,
  loginMethod,
  setActiveTab,
  setLoginMethod,
}: CustomerAuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  // OTP related states
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [registrationStep, setRegistrationStep] = useState("form");
  const [otpToken, setOtpToken] = useState(""); // Store the token received from request OTP

  // RTK Query mutations
  const [requestOtp] = useCustomerRequestOtpMutation();
  const [verifyOtp] = useCustomerVerifyOtpMutation();
  const [createCustomer] = useCreateCustomerMutation();
  const [createCustomerOtpVerify] = useCreateCustomerOtpVerifyMutation();
  const [loginCustomer] = useLoginCustomerMutation();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.email || !formData.password) {
    toast({
      title: translate("ত্রুটি", "Error"),
      description: toastMessage("Error", "Email and Password are required."),
    });
    return;
  }
  // Use the loginCustomer mutation for email/password login
  try {
    const result = await loginCustomer({
      credential: formData.email,
      password: formData.password,
    }).unwrap();

    const authData = jwtDecode(result?.accessToken || "") as any;
    
    if (result?.success) {
      toast({
        title: translate("প্রবেশের জন্য বার্তা", "Message for login."),
        description: toastMessage("login", authData?.name),
      });
      shareWithCookies(
        "set",
        `${appConfiguration.appCode}token`,
        1440,
        result?.accessToken
      );
      loadUserFromToken(dispatch);
      navigate("/profile/my-profile", {
        replace: true,
      });
      playSound("welcome");
    }
  } catch (error: any) {
    const errorMsg = error?.data?.message || "Login failed. Please try again.";
    toast({
      title: translate("লগইন ব্যর্থ হয়েছে", "Login Failed"),
      description: errorMsg,
      variant: "destructive",
    });
  }
};

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    setOtpError("Passwords do not match");
    return;
  }

  // If not showing OTP input, create customer first
  if (!showOtpInput) {
    await handleCreateCustomer();
    return;
  }

  // If OTP is shown, verify it
  await handleVerifyRegistrationOtp();
};

const handleCreateCustomer = async () => {
  if (
    !formData.phone ||
    !formData.email ||
    !formData.fullName ||
    !formData.password
  ) {
    setOtpError("Please fill all required fields");
    return;
  }

  setIsSendingOtp(true);
  setOtpError("");

  try {
    // Call the create customer API
    const response = await createCustomer({
      phone: formData.phone,
      email: formData.email,
      name: formData.fullName,
      password: formData.password,
    }).unwrap();

    // Assuming the API returns a token that we need for verification
    if (response.otpToken) {
      setOtpToken(response.otpToken);
      setShowOtpInput(true);
      setRegistrationStep("otp");
      setCountdown(120); // 2 minutes countdown
    } else {
      setOtpError("Failed to create account. Please try again.");
    }
  } catch (error: any) {
    const errorMsg = error?.data?.message || "Failed to create account. Please try again.";
    toast({
      title: translate("অ্যাকাউন্ট তৈরি ব্যর্থ", "Account Creation Failed"),
      description: errorMsg,
      variant: "destructive",
    });
  } finally {
    setIsSendingOtp(false);
  }
};

const handleVerifyRegistrationOtp = async () => {
  if (verificationCode.length !== 6) {
    setOtpError("Please enter a valid 6-digit code");
    return;
  }

  setIsVerifyingOtp(true);
  setOtpError("");

  try {
    // Call the verify OTP API for registration
    const result = await createCustomerOtpVerify({
      otpToken: otpToken,
      otp: verificationCode,
    }).unwrap();

    // You might want to redirect or show a success message
    toast({
      title: translate("রেজিস্ট্রেশন সফল", "Registration Successful"),
      description: translate(
        "রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে! এখন আপনি লগইন করতে পারবেন।",
        "Registration successful! You can now login."
      ),
    });

    // Reset form and go back to login
    setActiveTab("login");
    setShowOtpInput(false);
    setRegistrationStep("form");
    setVerificationCode("");
    setFormData({
      phone: "",
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    });

    if (result?.accessToken) {
      const authData = jwtDecode(result.accessToken) as any;

      toast({
        title: translate("প্রবেশের জন্য বার্তা", "Message for Registration."),
        description: toastMessage("Registration", authData?.name),
      });

      shareWithCookies(
        "set",
        `${appConfiguration.appCode}token`,
        1440,
        result.accessToken
      );

      loadUserFromToken(dispatch);
      playSound("welcome");

      // Redirect to profile page after successful OTP login
      navigate("/profile/my-profile", {
        replace: true,
      });
    }
  } catch (error: any) {
    const errorMsg = error?.data?.message || "Invalid verification code";
    toast({
      title: translate("OTP যাচাইকরণ ব্যর্থ", "OTP Verification Failed"),
      description: errorMsg,
      variant: "destructive",
    });
  } finally {
    setIsVerifyingOtp(false);
  }
};

const requestCode = async () => {
  if (!formData.phone) {
    setOtpError("Please enter a phone number first");
    return;
  }

  setIsSendingOtp(true);
  setOtpError("");

  try {
    // Call the request OTP API
    const response = await requestOtp({ phone: formData.phone }).unwrap();

    // Assuming the API returns a token that we need for verification
    if (response.otpToken) {
      setOtpToken(response.otpToken);
      setShowOtpInput(true);
      setRegistrationStep("otp");
      setCountdown(120); // 2 minutes countdown
    } else {
      setOtpError("Failed to send OTP. Please try again.");
    }
  } catch (error: any) {
    const errorMsg = error?.data?.message || "Failed to send OTP. Please try again.";
    toast({
      title: translate("OTP পাঠানো ব্যর্থ", "OTP Sending Failed"),
      description: errorMsg,
      variant: "destructive",
    });
  } finally {
    setIsSendingOtp(false);
  }
};

const handleResendCode = async () => {
  if (countdown > 0) return;

  setIsSendingOtp(true);
  setOtpError("");

  try {
    // Call the request OTP API again
    const response = await requestOtp({ phone: formData.phone }).unwrap();

    // Assuming the API returns a token that we need for verification
    if (response.otpToken) {
      setOtpToken(response.otpToken);
      setCountdown(120); // Reset countdown
    } else {
      setOtpError("Failed to resend OTP. Please try again.");
    }
  } catch (error: any) {
    const errorMsg = error?.data?.message || "Failed to resend OTP. Please try again.";
    toast({
      title: translate("OTP পুনরায় পাঠানো ব্যর্থ", "OTP Resend Failed"),
      description: errorMsg,
      variant: "destructive",
    });
  } finally {
    setIsSendingOtp(false);
  }
};

const handleVerifyOtp = async () => {
  if (verificationCode.length !== 6) {
    setOtpError("Please enter a valid 6-digit code");
    return;
  }

  setIsVerifyingOtp(true);
  setOtpError("");

  try {
    // Call the verify OTP API
    const result = await verifyOtp({
      otpToken: otpToken,
      otp: verificationCode,
    }).unwrap();

    // Handle successful verification
    if (activeTab === "register") {
      if (result?.accessToken) {
        const authData = jwtDecode(result.accessToken) as any;

        toast({
          title: translate("প্রবেশের জন্য বার্তা", "Message for login."),
          description: toastMessage("login", authData?.name),
        });

        shareWithCookies(
          "set",
          `${appConfiguration.appCode}token`,
          1440,
          result.accessToken
        );

        loadUserFromToken(dispatch);
        playSound("welcome");

        // Redirect to profile page after successful OTP login
        navigate("/profile/my-profile", {
          replace: true,
        });
      }
    } else {
      // For login, you might want to store the auth token and redirect
    }
  } catch (error: any) {
    const errorMsg = error?.data?.message || "Invalid verification code";
    toast({
      title: translate("OTP যাচাইকরণ ব্যর্থ", "OTP Verification Failed"),
      description: errorMsg,
      variant: "destructive",
    });
  } finally {
    setIsVerifyingOtp(false);
  }
};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center rounded-md w-full mx-auto">
      <div className="w-full  dark:bg-background dark:text-white px-3 lg:px-5 rounded-md border-r border-[#c004d4] overflow-hidden h-auto">
        <div className="p-2">
          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 mx-auto  flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-[#c004d4] dark:text-white mb-6 text-center">
                Welcome Back
              </h2>

              {loginMethod === "phone" ? (
                <>
                  {!showOtpInput ? (
                    <>
                      <InputWrapper labelFor="phone" label="Phone Number" className="w-full p-0">
                        <div className="relative w-full">
                          <Input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            placeholder="Enter your phone number"
                            onChange={handleInputChange}
                            required
                            className="w-full"
                          />
                        </div>
                      </InputWrapper>

                      <Button
                        type="button"
                        onClick={requestCode}
                        disabled={isSendingOtp}
                        className="w-full bg-[#c004d4] text-white py-3  font-medium transition-colors shadow-md"
                      >
                        {isSendingOtp ? "Sending..." : "Request Code"}
                      </Button>

                      <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-600">
                          or
                        </span>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>

                      <p className="text-sm text-center font-medium">
                        Have a Password?
                        <span
                          className="text-red-500 text-sm cursor-pointer ml-2 font-medium"
                          onClick={() => setLoginMethod("password")}
                        >
                          Click Here
                        </span>
                      </p>

                      <p className="text-sm text-center font-medium">
                        Need a account?
                        <span
                          className="text-red-500 text-sm cursor-pointer ml-2 font-medium"
                          onClick={() => setActiveTab("register")}
                        >
                          SignUp
                        </span>
                      </p>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-gray-600 text-center">
                        Please enter the verification code sent to
                        <br />
                        <span className="font-medium">{formData.phone}</span>
                      </p>

                      <div className="flex justify-center gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={verificationCode[index] || ""}
                            onChange={(e) => {
                              const newCode = verificationCode.split("");
                              newCode[index] = e.target.value.replace(
                                /\D/g,
                                ""
                              );
                              setVerificationCode(newCode.join(""));

                              if (e.target.value && index < 5) {
                                const nextInput = document.getElementById(
                                  `code-input-${index + 1}`
                                );
                                if (nextInput) nextInput.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Backspace" &&
                                !verificationCode[index] &&
                                index > 0
                              ) {
                                const prevInput = document.getElementById(
                                  `code-input-${index - 1}`
                                );
                                if (prevInput) prevInput.focus();
                              }
                            }}
                            id={`code-input-${index}`}
                            className="w-12 h-12 px-2 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        ))}
                      </div>

                      {otpError && (
                        <p className="text-red-500 text-center text-sm">
                          {otpError}
                        </p>
                      )}

                      <div className="text-center">
                        <button
                          type="button"
                          className="text-primary hover:underline flex items-center justify-center gap-1 mx-auto text-sm"
                          onClick={handleResendCode}
                          disabled={countdown > 0 || isSendingOtp}
                        >
                          Send code again
                          {countdown > 0 && (
                            <span className="text-gray-500">
                              ({formatTime(countdown)})
                            </span>
                          )}
                        </button>
                      </div>

                      <Button
                        type="button"
                        className="w-full bg-[#c004d4] text-white py-3 rounded-lg font-medium transition-colors shadow-md"
                        onClick={handleVerifyOtp}
                        disabled={
                          verificationCode.length !== 6 || isVerifyingOtp
                        }
                      >
                        {isVerifyingOtp ? "Verifying..." : "Continue"}
                      </Button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setShowOtpInput(false)}
                          className="text-[#c004d4] text-sm font-medium"
                        >
                          ← Back to phone input
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <InputWrapper labelFor="email" label="Email Or Phone" className="w-full p-0">
                    <div className="relative">
                      <Input
                        id="email"
                        type="text"
                        name="email"
                        value={formData.email}
                        placeholder="Enter your email or phone"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </InputWrapper>

                  <InputWrapper labelFor="password" label="Password" className="w-full p-0">
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        placeholder="Enter your password"
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FiEye className="text-gray-500" />
                        ) : (
                          <FiEyeOff className="text-gray-500" />
                        )}
                      </button>
                    </div>
                  </InputWrapper>

                  <Button
                    type="submit"
                    className="w-full bg-[#c004d4] text-white py-3 rounded-lg font-medium transition-colors shadow-md"
                  >
                    Login
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setLoginMethod("phone")}
                      className="text-[#c004d4] text-sm font-medium"
                    >
                      ← Back to phone login
                    </button>
                  </div>

                  <p className="text-sm text-center font-medium">
                    Need a account?
                    <span
                      className="text-red-500 text-sm cursor-pointer ml-2 font-medium"
                      onClick={() => setActiveTab("register")}
                    >
                      Register
                    </span>
                  </p>
                </>
              )}
            </form>
          )}
          {/* Registration Form - updated with OTP verification */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-1">
              <h2 className="text-2xl font-bold dark:text-white mb-6 text-center text-[#c004d4]">
                {registrationStep === "form"
                  ? "Create Account"
                  : "Verify Phone"}
              </h2>

              {registrationStep === "form" ? (
                <>
                 <InputWrapper labelFor="phone" label="Phone Number" className="w-full p-0">
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        placeholder="Enter your phone number"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </InputWrapper>

                    <InputWrapper labelFor="email" label="Email Address" className="w-full p-0">
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter your email"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </InputWrapper>

                  <InputWrapper labelFor="fullName" label="Full Name" className="w-full p-0">
                    <div className="relative">
                      <Input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        placeholder="Enter your full name"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </InputWrapper>

                

                 

                  <div className="flex justify-between gap-3 pb-2">
                    <InputWrapper
                      labelFor="password"
                      label="Password"
                     className="w-full p-0"
                    >
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <FiEye className="text-gray-500" />
                          ) : (
                            <FiEyeOff className="text-gray-500" />
                          )}
                        </button>
                      </div>
                    </InputWrapper>

                    <InputWrapper
                      labelFor="confirmPassword"
                      label="Password"
                      className="w-full p-0"
                    >
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <FiEye className="text-gray-500" />
                          ) : (
                            <FiEyeOff className="text-gray-500" />
                          )}
                        </button>
                      </div>
                    </InputWrapper>
                  </div>

                  {otpError && (
                    <p className="text-red-500 text-center text-sm">
                      {otpError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#c004d4] text-white py-3 font-medium transition-colors shadow-md"
                  >
                    SignUp
                  </Button>

                  <p className="text-center text-sm text-gray-600 mt-6">
                    By registering, you agree to our{" "}
                    <a href="#" className="text-[#c004d4]">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#c004d4]">
                      Privacy Policy
                    </a>
                  </p>

                  <p className="text-center text-sm font-medium">
                    Have an account?
                    <span
                      className="text-red-500 text-sm ml-2 cursor-pointer font-medium"
                      onClick={() => setActiveTab("login")}
                    >
                      SignIn
                    </span>
                  </p>
                </>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-600 text-center">
                    Please enter the verification code sent to
                    <br />
                    <span className="font-medium">{formData.phone}</span>
                  </p>

                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={verificationCode[index] || ""}
                        onChange={(e) => {
                          const newCode = verificationCode.split("");
                          newCode[index] = e.target.value.replace(/\D/g, "");
                          setVerificationCode(newCode.join(""));

                          if (e.target.value && index < 5) {
                            const nextInput = document.getElementById(
                              `reg-code-input-${index + 1}`
                            );
                            if (nextInput) nextInput.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" &&
                            !verificationCode[index] &&
                            index > 0
                          ) {
                            const prevInput = document.getElementById(
                              `reg-code-input-${index - 1}`
                            );
                            if (prevInput) prevInput.focus();
                          }
                        }}
                        id={`reg-code-input-${index}`}
                        className="w-12 h-12 px-2 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="text-red-500 text-center text-sm">
                      {otpError}
                    </p>
                  )}

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-primary hover:underline flex items-center justify-center gap-1 mx-auto text-sm"
                      onClick={handleResendCode}
                      disabled={countdown > 0 || isSendingOtp}
                    >
                      Send code again
                      {countdown > 0 && (
                        <span className="text-gray-500">
                          ({formatTime(countdown)})
                        </span>
                      )}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-lg font-medium transition-colors shadow-md"
                    disabled={verificationCode.length !== 6 || isVerifyingOtp}
                  >
                    {isVerifyingOtp ? "Verifying..." : "Complete Registration"}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setRegistrationStep("form")}
                      className="text-primary text-sm font-medium"
                    >
                      ← Back to registration form
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>

     <LoginImage />
    </div>
  );
};

export default CustomerAuthForm;
