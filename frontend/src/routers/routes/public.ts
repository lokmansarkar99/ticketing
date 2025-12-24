import AboutUs from "@/pages/public/AboutUs";
import Blog from "@/pages/public/Blog";
import Contact from "@/pages/public/Contact";
import FindTickit from "@/pages/public/FindTickit";
import ForgetPassword from "@/pages/public/ForgetPassword";
import Home from "@/pages/public/Home";
import Login from "@/pages/public/Login";
import NewPassword from "@/pages/public/NewPassword";
import Notice from "@/pages/public/Notice";
import OtpCode from "@/pages/public/OtpCode";
import PaymentCancel from "@/pages/public/PaymentCancel";
import PaymentFailed from "@/pages/public/PaymentFailed";
import PaymentSuccess from "@/pages/public/PaymentSuccess";
import ResetPassword from "@/pages/public/ResetPassword";
import Route from "@/pages/public/Route";
import BoookingFormRoundTripPublic from "@/sections/home/BoookingFormRoundTripPublic";
import React from "react";
import { IRouteProps } from "./contacts";
import AddReservePublic from "@/pages/public/AddReservePublic";
import CustomerLoginForm from "@/pages/public/CustomerLoginForm";
import AccountPage from "@/pages/public/AccountPage";
import UpdateProfile from "@/pages/public/UpdateProfile";
import OrderList from "@/pages/public/OrderList";
import CustomerChangePassword from "@/pages/public/CustomerChangePassword";
import PrivateRoutes from "../routeWrapper/PrivateRoutes";
import CounterLocation from "@/pages/public/CounterLocation";
import Faq from "@/pages/public/Faq";
import Pages from "@/components/shared/Pages";
import SingleBlog from "@/pages/public/SignleBlog";

export const publicRoutes: IRouteProps[] = [
  {
    path: "/",
    element: React.createElement(Home),
  },
  {
    path: "home",
    element: React.createElement(Home),
  },
  {
    path: "login",
    element: React.createElement(Login),
  },
  {
    path: "customer-auth",
    element: React.createElement(CustomerLoginForm),
  },
  {
    path: "reset-password",
    element: React.createElement(ResetPassword),
  },
  {
    path: "forget-password",
    element: React.createElement(ForgetPassword),
  },
  {
    path: "otp",
    element: React.createElement(OtpCode),
  },
  {
    path: "new-password",
    element: React.createElement(NewPassword),
  },
  {
    path: "about_us",
    element: React.createElement(AboutUs),
  },
  {
    path: "counter_location",
    element: React.createElement(CounterLocation),
  },
  {
    path: "faq",
    element: React.createElement(Faq),
  },
  {
    path: "search_tickit",
    element: React.createElement(FindTickit),
  },
  {
    path: "reserve",
    element: React.createElement(AddReservePublic),
  },
  {
    path: "route",
    element: React.createElement(Route),
  },
  {
    path: "notice",
    element: React.createElement(Notice),
  },
  {
    path: "blogs",
    element: React.createElement(Blog),
  },
  {
    path: "blogs/:slug",
    element: React.createElement(SingleBlog),
  },
  {
    path: "contact",
    element: React.createElement(Contact),
  },
  {
    path: "pages/:slug",
    element: React.createElement(Pages),
  },
  {
    path: "payment-success/:transactionDetails",
    element: React.createElement(PaymentSuccess),
  },
  {
    path: "payment-failed",
    element: React.createElement(PaymentFailed),
  },
  {
    path: "payment-canceled",
    element: React.createElement(PaymentCancel),
  },
  {
    path: "public-seat-form",
    element: React.createElement(BoookingFormRoundTripPublic),
  },
  {
    path: "profile/my-profile",
    element: React.createElement(PrivateRoutes, {
      children: React.createElement(AccountPage, {
        children: React.createElement(UpdateProfile),
      }),
    }),
  },
  {
    path: "profile/order-list",
    element: React.createElement(PrivateRoutes, {
      children: React.createElement(AccountPage, {
        children: React.createElement(OrderList),
      }),
    }),
  },
  {
    path: "profile/change-password",
    element: React.createElement(PrivateRoutes, {
      children: React.createElement(AccountPage, {
        children: React.createElement(CustomerChangePassword),
      }),
    }),
  },
];
