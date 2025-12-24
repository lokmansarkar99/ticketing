import { appConfiguration } from "../constants/common/appConfiguration";
import formatter from "./formatter";
import { shareWithCookies } from "./shareWithCookies";
import { jwtDecode } from "jwt-decode";

interface IBranchInformationProps {
  id: number;
  branchName: string;
  branchLocation: string;
  due: number;
  address: string;
  phone: string;
  hotline: string;
  email: string;
  type: string;
}

interface ICounter {
  name: string;
  stationId: number;
  email: string;
  phone: string;
  id: number;
}

interface IPermission{
  showDiscountMenu:boolean
  blockDiscount:boolean
  board:boolean
  bookingPermission:boolean
  canViewAllCoachInvoice:boolean
  coachActiveInActive:boolean
  seatTransfer:boolean
  ticketCancel:boolean
  vipSeatAllowToSale:boolean
  showDiscountEndDate:string;
  showDiscountFromDate:string;
  isPrepaid:boolean;
  showOwnCounterBoardingPoint: boolean
  aifs: boolean
}

export interface IAuthenticationProps {
  branchId: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  phone: string;
  id: string;
  address?: string;
  branchInfo: IBranchInformationProps;
  counter: ICounter;
  permission:IPermission
}
export const shareAuthentication = (): IAuthenticationProps => {
  const token =
    shareWithCookies("get", `${appConfiguration.appCode}token`)?.toString() ||
    "";
  let authData;

  if (token) {
    authData = jwtDecode(token) as any;
  }

  return {
    branchId: authData?.branch || "",
    name: formatter({ type: "words", words: authData?.name }) || "",
    email: authData?.email || "",
    avatar: authData?.avatar || "",
    role: authData?.role?.toLowerCase() || "",
    branchInfo: authData?.branchInfo,
    phone: authData?.phone || "",
    id: authData?.id || "",
    address: authData?.address || "",
    counter: authData?.counter,
    permission:authData?.permission
  };
};
