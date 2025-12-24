import { shareAuthentication } from "./shareAuthentication";

type Role = "admin" | "manager";

export const actionManager = (roles: Role[]) => {
  const { role } = shareAuthentication();
  return roles
    ?.map((singleRole: Role) => singleRole.toLowerCase())
    .includes(role.toLowerCase());
};
