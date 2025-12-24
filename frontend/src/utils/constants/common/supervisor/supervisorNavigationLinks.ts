import { CgProfile } from "react-icons/cg";
import { IconType } from "react-icons/lib";
import {
  LuBell,
  LuBookOpen,
  LuBriefcase,
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
  LuUserCog,
} from "react-icons/lu";

export interface ISupervisorNavigationLinks {
  icon?: IconType;
  label: {
    bn: string;
    en: string;
  };
  key: string;
  href: string;
  subLinks?: ISupervisorNavigationLinks[];

  action?: string; // Custom action identifier, e.g., "openModal"
  modalComponent?: string; // Modal component identifier
}

// CONTACTS LINKS
const supervisorProfileManagement = {
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
const superviosrDashboardRootLinks = {
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
      label: { bn: "অতিরিক্ত আয় যোগ করুন", en: "Add Extra Income" },
      key: "add_extra_income",
      modalComponent: "AddExtraIncome", 
    },
    {
      icon: LuUserCog,
      label: { bn: "ব্যয় যোগ করুন", en: "Add Expense" },
      key: "add_expense",
      modalComponent: "AddExpense", 
    },
  ],
};
const supervisorManagementLinks = {
  icon: LuCircleDollarSign,
  label: {
    bn: "সুপারভাইজার ব্যবস্থাপনা",
    en: "Supervisor Management",
  },
  key: "supervisor-management",
  href: "supervisor-management",
  subLinks: [
    {
      icon: LuListOrdered,
      label: {
        bn: "সুপারভাইজার ক্রয়-বিক্রয় ব্যবস্থাপনা",
        en: "Supervisor Sales Management",
      },
      key: "supervisor-management",
      href: "supervisor-management",
    },
  ],
};
const superviosorReportLinks = {
  icon: LuCircleDollarSign,
  label: {
    bn: "সুপারভাইজার রিপোর্ট",
    en: "Supervisor Report",
  },
  key: "supervisor-report",
  href: "supervisor-report",
  subLinks: [
    {
      icon: LuListOrdered,
      label: {
        bn: "সুপারভাইজার রিপোর্ট",
        en: "Supervisor Report",
      },
      key: "supervisor-report",
      href: "supervisor-report",
    },
  ],
};

const expenseManagementLinks = {
  icon: LuCircleDollarSign,
  label: {
    bn: "ব্যয় ব্যবস্থাপনা",
    en: "Expense Management",
  },
  key: "expense-management",
  href: "expense-management",
  subLinks: [
    {
      icon: LuBriefcase,
      label: {
        bn: "ব্যয় বিভাগ",
        en: "Expense Categorey",
      },
      key: "expense-categorey",
      href: "expense-categorey",
    },
    {
      icon: LuListOrdered,
      label: {
        bn: "ব্যয় ব্যবস্থাপনা",
        en: "Expense Management",
      },
      key: "expense-management",
      href: "expense-management",
    },
  ],
};
// DETAILS REPORTS LIST

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

export const supervisorNavigationLinks = [
  {...supervisorProfileManagement},
  { ...superviosrDashboardRootLinks },
  { ...supervisorManagementLinks },
  { ...superviosorReportLinks },

  { ...expenseManagementLinks },
  { ...settingsLinks },
];
