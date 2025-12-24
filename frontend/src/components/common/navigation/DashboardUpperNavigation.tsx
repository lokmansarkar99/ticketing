// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";
// import { openModal } from "@/store/api/user/coachConfigModalSlice";
// import ModalSystem from "@/utils/constants/common/commonModal/ModalSystem";
// import {
//   adminNavigationLinks,
//   INavigationLinks,
// } from "@/utils/constants/common/dashboardSidebarNavigation";
// import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
// import { useAppContext } from "@/utils/hooks/useAppContext";
// import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
// import { FC, useState } from "react";
// import { LuUserCircle } from "react-icons/lu";
// import { useDispatch } from "react-redux";
// import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import logocompany from "../../../assets/longeng.png";
// import DashboardSidebarSmallDevices from "./DashboardSidebarSmallDevices";
// import LocaleSwitcher from "./LocaleSwitcher";
// import ThemeSwitcher from "./ThemeSwitcher";
// interface IDashboardUpperNavigationProps { }

// const DashboardUpperNavigation: FC<IDashboardUpperNavigationProps> = () => {
//   const location = useLocation();
//   const { route } = useAppContext();
//   const { translate } = useCustomTranslator();
//   const { role, avatar } = shareAuthentication();
//   //const [paymentOpen, setPaymentOpen] = useState<boolean>(false);
//   const navigate = useNavigate();
//   //modal work
//   const dispatch = useDispatch();
//   const [activeModal, setActiveModal] = useState<string | null>(null);

//   // Find the sub-navigation links
//   const subNavigation = adminNavigationLinks.find(
//     (singleSubNavigation) => singleSubNavigation.key === route
//   );

//   const handleLinkClick = (subLink: INavigationLinks) => {
//     if (subLink.action === "openModal") {
//       dispatch(openModal());
//     } else if (subLink.modalComponent) {
//       setActiveModal(subLink.modalComponent);
//     }
//   };

//   return (
//     <header className="sticky !h-14 md:!bg-muted/30 !bg-muted/70 backdrop-blur-md !w-[98.7%] ml-[13px] rounded-md top-0 z-30 flex items-center gap-4 !px-2 sm:border-0 sm:bg-transparent transition-all  duration-300">
//       {/* NAVIGATION LINKS s*/}
//       <div className="lg:hidden block">
//         <img src={logocompany} />
//       </div>
//       <nav className="justify-between w-full flex">
//         <ul className="hidden lg:flex gap-x-2 items-center ">
//           {subNavigation?.key !== "reports" &&
//             subNavigation?.subLinks?.map((subLink, index) => {
//               return (
//                 <li key={index}>
//                   {
//                     //@ts-ignore
//                     subLink.action ? (
//                       <button
//                         onClick={() => handleLinkClick(subLink)}
//                         className="btn btn-primary"
//                       >
//                         {translate(subLink.label.bn, subLink.label.en)}
//                       </button>
//                     ) : //@ts-ignore
//                       subLink.modalComponent ? (
//                         <button
//                           onClick={() => handleLinkClick(subLink)}
//                           className="btn btn-link"
//                         >
//                           {translate(subLink.label.bn, subLink.label.en)}
//                         </button>
//                       ) : (
//                         <NavLink
//                           to={"/" + role + "/" + subLink.href}
//                           className={({ isActive }) =>
//                             isActive ? "active_link_tab" : "inactive_link"
//                           }
//                         >
//                           {translate(subLink.label.bn, subLink.label.en)}
//                         </NavLink>
//                       )
//                   }
//                 </li>
//               )
//             })}
//           {subNavigation?.key === "reports" && (
//             <select
//               className="ml-2 px-2 py-1 border rounded-md text-sm bg-background"
//               onChange={(e) => {
//                 const selectedHref = e.target.value;
//                 if (selectedHref) {
//                   navigate(`/${role}/${selectedHref}`);
//                 }
//               }}
//             >
//               {subNavigation.subLinks?.map((subLink, index) => (
//                 <option key={index} value={subLink.href}>
//                   {translate(subLink.label.bn, subLink.label.en)}
//                 </option>
//               ))}
//             </select>
//           )}
//         </ul>

//         <ul className="flex gap-x-2 items-center">
//           <li>
//             <LocaleSwitcher />
//           </li>
//           <li>
//             <ThemeSwitcher />
//           </li>
//           <li>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button className="size-9" variant="ghost" size="icon">
//                   {avatar ? (
//                     <img
//                       src={avatar}
//                       alt="Avatar"
//                       className="overflow-hidden rounded-full size-5 border"
//                     />
//                   ) : (
//                     <LuUserCircle className="size-[22px]" />
//                   )}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>
//                   {translate("আমার প্রোফাইল", "My Account")}
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   asChild
//                   className={cn(
//                     location.pathname.includes("profile") &&
//                     "bg-accent text-accent-foreground hover:bg-accent/90"
//                   )}
//                 >
//                   <Link to={"../" + role + "/dashboard"}>
//                     {translate("প্রোফাইল", "Profile")}
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link to={"/"}>{translate("হোম", "Home")}</Link>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </li>
//         </ul>
//       </nav>
//       {/* DASHBOARD SIDEBAR FOR SMALL DEVICES */}
//       <DashboardSidebarSmallDevices />
//       <ModalSystem activeModal={activeModal} setActiveModal={setActiveModal} />
//     </header>
//   );
// };

// export default DashboardUpperNavigation;
