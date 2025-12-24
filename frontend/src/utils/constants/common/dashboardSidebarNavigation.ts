import { IconType } from "react-icons/lib";
import {
  LuArmchair,
  LuArrowDownUp,
  LuAward,
  LuBadgeDollarSign,
  LuBarChart,
  // LuBarChart2,
  // LuBarChartHorizontal,
  LuBriefcase,
  LuBuilding2,
  LuBus,
  LuCalendar,
  LuCircleDollarSign,
  LuClipboardList,
  LuContact2,
  LuCreditCard,
  LuDollarSign,
  // LuDollarSign,
  LuFileText,
  LuHome,
  // LuGlobe,
  // LuInfo,
  // LuLayers,
  LuListOrdered,
  LuMerge,
  LuReceipt,
  LuSeparatorHorizontal,
  LuSettings,
  // LuShield,
  // LuTag,
  LuUser,
  LuUserCheck,
  // LuUserCircle,
  LuUserCog,
  LuUsers,
} from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

export interface INavigationLinks {
  icon?: IconType;
  label: {
    bn: string;
    en: string;
  };
  key: string;
  href?: string; // Optional, some links might not have href
  subLinks?: INavigationLinks[]; // Nested sublinks
  action?: string; // Custom action identifier, e.g., "openModal"
  modalComponent?: string; // Modal component identifier
}

// CONTACTS LINKS
const adminProfileManagement = {
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

const dashboardRootLinks = {
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
    {
      icon: LuUserCog,
      label: { bn: "আজ বাতিলের অনুরোধ", en: "Today Cancel Request" },
      key: "cancel_request",
      href: "today_cancel_request",
    },
    {
      icon: LuUserCog,
      label: {
        bn: "টিকিট বাতিল অনুরোধ খুঁজুন",
        en: "Find Ticket Cancel Request",
      },
      key: "find_cancel_request",
      href: "find_cancel_request",
    },
    // {
    //   icon: LuUserCheck,
    //   label: { bn: "কোচ আপডেট করুন", en: "Update Coach Configs" },
    //   key: "update_coach_configs",
    //   href: "update_coach_config",
    // },
  ],
};

const dashboardCounterLink = {
  icon: LuContact2,
  label: { bn: "কাউন্টার তালিকা", en: "Counter" },
  key: "counter_list",
  href: "counter_list",
};

const dashboardCompanyUser = {
  icon: LuUserCog,
  label: { bn: "ব্যবহারকারীর তালিকা", en: "Company User" },
  key: "user_list",
  href: "user_list",
};

// const dashboardCoaches = {
//   icon: LuUserCheck,
//   label: { bn: "কোচ তালিকা", en: "Coaches" },
//   key: "coach_list",
//   href: "coach_list",
// };

const dashboardSchedule = {
  icon: LuBus,
  label: { bn: "সময়সূচী", en: "Schedule" },
  key: "schedule_list",
  href: "schedule_list",
};

const dashboardRoute = {
  icon: LuMerge,
  label: { bn: "রুট", en: "Route" },
  key: "route_list",
  href: "route_list",
};
const dashboardFare = {
  icon: LuDollarSign,
  label: { bn: "ভাড়ার তালিকা ", en: "Fare List" },
  key: "fare_list",
  href: "fare_list",
};

const dashboardCoachs = {
  icon: LuArmchair,
  label: { bn: "কোচ", en: "Coachs" },
  key: "vehicle_list",
  href: "vehicle_list",
};
const dashboardCoachConfiguration = {
  icon: LuUserCheck,
  label: { bn: "কোচ কনফিগস", en: "Coach Configuration" },
  key: "coach_configs",
  href: "coach_configs",
};

const dashboardCoachActiveInactive = {
  icon: LuUserCheck,
  label: { bn: "বোর্ড", en: "Coach Active/Inactive" },
  key: "coach_active_inactive",
  href: "coach_active_inactive",
};

const dashboardUpdateCoachActiveInactive = {
  icon: LuUserCheck,
  label: { bn: "বোর্ড", en: "Board" },
  key: "update_coach_config",
  href: "update_coach_config",
};

