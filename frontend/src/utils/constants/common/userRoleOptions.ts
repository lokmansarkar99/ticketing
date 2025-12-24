export interface IUserRoleOptionProps {
  label: {
    en: string;
    bn: string;
  };
  key: string;
}

const userRoleOptions: IUserRoleOptionProps[] = [
  {
    label: {
      en: "Supervisor",
      bn: "সুপারভাইজার",
    },
    key: "SUPERVISOR",
  },
];
export default userRoleOptions;
