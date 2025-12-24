import {
  IAuthenticationProps,
  shareAuthentication,
} from "@/utils/helpers/shareAuthentication";
import { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ICallcenterRoutesProps {
  children: ReactNode;
}
const CallcenterRoutes: FC<ICallcenterRoutesProps> = ({ children }) => {
  const location = useLocation();

  const authenticationData = shareAuthentication() as IAuthenticationProps;
  if (authenticationData?.role !== "callcenter") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default CallcenterRoutes;
