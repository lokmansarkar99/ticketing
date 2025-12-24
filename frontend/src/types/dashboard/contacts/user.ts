export type User = {
  id: number;
  userName: string;
  email: string;
  role: {
    id:number;
    name: string
  };
  contactNo: string;
  address: string;
  active: boolean;
  avatar: string;
  dateOfBirth: string;
  maritalStatus: "Married" | "Single";
  gender: "Male" | "Female" | "Other";
  bloodGroup: "a+" | "a-" | "b+" | "b-" | "ab+" | "ab-" | "o+" | "o-";
};
export type Permission = {
  id: number;
  name: string;
};
export type Role = {
  id: number;
  name: string;
};