const dashboardCMS = {
  icon: LuUser,
  label: { bn: "সিএমএস", en: "CMS" },
  key: "cms",
  href: "cms",
  subLinks: [
    {
      icon: LuUser,
      label: { bn: "স্লাইডার", en: "Slider" },
      key: "slider_list",
      href: "slider_list",
    },
    {
      icon: LuUser,
      label: { bn: "আমাদের সম্পর্কে", en: "About Us Image" },
      key: "aboutus_list",
      href: "aboutus_list",
    },
    {
      icon: LuBuilding2,
      label: { bn: "সিস্টার কনসার্ন", en: "Sister Concern" },
      key: "sister-concern",
      href: "sister-concern",
    },
    {
      icon: LuAward,
      label: { bn: "কোর ভ্যালু", en: "Core Value" },
      key: "core-value",
      href: "core-value",
    },
    {
      icon: LuBarChart,
      label: { bn: "ইউজার স্ট্যাটিস্টিকস", en: "User Statistics" },
      key: "user-statistics",
      href: "user-statistics",
    },
    {
      icon: LuFileText,
      label: { bn: "পৃষ্ঠা", en: "Pages" },
      key: "pages",
      href: "pages-list",
    },

    {
      icon: LuFileText, // or choose an icon suitable for FAQ
      label: { bn: "প্রশ্নোত্তর", en: "FAQ" },
      key: "faq",
      href: "faq-list",
    },
  ],
};

const contactsManagementLinks = {
  icon: LuContact2,
  label: { bn: "ব্যবহারকারীর ব্যবস্থাপনা", en: "User Management" },
  key: "role",
  href: "role",
  subLinks: [
    {
      icon: LuUserCheck,
      label: { bn: "ভূমিকা", en: "Role" },
      key: "role",
      href: "role",
    },

    // {
    //   icon: LuUserCheck,
    //   label: { bn: "অনুমতি তালিকা", en: "Permission List" },
    //   key: "permission_list",
    //   href: "permission_list",
    // },
  ],
};

export const reportManagementsLinks = {
  icon: LuFileText,
  label: { bn: "রিপোর্ট", en: "Reports" },
  key: "user_wise_sales",
  href: "user_wise_sales",
  subLinks: [
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
    // {
    //   icon: LuServer,
    //   label: {
    //     bn: "সমস্ত কাউন্টার অনুযায়ী বিক্রয় রিপোর্ট",
    //     en: "All Counter Wise Sales Report",
    //   },
    //   key: "all_counter_wise_sales",
    //   href: "all_counter_wise_sales",
    // },
  ],
};
// VEHICLES & SCHEDULE MANAGEMENT
const stationManagementsLinks = {
  icon: LuMerge,
  label: { bn: "স্টেশনের তালিকা ", en: "Station List" },
  key: "station_list",
  href: "station_list",
};
const seatPlanLinks = {
  icon: LuSeparatorHorizontal,
  label: {
    bn: "সিট প্ল্যান ব্যবস্থাপনা",
    en: "Seat Plan",
  },
  key: "seat_plan_list",
  href: "seat_plan_list",
};

// FINANCE MANAGEMENT LIST
const financialManagementLinks = {
  icon: LuCircleDollarSign,
  label: { bn: "আর্থিক ব্যবস্থাপনা", en: "Financial Management" },
  key: "financial",
  href: "account_list",
  subLinks: [
    {
      icon: LuListOrdered,
      label: { bn: "অ্যাকাউন্ট তালিকা", en: "Account List" },
      key: "account_list",
      href: "account_list",
    },
    {
      icon: LuBriefcase,
      label: {
        bn: "অংশীদারদের তালিকা",
        en: "Partners List",
      },
      key: "partner_list",
      href: "partner_list",
    },
    {
      icon: LuArrowDownUp,
      label: { bn: "অর্থ তালিকা", en: "Finance List" },
      key: "finance_list",
      href: "finance_list",
    },
    // {
    //   icon: LuBarChartHorizontal,
    //   label: { bn: "ব্যালান্স শীট", en: "Balance Sheet" },
    //   key: "balance_sheet",
    //   href: "balance_sheet",
    // },
    // {
    //   icon: LuBarChart2,
    //   label: { bn: "নগদ প্রবাহ", en: "Cash Flow" },
    //   key: "cash_flow",
    //   href: "cash_flow",
    // },
  ],
};

