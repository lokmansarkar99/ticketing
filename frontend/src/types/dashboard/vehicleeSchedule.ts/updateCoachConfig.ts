import { Driver } from "../contacts/driver";
import { Helper } from "../contacts/helper";
import { Counter } from "./counter";
import { Fare } from "./fare";
import { Route } from "./route";
import { Seat } from "./seat";

export type UpdateCoachConfiguration = {
  id: number;
  coachNo: string;
  registrationNo: string;
  routeId: number;
  supervisorId: number;
  fromCounterId: number;
  fareId: number;
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
  route:Route;
  driver:Driver;
  helper:Helper;
  supervisor:{
    userName:string;
    contactNo:string;
  }
};
