import ReserveList from "@/pages/dashboard/admin/reserve/ReserveList";
import CoachList from "@/pages/dashboard/vehiclesSchedule/coach/CoachList";
import ConfigurationList from "@/pages/dashboard/vehiclesSchedule/coach/configuration/ConfigurationList";
import FareList from "@/pages/dashboard/vehiclesSchedule/fare/FareList";
import PartialInfoList from "@/pages/dashboard/vehiclesSchedule/partial/PartialInfoList";
import RouteList from "@/pages/dashboard/vehiclesSchedule/route/RouteList";
import ScheduleList from "@/pages/dashboard/vehiclesSchedule/schedule/ScheduleList";
import SeatList from "@/pages/dashboard/vehiclesSchedule/seat/SeatList";
import SeatPlanList from "@/pages/dashboard/vehiclesSchedule/seatPlan/SeatPlan";
import StationList from "@/pages/dashboard/vehiclesSchedule/station/StationList";
import VehiclesList from "@/pages/dashboard/vehiclesSchedule/vehicles/VehiclesList";
import React, { ReactNode } from "react";

export interface IRouteProps {
  path: string;
  element: ReactNode;
  loader?: any;
}

export const vehiclesSchedule: IRouteProps[] = [
  {
    path: "coach_list",
    element: React.createElement(CoachList),
  },
  {
    path: "reserve_list",
    element: React.createElement(ReserveList),
  },
  {
    path: "schedule_list",
    element: React.createElement(ScheduleList),
  },

  {
    path: "vehicles_list",
    element: React.createElement(VehiclesList),
  },
  {
    path: "route_list",
    element: React.createElement(RouteList),
  },
  {
    path: "station_list",
    element: React.createElement(StationList),
  },
  {
    path: "coach_configs",
    element: React.createElement(ConfigurationList),
  },
  {
    path: "fare_list",
    element: React.createElement(FareList),
  },
  {
    path: "seat_plan_list",
    element: React.createElement(SeatPlanList),
  },
  {
    path: "seat_list",
    element: React.createElement(SeatList),
  },
  {
    path: "partial_info",
    element: React.createElement(PartialInfoList),
  },
  // {
  //   path: "update_coach_config",
  //   element: React.createElement(PartialInfoList),
  // },
];
