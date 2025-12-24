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
import { Link } from "react-router-dom";
import logocompany from "../../../../assets/longeng.png";

import TickitSearchDashboard from "@/pages/dashboard/counterRole/tickit/TickitSearchDashboard";
import {
  selectCounterSearchFilter,
  setBookedSeatList,
  setCoachNo,
  setCoachType,
  setDate,
  setDestinationCounterId,
  setFromCounterId,
  setOrderType,
  setReturnDate,
  setSchedule,
} from "@/store/api/counter/counterSearchFilterSlice";
// import {
//   counterNavigationLinks,
//   ICounterNavigationLinks,
// } from "@/utils/constants/common/counter/counterNavigationLinks";
// import { useAppContext } from "@/utils/hooks/useAppContext";
import { useDispatch, useSelector } from "react-redux";
// import PageTransition from "../../effect/PageTransition";
// import { Label } from "../../typography/Label";
import LocaleSwitcher from "../LocaleSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import CounterDashboardSidebarSmallDevices from "./CounterDashboardSidebarSmallDevices";

const CounterDashboardUpperNavigation: FC = () => {
  //const location = useLocation();
  // const { route } = useAppContext();
  const { translate } = useCustomTranslator();
  const { role, avatar } = shareAuthentication();
  const dispatch = useDispatch();
  const [showSearchDashboard, setShowSearchDashboard] = useState(false);
  // const subNavigation = counterNavigationLinks?.find(
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
    if (newState.bookedSeatList !== undefined) {
      dispatch(setBookedSeatList(newState.bookedSeat));
    }
    if (newState.coachNo !== undefined) {
      dispatch(setCoachNo(newState.coachNo));
    }
    if (newState.coachType !== undefined) {
      dispatch(setCoachType(newState.coachType));
    }
    if (newState.schedule !== undefined) {
      dispatch(setSchedule(newState.schedule));
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
    <header className="sticky  !h-20 md:!bg-[#c004d4] !bg-muted/70 backdrop-blur-md top-[0px] z-30 flex items-center gap-4 !px-2 sm:border-0 sm:bg-transparent transition-all duration-300">
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

          <div className="hidden lg:block ">
            <ul className="flex items-center gap-1">
              <li className="mt-2">
                <TickitSearchDashboard
                  bookingState={bookingState}
                  setBookingState={setBookingState}
                />
              </li>
            </ul>
          </div>
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
                <TickitSearchDashboard
                  bookingState={bookingState}
                  setBookingState={setBookingState}
                />
              </div>
            )}
          </ul>
        </div>

        <ul className="flex gap-x-2 items-center justify-end ">
          {/* <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex justify-start py-2 h-8 mr-5"
                size="sm"
              >
                Find Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1200px] max-h-[90%] overflow-y-auto">

              <CounterFindTicket />
            </DialogContent>
          </Dialog> */}
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
      <CounterDashboardSidebarSmallDevices />
    </header>
  );
};

export default CounterDashboardUpperNavigation;
