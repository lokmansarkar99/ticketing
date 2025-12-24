import { Counter } from "./counter";
import { Fare } from "./fare";
import { Seat } from "./seat";

export type CoachConfiguration = {
  id: number;
  coachNo: string;
  registrationNo: string;
  routeId: number;
  supervisorId: number;
  fromCounterId: number;
  fareId: number;
  coach:any;
  seatAvailable: number;
  destinationCounterId: number;
  seatPlan: string;
  coachType: string;
  schedule: string;
  departureDate: string;
  type: string;
  active: boolean;
  holdingTime: string;
  fareAllowed: string;
  vipTimeOut: string;
  createdAt: string;
  updatedAt: string;
  CoachConfigSeats: Seat[];
  fromCounter: Counter;
  destinationCounter: Counter;
  fare: Fare;
  route:{
    routeName:string;
  },
};
