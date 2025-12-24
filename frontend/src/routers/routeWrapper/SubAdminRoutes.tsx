import {
  IAuthenticationProps,
  shareAuthentication,
} from "@/utils/helpers/shareAuthentication";
import { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ISubAdminRoutesProps {
  children: ReactNode;
}
const SubAdminRoutes: FC<ISubAdminRoutesProps> = ({ children }) => {
  const location = useLocation();

  const authenticationData = shareAuthentication() as IAuthenticationProps;
  if (authenticationData?.role !== "subadmin") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default SubAdminRoutes;
