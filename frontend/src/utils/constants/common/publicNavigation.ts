import {
  LuHome,
  LuGitFork,
  LuListOrdered,
  LuTarget,
  LuUsers,
  LuCalendarClock,
} from "react-icons/lu";
import { TbUsersGroup } from "react-icons/tb";
import { RiContactsLine, RiFindReplaceLine } from "react-icons/ri";
export interface INavigationLinks {
  icon?: string;
  label: {
    bn: string;
    en: string;
  };
  key: string;
  href: string;
  subLinks?: INavigationLinks[];
}

// USER MANAGEMENT LINKS
export const userManagement = {
  icon: LuUsers,
  label: { bn: "ব্যবহারকারী অ্যাকাউন্ট ব্যবস্থাপনা", en: "User Management" },
  key: "user_management",
  href: "user_management",
  subLinks: [
    {
      icon: LuListOrdered,
      label: { bn: "সদস্য তালিকা", en: "User List" },
      key: "users_list",
      href: "users_list",
    },
    {
      icon: LuGitFork,
      label: { bn: "শাখা তালিকা", en: "Branch List" },
      key: "branch_list",
      href: "branch_list",
    },
    {
      icon: LuTarget,
      label: { bn: "শাখা তালিকা", en: "Branch Targets" },
      key: "branch_targets",
      href: "branch_targets",
    },
  ],
};

export const navigationLinks = [{ ...userManagement }];

// Define the type for the locale
type Locale = "bn" | "en";

// Ensure PUBLIC_NAVIGATION_LINKS has the correct structure
export const publicNavigationLinks: Record<
  Locale,
  { icon: any; label: string; key: string; href: string }[]
> = {
  bn: [
    {
      icon: LuHome,
      label: "হোম",
      key: "/",
      href: "/",
    },
    {
      icon: TbUsersGroup,
      label: "আমাদের সম্পর্কে",
      key: "/about_us",
      href: "/about_us",
    },
    {
      icon: RiContactsLine,
      label: "যোগাযোগ",
      key: "/contact",
      href: "/contact",
    },
    {
      icon: RiFindReplaceLine,
      label: "টিকিট খুঁজুন",
      key: "/search_tickit",
      href: "/search_tickit",
    },
    {
      icon: LuCalendarClock, // You can replace this with your desired icon
      label: "রিজার্ভ করুন",
      key: "/reserve",
      href: "/reserve",
    },
  ],
  en: [
    {
      icon: LuHome,
      label: "Home",
      key: "/",
      href: "/",
    },
    {
      icon: TbUsersGroup,
      label: "About us",
      key: "/about_us",
      href: "/about_us",
    },
    {
      icon: RiContactsLine,
      label: "Contact",
      key: "/contact",
      href: "/contact",
    },
    {
      icon: RiContactsLine,
      label: "Counter Location",
      key: "/counter_location",
      href: "/counter_location",
    },
    {
      icon: RiContactsLine,
      label: "FAQ",
      key: "/faq",
      href: "/faq",
    },
    {
      icon: RiFindReplaceLine,
      label: "Find Ticket",
      key: "/search_tickit",
      href: "/search_tickit",
    },
    {
      icon: LuCalendarClock,
      label: "Reserve",
      key: "/reserve",
      href: "/reserve",
    },
  ],
};
export const publicNavigationLinksMobile: Record<
  Locale,
  { icon: any; label: string; key: string; href: string }[]
> = {
  bn: [
    {
      icon: LuHome,
      label: "হোম",
      key: "/",
      href: "/",
    },
    {
      icon: TbUsersGroup,
      label: "আমাদের সম্পর্কে",
      key: "/about_us",
      href: "/about_us",
    },
    {
      icon: RiContactsLine,
      label: "যোগাযোগ",
      key: "/contact",
      href: "/contact",
    },
    {
      icon: RiContactsLine,
      label: "Counter Location",
      key: "/counter_location",
      href: "/counter_location",
    },
    {
      icon: RiContactsLine,
      label: "FAQ",
      key: "/faq",
      href: "/faq",
    },
    // {
    //   icon: RiFindReplaceLine,
    //   label: "টিকিট খুঁজুন",
    //   key: "/search_tickit",
    //   href: "/search_tickit",
    // },
    // {
    //   icon: LuCalendarClock,
    //   label: "রিজার্ভ করুন",
    //   key: "/reserve",
    //   href: "/reserve",
    // },
  ],
  en: [
    {
      icon: LuHome,
      label: "Home",
      key: "/",
      href: "/",
    },
    {
      icon: TbUsersGroup,
      label: "About us",
      key: "/about_us",
      href: "/about_us",
    },
    {
      icon: RiContactsLine,
      label: "Contact",
      key: "/contact",
      href: "/contact",
    },
    {
      icon: RiContactsLine,
      label: "Counter Location",
      key: "/counter_location",
      href: "/counter_location",
    },
    {
      icon: RiContactsLine,
      label: "FAQ",
      key: "/faq",
      href: "/faq",
    },
    // {
    //   icon: RiFindReplaceLine,
    //   label: "Find Ticket",
    //   key: "/search_tickit",
    //   href: "/search_tickit",
    // },
    // {
    //   icon: LuCalendarClock,
    //   label: "Reserve",
    //   key: "/reserve",
    //   href: "/reserve",
    // },
  ],
};
