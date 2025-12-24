import {
  IAuthenticationProps,
  shareAuthentication,
} from "@/utils/helpers/shareAuthentication";
import { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface IAdminRoutesProps {
  children: ReactNode;
}
const AdminRoutes: FC<IAdminRoutesProps> = ({ children }) => {
  const location = useLocation();

  const authenticationData = shareAuthentication() as IAuthenticationProps;
  if (authenticationData?.role !== "admin") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default AdminRoutes;
