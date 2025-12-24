export type Counter = {
  id: number;
  type: string;
  name: string;
  address: string;
  landMark: string | null;
  locationUrl: string | null;
  phone: string | null;
  mobile: string | null;
  fax: string | null;
  email: string | null;
  primaryContactPersonName: string;
  country: string;
  stationId: number;
  status: boolean;
  bookingAllowStatus: string;
  bookingAllowClass: string;
  zone: string | null;
  isSmsSend: boolean;
  createdAt: string;
  updatedAt: string;
  isSegment:boolean
  station:{
    name:string;
  }
};
