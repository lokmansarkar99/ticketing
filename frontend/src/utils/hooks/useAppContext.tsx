import { AppContext, IAppContextProps } from "@/context/AppContext";
import { useContext } from "react";

export const useAppContext = (): IAppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};
