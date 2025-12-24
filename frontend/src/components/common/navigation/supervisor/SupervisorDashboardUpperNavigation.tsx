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
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useAppContext } from "@/utils/hooks/useAppContext";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useState } from "react";
import { LuUserCircle } from "react-icons/lu";
import { Link, NavLink, useLocation } from "react-router-dom";
import logocompany from "../../../../assets/longeng.png";

import ModalSystem from "@/utils/constants/common/commonModal/ModalSystem";
import {
  ISupervisorNavigationLinks,
  supervisorNavigationLinks,
} from "@/utils/constants/common/supervisor/supervisorNavigationLinks";
import LocaleSwitcher from "../LocaleSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import SupervisorDashboardSidebarSmallDevices from "./SupervisorDashboardSidebarSmallDevices";
interface ISupervisorDashboardUpperNavigationProps {}

const SupervisorDashboardUpperNavigation: FC<
  ISupervisorDashboardUpperNavigationProps
> = () => {
  const location = useLocation();
  //const dispatch = useDispatch();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const { route } = useAppContext();
  const { translate } = useCustomTranslator();
  const { role, avatar } = shareAuthentication();
  const subNavigation = supervisorNavigationLinks.find(
    (singleSubNavigation) => singleSubNavigation.key === route
  );

  const handleLinkClick = (subLink: ISupervisorNavigationLinks) => {
    if (subLink.modalComponent) {
      setActiveModal(subLink.modalComponent); // Open modal
    }
  };

  return (
    <header className="sticky  !h-16 md:!bg-[#c004d4] !bg-muted/70 backdrop-blur-md top-[0px] z-30 flex items-center gap-4 !px-2 sm:border-0 sm:bg-transparent transition-all duration-300">
      {/* NAVIGATION LINKS */}
      <div className="lg:hidden block">
        <img src={logocompany} />
      </div>
      <nav className="justify-between w-full flex">
        <ul className="hidden lg:flex gap-x-2 items-center ">
          {subNavigation?.subLinks?.map((subLink: any, index: any) => (
            <li key={index}>
              {
                //@ts-ignore
                subLink.action ? (
                  <button
                    onClick={() => handleLinkClick(subLink)}
                    className="btn bg-white"
                  >
                    {translate(subLink.label.bn, subLink.label.en)}
                  </button>
                ) : //@ts-ignore
                subLink.modalComponent ? (
                  <button
                    onClick={() => handleLinkClick(subLink)}
                    className="btn bg-white border border-primary rounded-md px-3 py-1"
                  >
                    {translate(subLink.label.bn, subLink.label.en)}
                  </button>
                ) : (
                  <NavLink
                    to={"/" + role + "/" + subLink.href}
                    className={({ isActive }) =>
                      isActive ? "active_link" : "inactive_link"
                    }
                  >
                    {translate(subLink.label.bn, subLink.label.en)}
                  </NavLink>
                )
              }
            </li>
          ))}
        </ul>
        <ul className="flex gap-x-2 items-center">
          <li className="flex gap-1 items-center">
            Language
            <LocaleSwitcher />
          </li>
          <li>
            <ThemeSwitcher />
          </li>
          <li>
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
                  {translate("আমার প্রোফাইল", "My Account")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  className={cn(
                    location.pathname.includes("profile") &&
                      "bg-accent text-accent-foreground hover:bg-accent/90"
                  )}
                >
                  <Link to={"../" + role + "/dashboard"}>
                    {translate("প্রোফাইল", "Profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={"/"}>{translate("হোম", "Home")}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>
      {/* DASHBOARD SIDEBAR FOR SMALL DEVICES */}
      <SupervisorDashboardSidebarSmallDevices />
      <ModalSystem activeModal={activeModal} setActiveModal={setActiveModal} />
    </header>
  );
};

export default SupervisorDashboardUpperNavigation;
