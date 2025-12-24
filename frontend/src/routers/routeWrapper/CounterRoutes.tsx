import {
  IAuthenticationProps,
  shareAuthentication,
} from "@/utils/helpers/shareAuthentication";
import { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ICounterRoutesProps {
  children: ReactNode;
}
const CounterRoutes: FC<ICounterRoutesProps> = ({ children }) => {
  const location = useLocation();

  const authenticationData = shareAuthentication() as IAuthenticationProps;
  if (authenticationData?.role !== "counter") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default CounterRoutes;
