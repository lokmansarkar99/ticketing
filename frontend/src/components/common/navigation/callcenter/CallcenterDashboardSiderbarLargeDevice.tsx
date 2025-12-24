import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useGetSingleUserQuery } from "@/store/api/contact/userApi";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { shareWithCookies } from "@/utils/helpers/shareWithCookies";
import { useAppContext } from "@/utils/hooks/useAppContext";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { skipToken } from "@reduxjs/toolkit/query";
import { PanelLeft, Settings } from "lucide-react";
import React, { FC } from "react";
import { LuLogOut } from "react-icons/lu";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import avatarimg from "../../../../assets/avatar.png";
import logobangla from "../../../../assets/logobangla.png";
import logoeng from "../../../../assets/longeng.png";
import { Label } from "../../typography/Label";
import { callcenterNavigationLinks } from "@/utils/constants/common/callcenter/callcenterNavigationLinks";

interface ICallcenterDashboardSidebarLargeDeviceProps {}

const CallcenterDashboardSidebarLargeDevice: FC<
  ICallcenterDashboardSidebarLargeDeviceProps
> = () => {
  const { translate, locale } = useCustomTranslator();
  const { sidebarOpen, setSidebarOpen } = useAppContext();
  const { route, setRoute } = useAppContext();
  const { role } = shareAuthentication();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const { data: userData } = useGetSingleUserQuery(user?.id ?? skipToken);

  // LOGOUT HANDLER
  const handleLogout = async () => {
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    navigate("/login", { replace: true });
    window.location.reload();
  };
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-10 hidden lg:flex flex-col m-1.5 bg-muted/30 backdrop-blur-sm rounded-md  transition-all duration-300",
        sidebarOpen ? "lg:w-[280px]" : "lg:w-14"
      )}
    >
      <nav
        className={cn(
          "flex flex-col  gap-4 px-2 -my-[9px] sm:py-5",
          sidebarOpen ? "mx-1.5" : "items-center"
        )}
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant={"outline"}
            size={"icon"}
            className={cn(
              !sidebarOpen && "border-primary bg-primary hover:bg-primary",
              "relative group"
            )}
          >
            <PanelLeft
              className={cn(
                "h-5 w-5",
                !sidebarOpen && "animate-pulse text-primary-foreground"
              )}
            />
          </Button>
          <div
            className={`${cn(!sidebarOpen && "hidden ")} flex flex-col gap-2`}
          >
            {locale === "en" ? (
              <img className="" src={logoeng} alt="logo" />
            ) : (
              <img className="" src={logobangla} alt="logo" />
            )}
          </div>
        </div>
        {/* user information */}
        <div
          className={`${cn(
            !sidebarOpen && "hidden"
          )} flex gap-2 items-center rounded-xl border-2 px-2 border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px]`}
        >
          <div className="rounder-full py-2">
            <img
              className="w-12 h-12 rounded-full"
              src={userData?.data?.avatar || avatarimg}
              alt={user?.role?.toLowerCase()}
            />
          </div>
          <div>
            <div className="flex gap-2 items-center">
              {" "}
              <h2 className="capitalize text-[16px] font-bold">{user.name}</h2>
              <h2 className="uppercase text-[12px] bg-primary/5 backdrop-blur-[2px] p-[2px]">
                {user.role}
              </h2>
            </div>
            <h2 className="capitalize text-[14px] font-semibold">
              {user.address}
            </h2>
          </div>
        </div>
        {/* user information */}
        {callcenterNavigationLinks?.length > 0 &&
          callcenterNavigationLinks
            ?.filter((singleLink: any) => singleLink.key !== "settings")
            ?.map((singleLink: any, linkIndex: number) => (
              <Tooltip key={linkIndex}>
                <TooltipTrigger onClick={() => setRoute(singleLink?.key)}>
                  <Link
                    className={cn(
                      "flex items-center border h-9 rounded-lg text-muted-foreground transition-all duration-300 hover:text-foreground relative overflow-hidden cursor-pointer",
                      sidebarOpen ? "px-3 space-x-2" : "w-9 justify-center",
                      route === singleLink.key &&
                        "border-primary   transition-all duration-300 bg-primary/5"
                    )}
                    key={linkIndex}
                    to={"/" + role + "/" + singleLink?.subLinks[0]?.href}
                  >
                    {singleLink?.icon && (
                      <i>
                        {React.createElement(singleLink.icon, {
                          className: "h-5 w-5",
                        })}
                      </i>
                    )}
                    <Label
                      className={cn(
                        "absolute top-1/4 opacity-0 transition-all cursor-pointer invisible duration-0",
                        sidebarOpen &&
                          "top-1/4 left-8 opacity-100 visible duration-300"
                      )}
                      size="sm"
                    >
                      {translate(singleLink.label.bn, singleLink.label.en)}
                    </Label>
                    <span className="sr-only">{singleLink.label.en}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  className={cn(sidebarOpen && "hidden")}
                  side="right"
                >
                  {translate(singleLink.label.bn, singleLink.label.en)}
                </TooltipContent>
              </Tooltip>
            ))}
      </nav>
      <nav
        className={cn(
          "flex flex-col  gap-4 px-2 -my-[9px] sm:py-5 inset-y-0 mt-auto",
          sidebarOpen ? "mx-1.5" : "items-center"
        )}
      >
        <Tooltip>
          <TooltipTrigger
            onClick={() => setRoute("settings")}
            className={cn(
              "flex items-center border h-9 rounded-lg text-muted-foreground transition-colors hover:text-foreground relative overflow-hidden cursor-pointer",
              sidebarOpen ? "px-3 space-x-2" : "w-9 justify-center",
              route === "settings" &&
                "border-primary   transition-all duration-300 bg-primary/5"
            )}
          >
            <Settings className="h-5 w-5" />

            <Label
              className={cn(
                "absolute top-1/4 opacity-0 transition-all cursor-pointer invisible duration-0",
                sidebarOpen && "top-1/4 left-8 opacity-100 visible duration-300"
              )}
              size="sm"
            >
              {translate("সেটিংস", "Settings")}
            </Label>
            <span className="sr-only">Settings</span>
          </TooltipTrigger>
          <TooltipContent className={cn(sidebarOpen && "hidden")} side="right">
            {translate("সেটিংস", "Settings")}
          </TooltipContent>
        </Tooltip>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div>
              <Tooltip>
                <TooltipTrigger
                  className={cn(
                    "w-full flex items-center bg-destructive text-destructive-foreground h-9 rounded-lg transition-colors  relative overflow-hidden cursor-pointer",
                    sidebarOpen ? "px-3 space-x-2" : "w-9 justify-center"
                  )}
                >
                  <LuLogOut className="h-5 w-5" />

                  <Label
                    className={cn(
                      "absolute top-1/4 opacity-0 text-destructive-foreground transition-all cursor-pointer invisible duration-0",
                      sidebarOpen &&
                        "top-1/4 left-8 opacity-100 visible duration-300"
                    )}
                    size="sm"
                  >
                    {translate("লগআউট", "Logout")}
                  </Label>

                  <span className="sr-only">Logout</span>
                </TooltipTrigger>
                <TooltipContent
                  className={cn(sidebarOpen && "hidden")}
                  side="right"
                >
                  {translate("লগআউট", "Logout")}
                </TooltipContent>
              </Tooltip>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {translate("আপনি কি একদম নিশ্চিত?", "Are you absolutely sure?")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {translate(
                  "আপনি লগআউট করতে চান? আপনি আপনার সেশন শেষ করতে যাচ্ছেন।",
                  "Are you sure you want to log out? You are about to end your session."
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {translate("বাতিল করুন", "Cancel")}
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => handleLogout()}>
                {translate("নিশ্চিত করুন", "Confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </nav>
    </aside>
  );
};

export default CallcenterDashboardSidebarLargeDevice;
