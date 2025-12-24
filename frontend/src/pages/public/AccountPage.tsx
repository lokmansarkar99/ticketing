"use client";
import { CircleUser } from "lucide-react";
import { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
// import { TfiControlPlay } from "react-icons/tfi";
// import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { shareWithLocal } from "@/utils/helpers/shareWithLocal";

const AccountPage = ({ children }: { children: React.ReactNode }) => {
  const { translate } = useCustomTranslator();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Extract active tab from URL pathname
  const pathSegments = location.pathname.split("/");
  const activeTab = pathSegments[pathSegments.length - 1] || "order-list";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      shareWithLocal("set", "activeAccountTab", activeTab);
    }
  }, [activeTab]);

  // const toggleMobileSidebar = () => {
  //   setMobileSidebarOpen(!mobileSidebarOpen);
  // };

  const handleTabChange = (tabId: string) => {
    shareWithLocal("set", "activeAccountTab", tabId);
    navigate(`/profile/${tabId}`);
    setMobileSidebarOpen(false);
  };

  const tabs = [
    {
      id: "order-list",
      label: translate("অর্ডার", "Order List"),
      icon: (active: boolean) => (
        <AiOutlineShoppingCart
          className={`w-5 h-5 ${
            active ? "text-white" : "text-black dark:text-white"
          }`}
        />
      ),
    },
    {
      id: "my-profile",
      label: translate("গ্রাহক তথ্য", "Profile"),
      icon: (active: boolean) => (
        <CircleUser
          className={`w-5 h-5 ${
            active ? "text-white" : "text-black dark:text-white"
          }`}
        />
      ),
    },

    {
      id: "change-password",
      label: translate("পাসওয়ার্ড পরিবর্তন", "Change Password"),
      icon: (active: boolean) => (
        <AiOutlineShoppingCart
          className={`w-5 h-5 ${
            active ? "text-white" : "text-black dark:text-white"
          }`}
        />
      ),
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-0 mb-[37px] pt-0 lg:pt-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* <Button
          variant={"outline"}
          onClick={toggleMobileSidebar}
          className="lg:hidden fixed top-24 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        >
          <TfiControlPlay
            size={20}
            className={`transition-transform duration-300 ${
              mobileSidebarOpen ? "rotate-180 text-red-500" : "text-gray-700"
            }`}
          />
        </Button> */}

        <div
          className={`fixed dark:bg-black dark:text-white lg:static inset-y-0 left-0 w-[280px] lg:w-full bg-white shadow-md rounded-md py-5 z-30 px-3 transition-transform duration-300 lg:translate-x-0 lg:col-span-3 h-[100vh] overflow-y-auto ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
          style={{ top: "80px" }}
        >
          <div className="mb-5">
            <h3 className="text-sm text-gray-500 px-2 dark:text-white">
              {translate("প্রধান মেনু", "Main menu")}
            </h3>
          </div>
          <ul className="space-y-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <li
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center h-[42px] gap-3 py-2 px-4 rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-primary dark:bg-primary dark:text-white border-gray-300 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-black dark:hover:border border-gray-300"
                  }`}
                >
                  {typeof tab.icon === "function"
                    ? tab.icon(isActive)
                    : tab.icon}
                  <span>{tab.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 -z-20 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <div className="lg:col-span-9 w-full">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
