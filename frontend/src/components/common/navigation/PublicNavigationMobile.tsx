import { useEffect, useState } from "react";
import logobangla from "../../../assets/logobangla.png";
import logo from "../../../assets/longeng.png";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { publicNavigationLinksMobile } from "@/utils/constants/common/publicNavigation";
import { useLocaleContext } from "@/utils/hooks/useLocaleContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { shareWithCookies } from "@/utils/helpers/shareWithCookies";
import SidebarSlide from "./SidebarSlide";
import LocaleSwitcher from "./LocaleSwitcher";
import { FiLogIn } from "react-icons/fi";
import ThemeSwitcher from "./ThemeSwitcher";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { FaCircleUser } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
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
import { cn } from "@/lib/utils";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import AddReservePublic from "@/pages/public/AddReservePublic";
// import { IReserveStateProps } from "@/pages/dashboard/admin/reserve/ReserveList";
// import { RiReservedFill } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuUserCircle } from "react-icons/lu";
import { FaList } from "react-icons/fa";
import { MdOutlineChangeCircle } from "react-icons/md";

const PublicNavigationMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [reserveState, setReserveState] = useState<IReserveStateProps>({
  //   search: "",
  //   addReserveOpen: false,
  //   reserveList: [],
  //   calenderFromOpen: false,
  //   calenderToOpen: false,
  //   fromDate: null,
  //   toDate: null,
  //   fromDateTime: null,
  //   toDateTime: null,
  //   isPrinting: false,
  // });
  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };
  const { locale } = useLocaleContext();
  const navigate = useNavigate();
  const { translate, locale: language } = useCustomTranslator();
  const { role, avatar, phone } = shareAuthentication();
  const publicLinks = publicNavigationLinksMobile[locale] as any;

  const [selected, setSelected] = useState(publicLinks[0].key);

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
    navigate("/login", { replace: true });
    window.location.reload();
  };

  return (
    <>
      <div
        className={`w-full  bg-gradient-to-tr from-primary/5 to-tertiary/5 duration-1000 py-1.5 fixed left-0 top-7  z-40 transition-all ${
          scrollY > 0 && "bg-white dark:bg-[#1f2128]"
        }`}
      >
        <div className="flex justify-between items-center px-5">
          <Link to={"/"}>
            {language === "en" ? (
              <img className="w-[80px]" src={logo} alt="logo" />
            ) : (
              <img className="w-[80px]" src={logobangla} alt="logo" />
            )}
          </Link>

          <div className="flex justify-end">
            <ul className="flex justify-center items-center mx-3">
              <li>
                <LocaleSwitcher />
              </li>
              <li>
                <ThemeSwitcher />
              </li>
            </ul>
            <>
              {" "}
              <button onClick={toggleMenu}>
                <RxHamburgerMenu className="text-secondary text-2xl dark:text-[#f5f5f5]" />
              </button>
            </>
          </div>
        </div>
        <SidebarSlide isMenuOpen={isMenuOpen}>
          <div
            key="menu"
            className={`pb-10 bg-gray-100 dark:bg-[#1f2128] h-[100vh] mt-10 overflow-y-auto
             `}
          >
            <div className="shadow-sm hover:text-primary-100 min-h-screen mt-4 text-center">
              <nav>
                <ul className="flex flex-col justify-center gap-5">
                  {publicLinks.map((singleLink: any) => (
                    <NavLink
                      to={singleLink.href}
                      key={singleLink.key}
                      className={({ isActive }) =>
                        isActive ? "text-primary" : ""
                      }
                      onClick={() => setSelected(singleLink?.key)}
                    >
                      <button
                        className={`${
                          selected === singleLink?.key ? "text-primary text-sm" : ""
                        } text-sm w-11/12 rounded-md transition-colors border px-2.5 py-0.5 gap-2`}
                      >
                        <span
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            "relative z-10 leading-5 px-1.5 text-sm py-1 flex justify-start items-center",
                            selected === singleLink?.key && "text-primary"
                          )}
                        >
                          {<singleLink.icon className="mr-2 text-lg" />}
                          {singleLink?.label}
                        </span>
                        {/* {selected === singleLink?.key && (
                          <motion.span
                            layoutId="pill-tab"
                            transition={{ type: "spring", duration: 0.5 }}
                            className="absolute inset-0 z-0 bg-gradient-to-tr from-primary to-tertiary text-primary-foreground rounded-full"
                          ></motion.span>
                        )} */}
                      </button>
                    </NavLink>
                  ))}
                  {/* <Dialog
                    open={reserveState.addReserveOpen}
                    onOpenChange={(open: boolean) =>
                      setReserveState((prevState: IReserveStateProps) => ({
                        ...prevState,
                        addReserveOpen: open,
                      }))
                    }
                  >
                    <DialogTrigger asChild>
                      <span className="text-black cursor-pointer text-[16px] w-11/12 rounded-md transition-colors border py-1.5 px-5 dark:text-white flex items-center gap-2">
                        <RiReservedFill size={16} /> Reserve
                      </span>
                    </DialogTrigger>
                    <DialogContent size="lg">
                      <DialogTitle className="sr-only">empty</DialogTitle>
                      <AddReservePublic />
                    </DialogContent>
                  </Dialog> */}
                  
                    {phone ? (
                      <li className="flex flex-col justify-center">
                        <div className="border py-1.5  rounded-sm w-11/12 mx-auto">
                          <Link to="/profile/my-profile">
                            <span
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center text-sm gap-2 px-4"
                            >
                              <FaCircleUser className="text-base" />
                              {translate("আমার প্রোফাইল", "My Profile")}
                            </span>
                          </Link>
                        </div>
                        <div className="border py-1.5  rounded-sm w-11/12 mt-5 mx-auto">
                          <Link to="/profile/order-list">
                            <span
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-2 text-sm px-4"
                            >
                              <FaList size={15} />
                              {translate("অর্ডার লিস্ট", "Order List")}
                            </span>
                          </Link>
                        </div>
                        <div className="border py-1.5  rounded-sm w-11/12 mt-5 mx-auto">
                          <Link to="/profile/change-password">
                            <span
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center text-sm gap-2 px-4"
                            >
                              <MdOutlineChangeCircle size={20}/>
                              {translate(
                                "পাসওয়ার্ড পরিবর্তন",
                                "Change Password"
                              )}
                            </span>
                          </Link>
                        </div>
                        <div className="mt-4 rounded-sm w-11/12 mx-auto">
                          <AlertDialog>
                            <AlertDialogTrigger
                              className={cn(
                                "w-full flex bg-destructive text-destructive-foreground hover:bg-destructive/90 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive focus:text-bg-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              )}
                            >
                              <div className="flex items-center gap-2 px-4">
                                <LuLogOut />
                                {translate("লগআউট", "Logout")}
                              </div>
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
                                <AlertDialogAction
                                  onClick={() => handleLogout()}
                                >
                                  {translate("নিশ্চিত করুন", "Confirm")}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </li>
                    ) : role ? (
                      // ✅ Role exists → Show Dashboard, Settings, Logout
                      <DropdownMenu >
                        <DropdownMenuTrigger asChild className="mx-3">
                          <Button
                            className="size-9"
                            variant="ghost"
                            size="icon"
                          >
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
                        <DropdownMenuContent align="center" className="z-[99999] mx-5">
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
                                <AlertDialogAction
                                  onClick={() => handleLogout()}
                                >
                                  {translate("নিশ্চিত করুন", "Confirm")}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      // ✅ Neither phone nor role → Show Login button
                     <>
                      <Link to="customer-auth">
                        <button
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center px-5 mx-auto gap-2 bg-primary text-white border py-1.5  rounded-sm w-11/12"
                        >
                          <FiLogIn size={18} />
                          {translate("লগইন", "Login")}
                        </button>
                      </Link>
                      <Link to="login">
                        <button
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center px-5 mx-auto gap-2 bg-primary text-white border py-1.5  rounded-sm w-11/12"
                        >
                          <FiLogIn size={18} />
                          {translate("অ্যাডমিন", "Admin")}
                        </button>
                      </Link>
                     </>
                    )}
                </ul>
              </nav>
            </div>
            <button onClick={toggleMenu} className="absolute top-3 right-3">
              <RxCross2 className="text-secondary dark:text-[#f5f5f5] text-2xl" />
            </button>
          </div>
        </SidebarSlide>
      </div>
      {/* Blur Background */}
      <div
        className={`${
          isMenuOpen
            ? "fixed inset-0 bg-black/50 backdrop-blur-md z-10"
            : "hidden"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default PublicNavigationMobile;
