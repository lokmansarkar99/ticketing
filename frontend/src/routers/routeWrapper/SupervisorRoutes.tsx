import {
  IAuthenticationProps,
  shareAuthentication,
} from "@/utils/helpers/shareAuthentication";
import { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ISupervisorRoutesProps {
  children: ReactNode;
}
const SupervisorRoutes: FC<ISupervisorRoutesProps> = ({ children }) => {
  const location = useLocation();

  const authenticationData = shareAuthentication() as IAuthenticationProps;
  if (authenticationData?.role !== "guide") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default SupervisorRoutes;
