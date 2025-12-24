import React from "react";
import { IRouteProps } from "./contacts";
import SliderList from "@/pages/dashboard/admin/slider/SliderList";
import AddContentManagement from "@/pages/dashboard/admin/ContentManagement/AddContentManagement";
import AboutUsList from "@/pages/dashboard/admin/aboutUs/AboutUsList";
import SisterConcernList from "@/pages/dashboard/admin/sisterConcern/SisterConcernList";
import CoreValueList from "@/pages/dashboard/admin/coreValue/CoreValueList";
import StatisticsList from "@/pages/dashboard/admin/statistics/StatisticsList";
import PageList from "@/pages/dashboard/admin/pages/PagesList";
import AddPages from "@/pages/dashboard/admin/pages/AddPages";
import OfferPromoList from "@/pages/dashboard/admin/offerPromo/OfferPromoList";
import FaqList from "@/pages/dashboard/admin/faq/FaqList";
import EditPage from "@/pages/dashboard/admin/pages/EditPages";
import CategoryLists from "@/pages/dashboard/admin/blog/BlogCategoryList";
import BlogPost from "@/pages/dashboard/admin/blog/BlogList";
import BlogFormModal from "@/pages/dashboard/admin/blog/AddBlog";
export const settingsRoutes: IRouteProps[] = [
  {
    path: "cms",
    element: React.createElement(AddContentManagement),
  },
  {
    path: "sister-concern",
    element: React.createElement(SisterConcernList),
  },
  {
    path: "core-value",
    element: React.createElement(CoreValueList),
  },
  {
    path: "user-statistics",
    element: React.createElement(StatisticsList),
  },
  {
    path: "pages-list",
    element: React.createElement(PageList),
  },
  {
    path: "edit-page/:slug",
    element: React.createElement(EditPage),
  },
  
  {
    path: "faq-list",
    element: React.createElement(FaqList),
  },
  {
    path: "offer-promo-list",
    element: React.createElement(OfferPromoList),
  },
  {
    path: "add-page",
    element: React.createElement(AddPages),
  },
  {
    path: "slider_list",
    element: React.createElement(SliderList),
  },
  {
    path:"aboutus_list",
    element: React.createElement(AboutUsList)
  },
  {
    path:"blog-category-list",
    element: React.createElement(CategoryLists)
  }
  ,
  {
    path:"blog-list",
    element: React.createElement(BlogPost)
  },
  {
    path:"add-blog-post",
    element: React.createElement(BlogFormModal)
  }

];
