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
import {
  LoginDataProps,
  loginSchema,
} from "@/schemas/authentication/loginSchema";
import { useLoginMutation } from "@/store/api/authenticationApi";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { fallback } from "@/utils/constants/common/fallback";
import { userLoginForm } from "@/utils/constants/form/loginForm";
import formatter from "@/utils/helpers/formatter";
import { loadUserFromToken } from "@/utils/helpers/loadUserFromToken";
import { playSound } from "@/utils/helpers/playSound";
import { shareWithCookies } from "@/utils/helpers/shareWithCookies";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import { AlertCircle, LucideEye, LucideEyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState<boolean>(false);

  const [login, { isLoading: loginLoading, error: loginError }] =
    useLoginMutation({}) as any;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataProps>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDataProps) => {
    const result = await login(data);

    const authData = jwtDecode(result?.data?.accessToken || "") as any;
    //
    if (result?.data?.success) {
      const role = authData?.role?.toLowerCase();

      toast({
        title: translate("প্রবেশের জন্য বার্তা", "Message for login."),
        description: toastMessage("login", authData?.name),
      });
      shareWithCookies(
        "set",
        `${appConfiguration.appCode}token`,
        1440,
        result?.data?.accessToken
      );
      loadUserFromToken(dispatch);
      navigate("/" + role + "/dashboard", {
        replace: true,
      });
      playSound("welcome");
    }
  };

  return (
    <PageWrapper>
      <SectionWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="w-[360px] lg:w-[450px] mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">
                {translate("লগইন", "Login")}
              </CardTitle>
              <CardDescription>
                {translate(
                  "আপনার অ্যাকাউন্টে লগইন করতে নিচে আপনার নাম লিখুন।",
                  "Enter your name below to login to your account"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* EMAIL */}
              <InputWrapper
                labelFor="userName"
                error={errors.userName?.message}
                label={translate(
                  userLoginForm.userName.label.bn,
                  userLoginForm.userName.label.en
                )}
              >
                <Input
                  id="userName"
                  type="text"
                  {...register("userName")}
                  placeholder={translate(
                    userLoginForm.userName.placeholder.bn,
                    userLoginForm.userName.placeholder.en
                  )}
                />
              </InputWrapper>
              {/* PASSWORD */}
              <InputWrapper
                error={errors.password?.message}
                labelFor="password"
                label={translate(
                  userLoginForm.password.label.bn,
                  userLoginForm.password.label.en
                )}
              >
                <div className="relative">
                  <Input
                    id="password"
                    {...register("password")}
                    type={visible ? "text" : "password"}
                    placeholder={translate(
                      userLoginForm.password.placeholder.bn,
                      userLoginForm.password.placeholder.en
                    )}
                  />

                  <button
                    type="button"
                    className="text-lg absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer whitespace-nowrap rounded-md p-1 hover:bg-muted"
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? (
                      <LucideEye className="h-5 w-5" />
                    ) : (
                      <LucideEyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </InputWrapper>

              {/* SUBMIT & ERROR MESSAGE */}
              <div className="flex justify-between items-center text-primary ">
                <Link to="/forget-password">Forgot Your Password?</Link>
                <Button className="my-6" disabled={loginLoading} type="submit">
                  {loginLoading && <Loader size="sm" variant="destructive" />}
                  {translate("লগইন", "Login")}
                </Button>
              </div>

              {loginError && "data" in loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    {translate("লগইন ক্রুটি", "Login Error")}
                  </AlertTitle>
                  <AlertDescription>
                    {formatter({
                      type: "sentences",
                      sentences: loginError?.data?.message,
                    }) || translate(fallback.error.bn, fallback.error.en)}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </form>
      </SectionWrapper>
    </PageWrapper>
  );
};

export default Login;
