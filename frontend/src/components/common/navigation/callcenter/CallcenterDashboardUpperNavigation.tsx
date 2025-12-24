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
import { FC, useState } from "react";
import { LuUserCircle } from "react-icons/lu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logocompany from "../../../../assets/longeng.png";

import {
  selectCounterSearchFilter,
  setBookedSeatList,
  setCoachType,
  setCounterId,
  setDate,
  setDestinationCounterId,
  setFromCounterId,
  setOrderType,
  setReturnDate,
  setUserId,
} from "@/store/api/counter/counterSearchFilterSlice";
// import {
//   ICounterNavigationLinks,
// } from "@/utils/constants/common/counter/counterNavigationLinks";
// import { useAppContext } from "@/utils/hooks/useAppContext";
import { useDispatch, useSelector } from "react-redux";
// import PageTransition from "../../effect/PageTransition";
// import { Label } from "../../typography/Label";
import LocaleSwitcher from "../LocaleSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import CallcenterDashboardSidebarSmallDevices from "./CallcenterDashboardSidebarSmallDevices";
// import { callcenterNavigationLinks } from "@/utils/constants/common/callcenter/callcenterNavigationLinks";
import CallcenterTickitSearchDashboard from "./CallcenterTickitSearchDashboard";
import { reportManagementsLinks } from "@/utils/constants/common/dashboardSidebarNavigation";

const CallcenterDashboardUpperNavigation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //const location = useLocation();
  // const { route } = useAppContext();
  const { translate } = useCustomTranslator();
  const { role, avatar } = shareAuthentication();
  const dispatch = useDispatch();
  const [showSearchDashboard, setShowSearchDashboard] = useState(false);
  // const subNavigation = callcenterNavigationLinks?.find(
  //   (singleSubNavigation: ICounterNavigationLinks) =>
  //     singleSubNavigation.key === route
  // ) as any;
  const bookingState = useSelector(selectCounterSearchFilter);

  const setBookingState = (newState: any) => {
    if (newState.fromStationId !== undefined) {
      dispatch(setFromCounterId(newState.fromStationId));
    }
    if (newState.toStationId !== undefined) {
      dispatch(setDestinationCounterId(newState.toStationId));
    }
    if (newState.counterId !== undefined) {
      dispatch(setCounterId(newState.counterId));
    }
    if (newState.userId !== undefined) {
      dispatch(setUserId(newState.userId));
    }
    if (newState.bookedSeatList !== undefined) {
      dispatch(setBookedSeatList(newState.bookedSeat))
    }
    if (newState.coachType !== undefined) {
      dispatch(setCoachType(newState.coachType));
    }
    if (newState.date !== undefined) {
      dispatch(setDate(newState.date));
    }
    if (newState.returnDate !== undefined) {
      dispatch(setReturnDate(newState.returnDate));
    }
    if (newState.orderType !== undefined) {
      dispatch(setOrderType(newState.orderType));
    }
  };
  return (
    <header className="sticky  !h-20 md:!bg-[#b642c5] !bg-muted/70 backdrop-blur-md !w-[98.7%] ml-[13px] rounded-md top-[7px] z-30 flex items-center gap-4 !px-2 sm:border-0 sm:bg-transparent transition-all duration-300">
      <div className="lg:hidden block">
        <img src={logocompany} />
      </div>
      <nav className=" w-full flex justify-between items-center gap-1">
        <div className=" w-full flex items-center gap-1">
          {/* <ul className="hidden lg:flex gap-x-2 items-center">
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
          </ul> */}

          <ul className="hidden lg:block">
            {/* <li className="mt-2">
              <select
                className="ml-2 px-2 py-1 border rounded-md text-sm bg-background"
                onChange={(e) => {
                  const selectedHref = e.target.value;
                  if (selectedHref) {
                    navigate(`/${role}/${selectedHref}`);
                  }
                }}
              >
                {reportManagementsLinks.subLinks?.map((subLink, index) => (
                  <option key={index} value={subLink.href}>
                    {translate(subLink.label.bn, subLink.label.en)}
                  </option>
                ))}
              </select>
            </li> */}
            <li className="mt-2  flex items-center gap-2">
              {
                location.pathname === "/callcenter/user_wise_sales_summary"
                  || location.pathname === "/callcenter/user_wise_sales"
                  || location.pathname === "/callcenter/all_counter_user_wise_sales"
                  || location.pathname === "/callcenter/coach_wise_sales"
                  || location.pathname === "/callcenter/coach_wise_summary"
                  ? <select
                    className="ml-2 mb-2 px-2 py-1 border rounded-md text-sm bg-background"
                    onChange={(e) => {
                      const selectedHref = e.target.value;
                      if (selectedHref) {
                        navigate(`/${role}/${selectedHref}`);
                      }
                    }}
                  >
                    {reportManagementsLinks.subLinks?.map((subLink, index) => (
                      <option key={index} value={subLink.href}>
                        {translate(subLink.label.bn, subLink.label.en)}
                      </option>
                    ))}
                  </select>
                  : <CallcenterTickitSearchDashboard
                    bookingState={bookingState}
                    setBookingState={setBookingState}
                  />
              }
              {/* <select
                className="ml-2 mb-2 px-2 py-1 border rounded-md text-sm bg-background"
                onChange={(e) => {
                  const selectedHref = e.target.value;
                  if (selectedHref) {
                    navigate(`/${role}/${selectedHref}`);
                  }
                }}
              >
                {reportManagementsLinks.subLinks?.map((subLink, index) => (
                  <option key={index} value={subLink.href}>
                    {translate(subLink.label.bn, subLink.label.en)}
                  </option>
                ))}
              </select>
              <CallcenterTickitSearchDashboard
                bookingState={bookingState}
                setBookingState={setBookingState}
              /> */}
            </li>
          </ul>

          <ul className="block lg:hidden relative">
            <li className="inline-flex items-center">
              <button
                onClick={() => setShowSearchDashboard(!showSearchDashboard)}
                className="md:px-6 px-4 md:text-base text-xm py-2 bg-primary text-white rounded-md"
              >
                {showSearchDashboard ? "Hide" : "Tickit"}
              </button>
            </li>

            {showSearchDashboard && (
              <div className="absolute top-full left-0 mt-5 w-full">
                <CallcenterTickitSearchDashboard
                  bookingState={bookingState}
                  setBookingState={setBookingState}
                />
              </div>
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
      <CallcenterDashboardSidebarSmallDevices />
    </header>
  );
};

export default CallcenterDashboardUpperNavigation;
