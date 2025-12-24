import {
  IAuthenticationProps,
  shareAuthentication,
} from "@/utils/helpers/shareAuthentication";
import { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface IAccountsRoutesProps {
  children: ReactNode;
}
const AccountsRoutes: FC<IAccountsRoutesProps> = ({ children }) => {
  const location = useLocation();

  const authenticationData = shareAuthentication() as IAuthenticationProps;
  if (authenticationData?.role !== "accounts") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default AccountsRoutes;
