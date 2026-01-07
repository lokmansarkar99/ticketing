import {
  AlertDialog,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { publicNavigationLinks } from "@/utils/constants/common/publicNavigation";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { shareWithCookies } from "@/utils/helpers/shareWithCookies";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { useLocaleContext } from "@/utils/hooks/useLocaleContext";
import { useEffect, useState } from "react";
import { LuUserCircle } from "react-icons/lu";
import { Link, NavLink, useNavigate } from "react-router-dom";
import PageTransition from "../effect/PageTransition";
import SectionWrapper from "../wrapper/SectionWrapper";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import PublicNavigationMobile from "./PublicNavigationMobile";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import ButtonLoader from "../typography/ButtonLoader";
const PublicNavigation = () => {
  const { locale } = useLocaleContext();
  const navigate = useNavigate();
  const { translate, locale: language } = useCustomTranslator();
  const { role, phone, avatar } = shareAuthentication();
  const publicLinks = publicNavigationLinks[locale] as any;
  const [selected, setSelected] = useState(publicLinks[0].key);
  const { data: cmsData, isLoading } = useGetSingleCMSQuery({});
  const logo = cmsData?.data?.companyLogo ?? "";
  const logobangla = cmsData?.data?.companyLogoBangla ?? "";
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    window.addEventListener("scroll", () => setScrollY(window.scrollY));
    return () => {
      window.removeEventListener("scroll", () => setScrollY(window.scrollY));
    };
  }, []);

  // LOGOUT HANDLER
  const handleLogout = async () => {
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <section
      className={`w-full fixed bg-white left-0 dark:bg-[#1f2128] top-[28px] z-50 from-primary/5  ${
        scrollY > 0 &&
        " dark:bg-[#1f2128] dark:border-b dark:border-secondary shadow-md"
      }`}
    >
      <nav
        className={`max-w-7xl mx-auto px-2 md:px-4 py-2 hidden lg:block  transition-all`}
      >
        <PageTransition>
          <SectionWrapper
            className={cn(
              "my-0 flex flex-row items-center justify-between",
              useFontShifter()
            )}
          >
            <Link to={"/"}>
              {isLoading ? (
                <>
                  <ButtonLoader />
                </>
              ) : (
                <>
                  {" "}
                  {language === "en" ? (
                    <img className="h-[60px]" src={logo} alt="logo" />
                  ) : (
                    <img className="h-[60px]" src={logobangla} alt="logo" />
                  )}
                </>
              )}
            </Link>
            <div className="flex items-center gap-x-2">
              {publicLinks.map((singleLink: any) => (
                <NavLink
                  to={singleLink.href}
                  key={singleLink.key}
                  className={({ isActive }) =>
                    isActive
                      ? " border-b-2 mx-2 px-1 border-secondary text-[#ed1c24]"
                      : "hover:bg-primary/15 mx-2  dark:text-gray-200"
                  }
                  onClick={() => setSelected(singleLink?.key)}
                >
                  <button
                    className={`${
                      selected === singleLink?.key
                        ? " text-[#ed1c24] font-bold"
                        : "hover:bg-primary/15  dark:text-gray-200"
                    } text-sm transition-colors py-0.5 px-1  dark:text-gray-200 relative flex items-center gap-2`}
                  >
                    <span
                      className={cn(
                        "relative z-10 leading-5 py-0.5 flex text-[15px] font-semibold justify-center items-center",
                        selected === singleLink?.key && ""
                      )}
                    >
                      {singleLink?.label}
                    </span>
                    {/* {selected === singleLink?.key && (
                      <motion.span
                        layoutId="pill-tab"
                        transition={{ type: "spring", duration: 0.5 }}
                        className="absolute inset-0 z-0 bg-secondary text-primary-foreground rounded-full"
                      ></motion.span>
                    )} */}
                  </button>
                </NavLink>
              ))}
            </div>
            <div>
              <Link to="customer-auth">
                <button className="text-sm transition-colors text-white bg-[#ed1c24] px-2.5 py-1 relative flex items-center">
                  {translate("লগইন", "SignIn/Register")}
                </button>
              </Link>
            </div>
            <ul className="flex items-center gap-x-6">
              <li>
                <LocaleSwitcher />
              </li>
              <li>
                <ThemeSwitcher />
              </li>
              <li>
                {phone ? (
                  // ✅ Phone exists → Show My Profile + Logout
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="size-9" variant="ghost" size="icon">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt="Avatar"
                            className="overflow-hidden rounded-full size-5 border"
                          />
                        ) : (
                          <LuUserCircle className="size-[22px]" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        {translate("আমার একাউন্ট", "My Account")}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link to="/profile/order-list">
                          {translate("আমার প্রোফাইল", "My Profile")}
                        </Link>
                      </DropdownMenuItem>

                      <AlertDialog>
                        <AlertDialogTrigger
                          className={cn(
                            "w-full flex bg-destructive text-destructive-foreground hover:bg-destructive/90 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive focus:text-bg-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                          )}
                        >
                          <span className="ml-0.5">
                            {translate("লগআউট", "Logout")}
                          </span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {translate(
                                "আপনি কি একদম নিশ্চিত?",
                                "Are you absolutely sure?"
                              )}
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : role ? (
                  // ✅ Role exists → Show Dashboard, Settings, Logout
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="size-9" variant="ghost" size="icon">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt="Avatar"
                            className="overflow-hidden rounded-full size-5 border"
                          />
                        ) : (
                          <LuUserCircle className="size-[22px]" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        {translate("আমার একাউন্ট", "My Account")}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={role + "/dashboard"}>
                          {translate("ড্যাশবোর্ড", "Dashboard")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={role + "/settings"}>
                          {translate("সেটিংস", "Settings")}
                        </Link>
                      </DropdownMenuItem>

                      <AlertDialog>
                        <AlertDialogTrigger
                          className={cn(
                            "w-full flex bg-destructive text-destructive-foreground hover:bg-destructive/90 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive focus:text-bg-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                          )}
                        >
                          <span className="ml-0.5">
                            {translate("লগআউট", "Logout")}
                          </span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {translate(
                                "আপনি কি একদম নিশ্চিত?",
                                "Are you absolutely sure?"
                              )}
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // ✅ Neither phone nor role → Show Login button
                  <div className="flex gap-1">
                    <Link to="login">
                      <Button
                        size={"xs"}
                        className="text-sm transition-colors bg-[#ed1c24] px-2.5 py-1 rounded-full relative flex items-center"
                      >
                        {translate("অ্যাডমিন", "Admin")}
                      </Button>
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </SectionWrapper>
        </PageTransition>
      </nav>
      <div className="block lg:hidden">
        <PublicNavigationMobile />
      </div>
    </section>
  );
};

export default PublicNavigation;
