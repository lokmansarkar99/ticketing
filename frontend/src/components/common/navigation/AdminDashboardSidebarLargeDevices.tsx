import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  adminNavigationLinks,
  INavigationLinks,
} from "@/utils/constants/common/dashboardSidebarNavigation";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import logobangla from "../../../assets/logobangla.png";
import logoeng from "../../../assets/longeng.png";
import { useSelector } from "react-redux";
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
import { shareWithCookies } from "@/utils/helpers/shareWithCookies";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";

const AdminDashboardSidebarLargeDevices = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoverItem, setHoverItem] = useState<string | null>(null);

  // Function to handle item click
  const handleItemClick = (itemKey: string) => {
    setActiveItem(itemKey);
  };
  const { translate, locale } = useCustomTranslator();
  const navigate = useNavigate();
  const handleLogout = async () => {
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    navigate("/login", { replace: true });
    window.location.reload();
  };
  const user = useSelector((state: any) => state.user);

  return (
    <div className="bg-[#425e66] pb-2 mb-4">
      <div className="flex justify-end gap-10">
        <div className="text-[10px] w-[60%] flex gap-2 justify-end text-white font-semibold">
          <span>Date: </span>{" "}
          <span className="text-[#b0e0e6]">
            {new Date().toLocaleDateString("en-ED", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex justify-end w-[40%] gap-2 text-xs px-3 pt-1">
          <p className="text-white">Welcome</p>
          <p className="capitalize font-bold text-[#b0e0e6]">{user.name}</p>
        </div>
      </div>
      <div className="flex justify-between items-center px-6">
        <div className="bg-white mb-2">
          <Link to={"/"} className={` flex flex-col gap-2`}>
            {locale === "en" ? (
              <img className="w-24 h-10" src={logoeng} alt="logo" />
            ) : (
              <img className="w-24 h-10" src={logobangla} alt="logo" />
            )}
          </Link>
        </div>

        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center justify-center  text-destructive-foreground rounded-lg  cursor-pointer text-xs">
                {translate("লগআউট", "Logout")}
              </button>
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
        </div>
      </div>
      <div className="relative px-6">
        {/* Background bar behind first line */}
        <div className="absolute top-0 left-0 w-full h-[24px] bg-[#666e73] pointer-events-none z-0" />

        {/* Navigation items */}
        <div className="relative flex flex-wrap gap-1 h-auto z-10">
          {adminNavigationLinks.map((item) => (
            <div
              key={item.key}
              className="relative"
              onMouseEnter={() => setHoverItem(item.key)}
              onMouseLeave={() => setHoverItem(null)}
            >
              {item.href ? (
                <Link
                  to={`/admin/${item.href}`}
                  className={`text-xs p-[2px] text-gray-100 hover:text-gray-200 font-bold rounded-md cursor-pointer flex items-center justify-center ${
                    activeItem === item.key
                      ? "bg-secondary px-2 text-white"
                      : ""
                  }`}
                  onClick={() => handleItemClick(item.key)}
                >
                  {item.label.en} |
                </Link>
              ) : (
                <p
                  className={`text-xs p-[2px] text-gray-100 hover:text-gray-200 font-bold rounded-md cursor-pointer flex items-center justify-center ${
                    activeItem === item.key ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => handleItemClick(item.key)}
                >
                  {item.label.en} |
                </p>
              )}

              {/* Absolutely position dropdowns outside of flex-wrap flow */}
              {"subLinks" in item &&
                item?.subLinks &&
                hoverItem === item?.key && (
                  <div className="absolute top-full left-0 bg-white border border-gray-400 rounded-md flex flex-col min-w-[200px] z-[9999] shadow-lg">
                    {item?.subLinks?.map((subItem: INavigationLinks) => (
                      <div key={subItem?.key}>
                        {subItem?.href ? (
                          <Link
                            to={`/admin/${subItem.href}`}
                            className="text-[10px] p-1 cursor-pointer hover:bg-primary hover:text-white border-b border-gray-200 block"
                            onClick={() => handleItemClick(subItem.key)}
                          >
                            {subItem.label.en}
                          </Link>
                        ) : (
                          <p
                            className="text-[10px] p-1 cursor-pointer hover:bg-primary hover:text-white border-b border-gray-200"
                            onClick={() => handleItemClick(subItem.key)}
                          >
                            {subItem.label.en}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSidebarLargeDevices;
