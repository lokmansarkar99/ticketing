export interface Reserve {
  id: number;
  registrationNo: string;
  routeId: number;
  route:{
    routeName:string
  }
  noOfSeat: number;
  fromDate: string;
  fromDateTime: string;
  toDate: string;
  toDateTime: string;
  passengerName: string;
  contactNo: string;
  address: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  remarks?: string;
}
