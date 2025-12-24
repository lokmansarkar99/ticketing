import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  INavigationLinks,
} from "@/utils/constants/common/dashboardSidebarNavigation";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
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
import { callcenterNavigationLinks } from "@/utils/constants/common/callcenter/callcenterNavigationLinks";

const UpperCallcenterDashboardSidebarLargeDevice = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoverItem, setHoverItem] = useState<string | null>(null);

  // Function to handle item click
  const handleItemClick = (itemKey: string) => {
    setActiveItem(itemKey);
  };
  const { translate } = useCustomTranslator();
  const navigate = useNavigate();
  const handleLogout = async () => {
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    navigate("/login", { replace: true });
    window.location.reload();
  };
  const user = useSelector((state: any) => state.user);

  return (
    <div className="bg-[#425e66]">
      <div className="flex flex-wrap py-1.5 px-6 gap-1 bg-[#666e73] max-h-[40px]">
        {callcenterNavigationLinks.map((item) => (
          <div
            key={item.key}
            className="relative"
            onMouseEnter={() => setHoverItem(item.key)}
            onMouseLeave={() => setHoverItem(null)}
          >
            {item.href ? (
              <Link
                to={`/callcenter/${item.href}`}
                className={`text-[11px] p-[2px] text-gray-100 hover:text-gray-200 font-bold rounded-md cursor-pointer flex items-center justify-center ${
                  activeItem === item.key ? "bg-secondary px-2 text-white" : ""
                }`}
                onClick={() => handleItemClick(item.key)}
              >
                {item.label.en} |
              </Link>
            ) : (
              <p
                className={`text-[11px] p-[2px] text-gray-100 hover:text-gray-200 font-bold rounded-md cursor-pointer flex items-center justify-center ${
                  activeItem === item.key ? "bg-primary text-white" : ""
                }`}
                onClick={() => handleItemClick(item.key)}
              >
                {item.label.en} |
              </p>
              
              
            )}
            

            {/* Dropdown for items with subLinks */}
            {"subLinks" in item &&
              item?.subLinks &&
              hoverItem === item?.key && (
                <div className="absolute top-full z-[999] left-0 w-full bg-white border border-gray-400 rounded-md flex flex-col min-w-[200px]">
                  {item?.subLinks?.map((subItem: INavigationLinks) => (
                    <div key={subItem?.key}>
                      {subItem?.href ? (
                        <Link
                          to={`/callcenter/${subItem.href}`}
                          className="text-[11px] p-1 cursor-pointer hover:bg-primary hover:text-white border-b border-gray-200 pb-1 block"
                          onClick={() => handleItemClick(subItem.key)}
                        >
                          {subItem.label.en}
                        </Link>
                      ) : (
                        <p
                          className="text-[11px] p-1 cursor-pointer hover:bg-primary hover:text-white border-b border-gray-200 pb-1"
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
        <div className="items-center flex gap-3">
            {/* logout button */}
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center justify-center  text-destructive-foreground rounded-lg  cursor-pointer text-[11px]">
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
        {/* name of counter */}
         <div className="flex text-[11px] gap-1 font-semibold text-[#ffff00] uppercase">
          <p >{user.address} |</p>
          <p ><span>User Name: </span>{user.name}</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default UpperCallcenterDashboardSidebarLargeDevice;