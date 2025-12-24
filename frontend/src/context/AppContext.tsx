import { shareWithLocal } from "@/utils/helpers/shareWithLocal";
import { FC, ReactNode, createContext, useEffect, useState } from "react";

export interface IAppContextProps {
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
  route: string;
  setRoute: (route: string) => void;
}

export const AppContext = createContext<IAppContextProps | undefined>(
  undefined
);

interface IAppProviderProps {
  children: ReactNode;
}

export const AppProvider: FC<IAppProviderProps> = ({ children }) => {
  // DASHBOARD SIDEBAR STATE
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(
    shareWithLocal("get", "sidebar") as boolean
  );
  // // DASHBOARD SIDEBAR GROUP ROUTE STATE
  const [route, setRoute] = useState<string>("dashboard");

  // // RETRIEVE PREVIOUS ROUTE AFTER LOADING PAGE
  useEffect(() => {
    if (route === "") {
      setRoute(shareWithLocal("get", "route") as string);
    } else {
      shareWithLocal("set", "route", route);
    }
    shareWithLocal("set", "sidebar", sidebarOpen);
  }, [route, sidebarOpen]);

  const state = {
    sidebarOpen,
    setSidebarOpen,
    route,
    setRoute,
  };

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
