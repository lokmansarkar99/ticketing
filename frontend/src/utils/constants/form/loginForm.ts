export interface ILabelPlaceholder {
  label: {
    en: string;
    bn: string;
  };
  placeholder: {
    en: string;
    bn: string;
  };
}
interface IUserLoginFormProps {
  userName: ILabelPlaceholder;
  password: ILabelPlaceholder;
  rePassword: ILabelPlaceholder;
}

export const userLoginForm: IUserLoginFormProps = {
  userName: {
    label: {
      en: "User Name ✼",
      bn: "নাম ✼",
    },
    placeholder: {
      en: "jhon",
      bn: "jhon",
    },
  },
  password: {
    label: {
      en: "Password ✼",
      bn: "পাসওয়ার্ড ✼",
    },
    placeholder: {
      en: "Enter your password at least 6 characters",
      bn: "আপনার পাসওয়ার্ড লিখুন সর্বনিম্ন ৬টি বর্ণ/ চিহ্ন",
    },
  },
  rePassword: {
    label: {
      en: "Re-enter Your Password",
      bn: "আপনার পুনরায় পাসওয়ার্ড লিখুন",
    },
    placeholder: {
      en: "Re-enter your password",
      bn: "আপনার পুনরায় পাসওয়ার্ড লিখুন",
    },
  },
};
