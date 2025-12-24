import { Station } from "./station";
import { ViaRoute } from "./viaRoute";

export type Route = {
  id: number;
  routeType: string;
  routeDirection: string;
  kilo: number | null;
  isPassengerInfoRequired: boolean;
  via: string | null;
  routeName: string;
  from: number;
  to: number;
  createdAt: string;
  updatedAt: string;
  fromStation: Station;
  toStation: Station;
  viaRoute: ViaRoute[];
};
