import { Station } from "../vehicleeSchedule.ts/station";

export type Counter = {
  id: number;
  type: string;
  name: string;
  address: string;
  landMark: string;
  locationUrl: string;
  phone: string;
  mobile: string;
  fax: string;
  email: string;
  primaryContactPersonName: string;
  country: string;
  stationId: number;
  status: boolean;
  bookingAllowStatus: string;
  bookingAllowClass: string;
  zone: string;
  isSmsSend: boolean;
  createdAt: string;
  updatedAt: string;
  station: Station;
};
