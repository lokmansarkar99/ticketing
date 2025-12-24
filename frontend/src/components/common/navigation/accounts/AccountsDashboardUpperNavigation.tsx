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

import {
  accountsNavigationLinks,
  IAccountsNavigationLinks,
} from "@/utils/constants/common/accounts/accountsNavigationLinks";
import ModalSystem from "@/utils/constants/common/commonModal/ModalSystem";
import LocaleSwitcher from "../LocaleSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import AccountsDashboardSidebarSmallDevices from "./AccountsDashboardSidebarSmallDevices";
interface IAccountsDashboardUpperNavigationProps {}

const AccountsDashboardUpperNavigation: FC<
  IAccountsDashboardUpperNavigationProps
> = () => {
  const location = useLocation();
  const { route } = useAppContext();
  const { translate } = useCustomTranslator();
  const { role, avatar } = shareAuthentication();
  const subNavigation = accountsNavigationLinks?.find(
    (singleSubNavigation: IAccountsNavigationLinks) =>
      singleSubNavigation.key === route
  ) as any;
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleLinkClick = (subLink: IAccountsNavigationLinks) => {
    if (subLink.modalComponent) {
      setActiveModal(subLink.modalComponent); // Open modal
    }
  };
  return (
    <header className="sticky !h-14 md:!bg-muted/30 !bg-muted/70 backdrop-blur-md !w-[98.7%] ml-[13px] rounded-md top-[7px] z-30 flex items-center gap-4 !px-2 sm:border-0 sm:bg-transparent transition-all  duration-300">
      {/* NAVIGATION LINKS */}
      <div className="lg:hidden block">
        <img src={logocompany} />
      </div>
      <nav className="justify-between w-full flex">
        <ul className="hidden lg:flex gap-x-1 items-center">
          {subNavigation?.subLinks?.length > 0 &&
            subNavigation?.subLinks?.map(
              (subLink: IAccountsNavigationLinks, index: number) => (
                <li key={index}>
                  {
                    //@ts-ignore
                    subLink.action ? (
                      <button
                        onClick={() => handleLinkClick(subLink)}
                        className="btn btn-primary"
                      >
                        {translate(subLink.label.bn, subLink.label.en)}
                      </button>
                    ) : //@ts-ignore
                    subLink.modalComponent ? (
                      <button
                        onClick={() => handleLinkClick(subLink)}
                        className="btn btn-primary  px-3 py-1"
                      >
                        {translate(subLink.label.bn, subLink.label.en)}
                      </button>
                    ) : (
                      <NavLink
                        to={"/" + role + "/" + subLink.href}
                        className={({ isActive }) =>
                          isActive
                            ? "h-9 flex items-center justify-center  border-[1px] border-primary cursor-pointer rounded-md font-[400]  transition-all duration-300 bg-primary/5 px-3 text-[12px]"
                            : "flex  items-center justify-center h-9 cursor-pointer border-[1px] border-transparent  font-[400] transition-all duration-300 px-3 text-[15px]"
                        }
                      >
                        {translate(subLink.label.bn, subLink.label.en)}
                      </NavLink>
                    )
                  }
                </li>
              )
            )}
        </ul>
        <ul className="flex gap-x-2 items-center">
          <li>
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
      <AccountsDashboardSidebarSmallDevices />
      <ModalSystem activeModal={activeModal} setActiveModal={setActiveModal} />
    </header>
  );
};

export default AccountsDashboardUpperNavigation;
