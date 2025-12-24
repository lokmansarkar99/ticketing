import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { Counter } from "@/types/dashboard/vehicleeSchedule.ts/counter";
import { setUser } from "../../store/api/user/userSlice";
interface DecodedToken {
  id: string;
  email: string;
  name: string;
  address?: string;
  role: string;
  counter?: Counter;
  counterId?: any;
}

export const loadUserFromToken = async (dispatch: any) => {
  const token = Cookies.get("__t_beta__token");

  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);

      dispatch(
        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          counterId: decoded.counterId ? Number(decoded.counterId) : null,
          address: decoded.counter?.address || "",
          role: decoded.role,
        })
      );
    } catch (error) {
      console.error("Invalid token or error in jwt decoding", error);
    }
  } else {
    // Dispatch an empty user object to avoid `null`
    dispatch(
      setUser({
        id: "",
        counterId: null,
        email: "",
        name: "",
        address: "",
        role: "",
      })
    );
  }
};
