import { IconType } from "react-icons/lib";
import {
  LuBell,
  LuBookOpen,
  LuBriefcase,
  LuBus,
  LuCar,
  LuCircleDollarSign,
  LuContact2,
  LuGlobe,
  LuInfo,
  // LuLayers,
  LuListOrdered,
  LuSettings,
  LuShield,
  LuTag,
  LuUser,
  LuUserCheck,
  LuUserCog,
} from "react-icons/lu";
import { INavigationLinks } from "../dashboardSidebarNavigation";
import { CgProfile } from "react-icons/cg";

export interface IAccountsNavigationLinks {
  icon?: IconType;
  label: {
    bn: string;
    en: string;
  };
  key: string;
  href: string;
  subLinks?: INavigationLinks[];

  action?: string; // Custom action identifier, e.g., "openModal"
  modalComponent?: string; // Modal component identifier
}

// CONTACTS LINKS
const accountsProfileManagement = {
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
const accountDashboardRootLinks = {
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
      label: { bn: "ব্যয় যোগ করুন", en: "Add Expense" },
      key: "add_accounts_role_expense",
      modalComponent: "AddAccountsRoleExpense", // Indicates it opens a modal
    },
    {
      icon: LuBus,
      label: { bn: "ব্যয় প্রতিবেদন", en: "Expense Report" },
      key: "expense_category_report",
      href: "expense_category_report",
    },

    {
      icon: LuBus,
      label: { bn: "লাভ ও ক্ষতির প্রতিবেদন", en: "Bus No Wise Report" },
      key: "profit_and_loss",
      href: "profit_and_loss",
    },
  ],
};
// VEHICLES & SCHEDULE MANAGEMENT
const accountsManagementLinks = {
  icon: LuCar,
  label: {
    bn: "হিসাব ব্যবস্থাপনা",
    en: "Accounts Management",
  },
  key: "accounts_management",
  href: "accounts_management",
  subLinks: [
    {
      icon: LuBus,
      label: { bn: "হিসাব ব্যবস্থাপনা", en: "Accounts Management" },
      key: "accounts_management",
      href: "accounts_management",
    },
    {
      icon: LuUserCheck,
      label: { bn: "কোচ তালিকা", en: "Coach List" },
      key: "coach_list",
      href: "coach_list",
    },
  ],
};
const collectionManagementLinks = {
  icon: LuCircleDollarSign,
  label: { bn: "সংগ্রহ ব্যবস্থাপনা", en: "Collection Management" },
  key: "collection_management",
  href: "collection_management",
  subLinks: [
    {
      icon: LuListOrdered,
      label: { bn: "সংগ্রহ ব্যবস্থাপনা", en: "Collection Management" },
      key: "collection_management",
      href: "collection_management",
    },
    {
      icon: LuBriefcase,
      label: {
        bn: "সংগ্রহ সারাংশ",
        en: "Collection Summary",
      },
      key: "collection-summary",
      href: "collection-summary",
    },
  ],
};
// DETAILS REPORTS LIST
const accountantExpenseManagementLinks = {
  icon: LuCar,
  label: {
    bn: "হিসাব ব্যবস্থাপনা",
    en: "Expense Management",
  },
  key: "expense_category_account",
  href: "expense_category_account",
  subLinks: [
    {
      icon: LuUserCheck,
      label: { bn: "ব্যয় বিভাগ অ্যাকাউন্ট", en: "Expense Categorey" },
      key: "expense_category_account",
      href: "expense_category_account",
    },
    {
      icon: LuBus,
      label: { bn: "ব্যয় সাব বিভাগ অ্যাকাউন্ট", en: "Expense Sub Categorey" },
      key: "expense_sub_category_account",
      href: "expense_sub_category_account",
    },
    {
      icon: LuBus,
      label: { bn: "ব্যয় অ্যাকাউন্ট", en: "Expense" },
      key: "expense_account",
      href: "expense_account",
    },
    {
      icon: LuBus,
      label: { bn: "ব্যয় প্রতিবেদন", en: "Expense Report" },
      key: "expense_category_report",
      href: "expense_category_report",
    },
    // {
    //   icon: LuBus,
    //   label: { bn: "ব্যয় উপবিভাগ প্রতিবেদন", en: "Expense Sub Category Report" },
    //   key: "expense_sub_category_report",
    //   href: "expense_sub_category_report",
    // },
    {
      icon: LuBus,
      label: { bn: "লাভ ও ক্ষতির প্রতিবেদন", en: "Bus No Wise Report" },
      key: "profit_and_loss",
      href: "profit_and_loss",
    },
    {
      icon: LuBus,
      label: { bn: "ট্রিপ ওয়াইজ প্রতিবেদন", en: "Trip No Wise Report" },
      key: "trip-no-wise-report",
      href: "trip-no-wise-report",
    },
  ],
};
//new
const settingsLinks = {
  icon: LuSettings,
  label: { bn: "সেটিংস", en: "Settings" },
  key: "settings",
  href: "settings",
  subLinks: [
    {
      icon: LuUser,
      label: { bn: "ব্যবহারকারী সেটিংস", en: "User Settings" },
      key: "user_settings",
      href: "user_settings",
    },
    {
      icon: LuShield,
      label: { bn: "নিরাপত্তা সেটিংস", en: "Security Settings" },
      key: "security_settings",
      href: "security_settings",
    },
    {
      icon: LuBell,
      label: { bn: "বিজ্ঞপ্তি সেটিংস", en: "Notification Settings" },
      key: "notification_settings",
      href: "notification_settings",
    },
    {
      icon: LuGlobe,
      label: { bn: "ভাষা সেটিংস", en: "Language Settings" },
      key: "language_settings",
      href: "language_settings",
    },
    {
      icon: LuInfo,
      label: { bn: "অ্যাপ্লিকেশন তথ্য", en: "Application Info" },
      key: "application_info",
      href: "application_info",
    },
    {
      icon: LuBookOpen,
      label: { bn: "পরিচিতি", en: "About" },
      key: "about",
      href: "about",
    },
    {
      icon: LuTag,
      label: { bn: "সংস্করণ", en: "Version" },
      key: "version",
      href: "version",
    },
  ],
};

export const accountsNavigationLinks = [
  {...accountsProfileManagement},
  // CONTACT LINKS
  { ...accountDashboardRootLinks },
  // VEHICLES & SCHEDULE MANAGEMENT
  { ...accountsManagementLinks },
  { ...collectionManagementLinks },
  // FINANCE MANAGEMENT LINKS
  { ...accountantExpenseManagementLinks },
  // EXPENDITURE MANAGEMENT LINKS

  // SETTINGS LINKS
  { ...settingsLinks },
];