// EXPENDITURE MANAGEMENT LIST
// const expenditureManagementLinks = {
//   icon: LuArrowRightFromLine,
//   label: { bn: "ব্যয় ব্যবস্থাপনা", en: "Expense Management" },
//   key: "expenditure",
//   href: "expenditure",
//   subLinks: [
//     {
//       icon: LuListOrdered,
//       label: { bn: "ব্যয় তালিকা", en: "Expense List" },
//       key: "expense_list",
//       href: "expense_list",
//     },
//     {
//       icon: LuAlignStartVertical,
//       label: { bn: "ব্যয় বিভাগ", en: "Expense Category" },
//       key: "expense_category_list",
//       href: "expense_category_list",
//     },
//     // {
//     //   icon: LuLayers,
//     //   label: { bn: "ব্যয়ের উপবিভাগ", en: "Expense Sub-category" },
//     //   key: "expense_subcategory_list",
//     //   href: "expense_subcategory_list",
//     // },
//   ],
// };
const FulelManagementLinks = {
  icon: LuCircleDollarSign,
  label: {
    bn: "জ্বালানী ব্যবস্থাপনা",
    en: "Fule Management",
  },
  key: "fuel-management",
  href: "fuel-management",
  subLinks: [
    {
      icon: LuListOrdered,
      label: {
        bn: "জ্বালানী ব্যবস্থাপনা",
        en: "Fuel Management",
      },
      key: "fuel-management",
      href: "fuel-management",
    },
    // {
    //   icon: LuBriefcase,
    //   label: {
    //     bn: "জ্বালানী বিক্রয় সারাংশ",
    //     en: "Fule Sales Summary",
    //   },
    //   key: "fuel-sales-summary",
    //   href: "fuel-sales-summary",
    // },
    {
      icon: LuBriefcase,
      label: { bn: "পেমেন্ট", en: "Payment" },
      key: "fuel_payment",
      modalComponent: "AddFuelPayment", // Modal component identifier
    },
  ],
};

// DETAILS REPORTS LIST
const reportingSuiteLinks = {
  icon: LuClipboardList,
  label: { bn: "রিপোর্টিং স্যুট", en: "Reporting Suite" },
  key: "reporting_suite",
  href: "reporting_suite",
  subLinks: [
    {
      icon: LuBadgeDollarSign,
      label: { bn: "আজকের প্রতিবেদন", en: "Today's Report" },
      key: "reporting_suite",
      href: "reporting_suite",
    },
    {
      icon: LuBadgeDollarSign,
      label: {
        bn: "ব্যবহারকারী অনুজয়ে বিক্রয় প্রতিবেদন",
        en: "User Wise Sales Report",
      },
      key: "user_wise_report",
      href: "user_wise_report",
    },
    {
      icon: LuCreditCard,
      label: { bn: "পেমেন্ট প্রতিবেদন", en: "Payment Report" },
      key: "payment_report",
      href: "payment_report",
    },
    {
      icon: LuReceipt,
      label: { bn: "ব্যয় প্রতিবেদন", en: "Expense Report" },
      key: "expense_report",
      href: "expense_report",
    },
    // {
    //   icon: LuCalendar,
    //   label: { bn: "ডে-বুক প্রতিবেদন", en: "Daybook Report" },
    //   key: "daybook_report",
    //   href: "daybook_report",
    // },
    // {
    //   icon: LuUserCircle,
    //   label: { bn: "বিনিয়োগকারী প্রতিবেদন", en: "Investor Report" },
    //   key: "investor_report",
    //   href: "investor_report",
    // },
  ],
};

const coachAssignToCounterMaster = {
  icon: LuClipboardList,
  label: { bn: "ডিসকাউন্ট", en: "System" },
  key: "coach_assign_to_counter_master",
  href: "coach_assign_to_counter_master",
  subLinks: [
    {
      icon: LuBadgeDollarSign,
      label: { bn: "ডিসকাউন্ট", en: "Coach Assign To Counter Master" },
      key: "coach_assign_to_counter_master",
      href: "coach_assign_to_counter_master",
    },
  ],
};

