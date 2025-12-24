import { Route } from "./route";

  interface CoachConfig {
    id: number;
    coachNo: string;
    registrationNo: string;
    routeId: number;
    supervisorId: number | null;
    driverId: number | null;
    helperId: number | null;
    fromCounterId: number;
    fareId: number;
    discount: number;
    seatAvailable: number;
    tokenAvailable: number;
    coachClass: string;
    destinationCounterId: number;
    coachType: string;
    schedule: string;
    departureDate: string;
    type: string;
    holdingTime: string;
    note: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    route: Route;
  }
  
  // Define the order seat type
  interface OrderSeat {
    id: number;
    orderId: number;
    coachConfigId: number;
    status: string;
    online: boolean;
    cancelBy: string | null;
    paymentMethod: string;
    schedule: string;
    date: string;
    seat: string;
    unitPrice: number;
    createdAt: string;
    updatedAt: string;
    coachConfig: CoachConfig;
  }
  
  // Define the sales data type
  export interface SaleData {
    id: number;
    orderId: number;
    ticketNo: string;
    counterId: number;
    orderType: string;
    customerName: string;
    phone: string;
    email: string;
    address: string;
    gender: string;
    status: string;
    cancelBy: string | null;
    cancelNote: string | null;
    refundPercentage: number | null;
    refundType: string | null;
    cancelRequest: boolean;
    nid: string;
    nationality: string;
    paymentMethod: string;
    paymentType: string;
    boardingPoint: string;
    droppingPoint: string;
    returnBoardingPoint: string;
    returnDroppingPoint: string;
    noOfSeat: number;
    amount: number;
    paymentAmount: number;
    dueAmount: number;
    payment: boolean;
    partial: boolean;
    partialPaymentAmount: number;
    smsSend: boolean;
    online: boolean;
    date: string;
    returnDate: string | null;
    goods: number;
    grossPay: number;
    goodsDiscount: number;
    netPay: number;
    bookingType: string;
    expiryBookingDate: string | null;
    expiryBookingTime: string | null;
    createdAt: string;
    updatedAt: string;
    orderSeat: OrderSeat[];
  }