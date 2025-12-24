import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { INavigationLinks } from "@/utils/constants/common/dashboardSidebarNavigation";
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
import { counterNavigationLinks } from "@/utils/constants/common/counter/counterNavigationLinks";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QuickTicketSearch from "./QuickTicketSearch";

const UpperCounterDashboardSidebarLargeDevices = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const [searchTicketInfo, setSearchTicketInfo] = useState(false);

  useEffect(() => {
    const handleOpenAndSearch = () => {
      const ticketNo = localStorage.getItem("pendingQuickSearch");
      if (ticketNo) {
        setSearchTicketInfo(true); // This opens the modal!
      }
    };

    // Listen for the event from Print button
    window.addEventListener("openQuickTicketSearch", handleOpenAndSearch);

    // Also check on mount (rare case)
    handleOpenAndSearch();

    return () => {
      window.removeEventListener("openQuickTicketSearch", handleOpenAndSearch);
    };
  }, []);

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
      <div className="flex justify-between items-center w-full py-1.5 px-6 gap-1 bg-[#666e73] max-h-[40px]">
        <div className="flex items-center">
          {counterNavigationLinks.map((item) => (
            <div
              key={item.key}
              className="relative"
              onMouseEnter={() => setHoverItem(item.key)}
              onMouseLeave={() => setHoverItem(null)}
            >
              {item.href ? (
                <Link
                  to={`/counter/${item.href}`}
                  className={`text-[12px] p-[2px] font-bold text-gray-100 hover:text-gray-200 rounded-md cursor-pointer flex items-center justify-center ${
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
                            to={`/counter/${subItem.href}`}
                            className="text-[14px] font-semibold p-2 cursor-pointer hover:bg-primary hover:text-white border-b border-b-gray-400 border-gray-200 pb-1 block"
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
                  <button className="w-full flex items-center justify-center  text-destructive-foreground rounded-lg  cursor-pointer text-[12px]">
                    {translate("লগআউট", "Logout  |")}
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
            <div className="flex text-[11px] font-semibold text-[#ffff00] uppercase">
              <p>
                <span>{user.address} </span> | <span> User Name: </span>
                {user.name}
              </p>
            </div>
          </div>
        </div>

        <Dialog
          open={searchTicketInfo}
          onOpenChange={(open: boolean) => setSearchTicketInfo(open)}
        >
          <DialogTrigger asChild>
            <Button
              className="group relative px-12 h-7 text-xs"
              variant="outline"
              size="lg"
            >
              <span className="">
                {translate("আসন অবস্থা", "Quick Ticket View")}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent size="lg" className="h-[80vh]">
            <DialogTitle className="sr-only">Quick Ticket View</DialogTitle>
            <QuickTicketSearch searchTicketInfo={searchTicketInfo} setSearchTicketInfo={setSearchTicketInfo}/>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UpperCounterDashboardSidebarLargeDevices;