const settingsLinks = {
  icon: LuSettings,
  label: { bn: "সেটিংস", en: "Settings" },
  key: "settings",
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
const blogLinks = {
  icon: LuSettings,
  label: { bn: "সেটিংস", en: "Blog" },
  key: "blog_list",
  href: "blog-list",
  subLinks: [
    {
      icon: LuFileText, // Suitable icon for blog content
      label: { bn: "ব্লগ ক্যাটাগরি", en: "Add Blog" },
      key: "add-blog-post",
      href: "add-blog-post",
    },
    {
      icon: LuFileText, // Suitable icon for blog content
      label: { bn: "ব্লগ ক্যাটাগরি", en: "Blog List" },
      key: "blog_list",
      href: "blog-list",
    },
    {
      icon: LuFileText, // Suitable icon for blog content
      label: { bn: "ব্লগ ক্যাটাগরি", en: "Blog Category" },
      key: "blog_category_list",
      href: "blog-category-list",
    },
  ],
};

const dashboardCounterFund = {
  icon: LuUserCog,
  label: { bn: "কাউন্টার ফান্ড রিকুয়েষ্ট", en: "Counter Fund" },
  key: "counter-fund",
  href: "counter-fund",
};

// const dashboardBoard = {
//   icon: LuUserCog,
//   label: { bn: "কাউন্টার ফান্ড রিকুয়েষ্ট", en: "Board" },
//   key: "board",
//   href: "board",
// };
const dashboardPartialInfo = {
  icon: LuUserCheck,
  label: { bn: "আংশিক তথ্য", en: "Partial Info" },
  key: "partial_info",
  href: "partial_info",
};
const dashboardReserve = {
  icon: LuUserCheck,
  label: { bn: "রিজার্ভ তালিকা", en: "Reserve List" },
  key: "reserve_list",
  href: "reserve_list",
};

const dashboardDiscount = {
  icon: LuBadgeDollarSign,
  label: { bn: "ডিসকাউন্ট", en: "Discount" },
  key: "discount",
  href: "discount",
  subLinks: [
    {
      icon: LuBadgeDollarSign,
      label: { bn: "ডিসকাউন্ট", en: "Discount" },
      key: "discount",
      href: "discount",
    },
    {
      icon: LuFileText, // or any relevant icon for offers/promos
      label: { bn: "অফার প্রমো", en: "Offer Promo" },
      key: "offerPromo",
      href: "offer-promo-list",
    },
  ],
};

const dashboardTicket = {
  icon: LuBadgeDollarSign,
  label: { bn: "Ticket", en: "Ticket" },
  key: "ticket",
  href: "ticket",
};

const dashboardMigration = {
  icon: LuBadgeDollarSign,
  label: { bn: "মাইগ্রেট", en: "Migration" },
  key: "migrateSeat",
  href: "migrate-seat",
};

const dashboardGuideList = {
  icon: LuUserCheck,
  label: { bn: "সাহায্যকারী তালিকা", en: "Guide List" },
  key: "guide_list",
  href: "guide_list",
};

const dashboardHelperlist = {
  icon: LuUserCheck,
  label: { bn: "সাহায্যকারী তালিকা", en: "Helper List" },
  key: "helper_list",
  href: "helper_list",
};

const dashboardDriverlist = {
  icon: LuUserCheck,
  label: { bn: "ড্রাইভার তালিকা", en: "Driver List" },
  key: "driver_list",
  href: "driver_list",
};

export const adminNavigationLinks = [
  // CONTACT LINKS
  { ...dashboardRootLinks },
  { ...stationManagementsLinks },

  { ...adminProfileManagement },
  { ...dashboardCounterLink },
  { ...dashboardCompanyUser },
  { ...dashboardGuideList },
  { ...dashboardHelperlist },
  { ...dashboardDriverlist },
  // { ...dashboardCoaches },
  { ...dashboardSchedule },
  { ...seatPlanLinks },
  { ...dashboardRoute },
  { ...dashboardFare },
  { ...dashboardCoachs },
  { ...dashboardCoachConfiguration },
  { ...dashboardCoachActiveInactive },
  { ...dashboardUpdateCoachActiveInactive },
  { ...dashboardCounterFund },
  { ...dashboardCMS },
  // { ...dashboardBoard },
  { ...dashboardDiscount },
  { ...dashboardTicket },
  { ...dashboardMigration },
  { ...contactsManagementLinks },
  // VEHICLES & SCHEDULE MANAGEMENT
  { ...dashboardPartialInfo },
  { ...dashboardReserve },

  // FINANCE MANAGEMENT LINKS
  { ...financialManagementLinks },
  // EXPENDITURE MANAGEMENT LINKS
  // { ...expenditureManagementLinks },
  // REPORTS SUITE LINKS
  { ...reportingSuiteLinks },
  { ...FulelManagementLinks },
  { ...reportManagementsLinks },
  { ...coachAssignToCounterMaster },

  // SETTINGS LINKS
  { ...settingsLinks },
  { ...blogLinks },
];
