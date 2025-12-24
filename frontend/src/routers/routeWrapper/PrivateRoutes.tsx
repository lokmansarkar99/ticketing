import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface IPrivateRoutesProps {
  children: ReactNode;
}

const PrivateRoutes: FC<IPrivateRoutesProps> = ({ children }) => {
  const location = useLocation();
  const { email, phone,  } = shareAuthentication();
 
    if (!email || !phone) {
      return <Navigate to="/customer-auth" state={{ from: location }} replace />;
    }
  return <>{children}</>;
};

export default PrivateRoutes;
