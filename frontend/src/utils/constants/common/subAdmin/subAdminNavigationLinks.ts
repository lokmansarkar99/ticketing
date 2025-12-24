import { IconType } from "react-icons/lib";
import {
  LuBell,
  LuBookOpen,
  LuContact2,
  LuGlobe,
  LuInfo,
  LuSettings,
  LuShield,
  LuTag,
  LuUser,
  LuUserCheck,
  LuUserCog,
} from "react-icons/lu";
import { INavigationLinks } from "../dashboardSidebarNavigation";
import { CgProfile } from "react-icons/cg";

export interface ISubAdminNavigationLinks {
  icon?: IconType;
  label: {
    bn: string;
    en: string;
  };
  key: string;
  href: string;
  subLinks?: INavigationLinks[];
}
const subAdminDashboardRootLinks = {
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
const subAdminProfileManagement = {
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
const subAdminDashboardReportLinks = {
  icon: LuContact2,
  label: { bn: "কোচ কনফিগস", en: "Coach Configs" },
  key: "coach_configs",
  href: "coach_configs",
  subLinks: [
    {
      icon: LuUserCheck,
      label: { bn: "কোচ কনফিগস", en: "Coach Configs" },
      key: "coach_configs",
      href: "coach_configs",
    },
  ],
};

const subAdminDashboardCoachLinks = {
  icon: LuContact2,
  label: { bn: "কোচ আপডেট করুন", en: "Update Coach Configs" },
  key: "update_coach_configs",
  href: "update_coach_configs",
  subLinks: [
    {
      icon: LuUserCheck,
      label: { bn: "কোচ আপডেট করুন", en: "Update Coach Configs" },
      key: "update_coach_configs",
      href: "update_coach_configs",
    },
  ],
};

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

export const subAdminNavigationLinks = [
  // CONTACT LINKS
  { ...subAdminProfileManagement },
  { ...subAdminDashboardRootLinks },

  { ...subAdminDashboardReportLinks },
  { ...subAdminDashboardCoachLinks },
  { ...settingsLinks },
];
