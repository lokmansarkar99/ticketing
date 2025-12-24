import { IconType } from "react-icons/lib";
import {
  LuBadgeDollarSign,
  LuClipboardList,
  // LuBell,
  // LuBookOpen,
  LuContact2,
  // LuGlobe,
  // LuInfo,
  // LuSettings,
  // LuShield,
  // LuTag,
  // LuUser,
  LuUserCog,
} from "react-icons/lu";
import { INavigationLinks, reportManagementsLinks } from "../dashboardSidebarNavigation";
import { CgProfile } from "react-icons/cg";

export interface ICounterNavigationLinks {
  icon?: IconType;
  label: {
    bn: string;
    en: string;
  };
  key: string;
  href: string;
  subLinks?: INavigationLinks[];
}
const counterDashboardRootLinks = {
  icon: LuContact2,
  label: { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  key: "dashboard",
  href: "dashboard",
  subLinks: [
    {
      icon: LuUserCog,
      label: { bn: "ড্যাশবোর্ড", en: "Dashboard" },
      key: "dashboard",
      href: "dashboard",
    },
  ],
};

// CONTACTS LINKS
const counterProfileManagement = {
  icon: CgProfile,
  label: { bn: "প্রোফাইল", en: "Profile" },
  key: "profile",
  href: "profile",
  subLinks: [
    {
      icon: CgProfile,
      label: { bn: "প্রোফাইল", en: "Profile" },
      key: "profile",
      href: "profile"
    }
  ]
};
// CONTACTS LINKS
const counterDashboardReportLinks = {
  icon: LuContact2,
  label: { bn: "কোচ ভিত্তিক রিপোর্ট", en: "Coach Wise Report" },
  key: "coach-wise-report",
  href: "coach-wise-report",
  subLinks: [
    {
      icon: LuUserCog,
      label: { bn: "কোচ ভিত্তিক রিপোর্ট", en: "Coach Wise Report" },
      key: "coach-wise-report",
      href: "coach-wise-report",
    },
  ],
};
const counterDashboardTodaysReportLinks = {
  icon: LuContact2,
  label: { bn: "আজকের বিক্রয় প্রতিবেদন", en: "Today's Sales Report" },
  key: "todays-sales-report",
  href: "todays-sales-report",
  subLinks: [
    {
      icon: LuUserCog,
      label: { bn: "আজকের বিক্রয় প্রতিবেদন", en: "Today's Sales Report" },
      key: "todays-sales-report",
      href: "todays-sales-report",
    },
  ],
};
// const settingsLinks = {
//   icon: LuSettings,
//   label: { bn: "সেটিংস", en: "Settings" },
//   key: "settings",
//   href: "settings",
//   subLinks: [
//     {
//       icon: LuUser,
//       label: { bn: "ব্যবহারকারী সেটিংস", en: "User Settings" },
//       key: "user_settings",
//       href: "user_settings",
//     },
//     {
//       icon: LuShield,
//       label: { bn: "নিরাপত্তা সেটিংস", en: "Security Settings" },
//       key: "security_settings",
//       href: "security_settings",
//     },
//     {
//       icon: LuBell,
//       label: { bn: "বিজ্ঞপ্তি সেটিংস", en: "Notification Settings" },
//       key: "notification_settings",
//       href: "notification_settings",
//     },
//     {
//       icon: LuGlobe,
//       label: { bn: "ভাষা সেটিংস", en: "Language Settings" },
//       key: "language_settings",
//       href: "language_settings",
//     },
//     {
//       icon: LuInfo,
//       label: { bn: "অ্যাপ্লিকেশন তথ্য", en: "Application Info" },
//       key: "application_info",
//       href: "application_info",
//     },
//     {
//       icon: LuBookOpen,
//       label: { bn: "পরিচিতি", en: "About" },
//       key: "about",
//       href: "about",
//     },
//     {
//       icon: LuTag,
//       label: { bn: "সংস্করণ", en: "Version" },
//       key: "version",
//       href: "version",
//     },
//   ],
// };

const migrateSeat = {
  icon: LuClipboardList,
  label: { bn: "মাইগ্রেট সিট", en: "Migrate Seat" },
  key: "migrateSeat",
  href: "migrate-seat",
  subLinks: [
    {
      icon: LuBadgeDollarSign,
      label: { bn: "মাইগ্রেট সিট", en: "Migrate Seat" },
      key: "migrateSeat",
      href: "migrate-seat",
    },
  ],
};

export const callcenterNavigationLinks = [
  // CONTACT LINKS
  { ...counterProfileManagement },
  { ...counterDashboardRootLinks },
  { ...counterDashboardReportLinks },
  { ...counterDashboardTodaysReportLinks },
  { ...reportManagementsLinks },
   { ...migrateSeat },
  // { ...settingsLinks },
];
