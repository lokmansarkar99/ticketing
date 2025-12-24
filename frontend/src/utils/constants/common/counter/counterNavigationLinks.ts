import { IconType } from "react-icons/lib";
import {
  LuBus,
  LuCalendar,
  LuClipboardList,
  LuContact2,
  LuHome,
  LuUser,
  LuUserCheck,
  LuUserCog,
  LuUsers,
} from "react-icons/lu";
import { INavigationLinks } from "../dashboardSidebarNavigation";
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
      href: "profile",
    },
  ],
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
const counterDashboardSalesReportLinks = {
  icon: LuContact2,
  label: { bn: "সেলস রিপোর্ট", en: "Reports" },
  key: "sales-report",
  href: "sales-report",
  subLinks: [
    {
      icon: LuUser,
      label: { bn: "সেলস রিপোর্ট", en: "Sales Reports" },
      key: "sales-report",
      href: "sales-report",
    },
    {
      icon: LuUser,
      label: { bn: "ব্যবহারকারী অনুযায়ী বিক্রয়", en: "User Wise Sales" },
      key: "user_wise_sales",
      href: "user_wise_sales",
    },
    {
      icon: LuUserCheck,
      label: {
        bn: "ব্যবহারকারী অনুযায়ী বিক্রয় সারাংশ",
        en: "User Wise Sales Summary",
      },
      key: "user_wise_sales_summary",
      href: "user_wise_sales_summary",
    },
    {
      icon: LuUsers,
      label: {
        bn: "সমস্ত কাউন্টার ব্যবহারকারী অনুযায়ী বিক্রয় রিপোর্ট",
        en: "All Counter User Wise Sales Report",
      },
      key: "all_counter_user_wise_sales",
      href: "all_counter_user_wise_sales",
    },
    {
      icon: LuBus,
      label: { bn: "কোচ অনুযায়ী বিক্রয়", en: "Coach Wise Sales" },
      key: "coach_wise_sales",
      href: "coach_wise_sales",
    },
    {
      icon: LuClipboardList,
      label: {
        bn: "কোচ অনুযায়ী সারাংশ রিপোর্ট",
        en: "Coach Wise Summary Report",
      },
      key: "coach_wise_summary",
      href: "coach_wise_summary",
    },
    {
      icon: LuCalendar,
      label: {
        bn: "দিন অনুযায়ী বিক্রয় রিপোর্ট",
        en: "Day Wise Sales Report",
      },
      key: "day_wise_sales",
      href: "day_wise_sales",
    },
    // {
    //   icon: LuCalendarCheck,
    //   label: {
    //     bn: "দিন অনুযায়ী বিক্রয় রিপোর্ট সারাংশ",
    //     en: "Day Wise Sales Report Summary",
    //   },
    //   key: "day_wise_sales_summary",
    //   href: "day_wise_sales_summary",
    // },
    // {
    //   icon: LuTicket,
    //   label: {
    //     bn: "টিকিট অনুযায়ী বিক্রয় রিপোর্ট",
    //     en: "Ticket Wise Sales Report",
    //   },
    //   key: "ticket_wise_sales",
    //   href: "ticket_wise_sales",
    // },
    // {
    //   icon: LuMap,
    //   label: {
    //     bn: "রুট অনুযায়ী বিক্রয় রিপোর্ট",
    //     en: "Route Wise Sales Report",
    //   },
    //   key: "route_wise_sales",
    //   href: "route_wise_sales",
    // },
    {
      icon: LuHome,
      label: {
        bn: "কাউন্টার অনুযায়ী বিক্রয় রিপোর্ট",
        en: "Counter Wise Sales Report",
      },
      key: "counter_wise_sales",
      href: "counter_wise_sales",
    },
    {
      icon: LuHome,
      label: {
        bn: "কাউন্টার অনুযায়ী বিক্রয় রিপোর্ট",
        en: "Customer Advance Payment Report",
      },
      key: "counter_wise_sales",
      href: "counter_wise_sales",
    },
    {
      icon: LuHome,
      label: {
        bn: "কাউন্টার অনুযায়ী বিক্রয় রিপোর্ট",
        en: "Leaving Coach Report",
      },
      key: "counter_wise_sales",
      href: "counter_wise_sales",
    },
  ],
};
const counterDashboardFundLinks = {
  icon: LuContact2,
  label: { bn: "কাউন্টার ফান্ড", en: "Counter Fund" },
  key: "counter-fund",
  href: "counter-fund",
  subLinks: [
    {
      icon: LuUserCog,
      label: { bn: "কাউন্টার ফান্ড", en: "Counter Fund" },
      key: "counter-fund",
      href: "counter-fund",
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

export const counterNavigationLinks = [
  // CONTACT LINKS
  { ...counterDashboardRootLinks },
  { ...counterProfileManagement },

  { ...counterDashboardReportLinks },
  { ...counterDashboardSalesReportLinks },
  { ...counterDashboardFundLinks },
  // { ...settingsLinks },
];
