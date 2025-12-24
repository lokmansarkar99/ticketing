import { Route } from "./route";
import { Station } from "./station";

export type ViaRoute = {
  id: number;
  routeId: number;
  stationId: number;
  createdAt: string;
  updatedAt: string;
  route: Route;
  station: Station;
};
