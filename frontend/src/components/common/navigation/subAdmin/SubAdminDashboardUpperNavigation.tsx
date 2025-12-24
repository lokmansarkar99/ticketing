import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import { LuUserCircle } from "react-icons/lu";
import { Link, NavLink } from "react-router-dom";
import logocompany from "../../../../assets/longeng.png";

import {
  ICounterNavigationLinks,
} from "@/utils/constants/common/counter/counterNavigationLinks";
import { useAppContext } from "@/utils/hooks/useAppContext";
import PageTransition from "../../effect/PageTransition";
import { Label } from "../../typography/Label";
import LocaleSwitcher from "../LocaleSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import SubAdminDashboardSidebarSmallDevices from "./SubAdminDashbordSmallDevices";
import { subAdminNavigationLinks } from "@/utils/constants/common/subAdmin/subAdminNavigationLinks";

const SubAdminDashboardUpperNavigation: FC = () => {
  //const location = useLocation();
  const { route } = useAppContext();
  const { translate } = useCustomTranslator();
  const { role, avatar } = shareAuthentication();
  const subNavigation = subAdminNavigationLinks?.find(
    (singleSubNavigation: ICounterNavigationLinks) =>
      singleSubNavigation.key === route
  ) as any;
 
  return (
    <header className="sticky  !h-16 md:!bg-[#c004d4] !bg-muted/70 backdrop-blur-md top-[0px] z-30 flex items-center gap-4 !px-2 sm:border-0 sm:bg-transparent transition-all duration-300">
      <div className="lg:hidden block">
        <img src={logocompany} />
      </div>
      <nav className=" w-full flex justify-between items-center gap-1">
        <div className=" w-full flex items-center gap-1">
          <ul className="hidden lg:flex gap-x-2 items-center">
            {subNavigation?.subLinks?.length > 0 &&
              subNavigation?.subLinks?.map(
                (singleNav: ICounterNavigationLinks, navIndex: number) => (
                  <li
                    className="text-white bg-primary rounded-md"
                    key={navIndex}
                  >
                    <PageTransition>
                      <NavLink
                        to={"/" + role + "/" + singleNav.href}
                        className={({ isActive, isPending }) =>
                          isPending
                            ? "pending"
                            : isActive
                            ? "active_link"
                            : "inactive_link"
                        }
                      >
                        <Label
                          className="cursor-pointer text-white text-nowrap"
                          size="sm"
                        >
                          {translate(singleNav.label.bn, singleNav.label.en)}
                        </Label>
                      </NavLink>
                    </PageTransition>
                  </li>
                )
              )}
          </ul>

        </div>

        <ul className="flex gap-x-2 items-center justify-end ">
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
                <DropdownMenuItem asChild>
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
      <SubAdminDashboardSidebarSmallDevices />
    </header>
  );
};

export default SubAdminDashboardUpperNavigation;
