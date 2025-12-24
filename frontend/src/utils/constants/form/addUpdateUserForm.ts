import { ILabelPlaceholder } from "./loginForm";

export interface IAddUpdateUserFormProps {
  userName: ILabelPlaceholder;
  guideName: ILabelPlaceholder;
  email: ILabelPlaceholder;
  password: ILabelPlaceholder;
  rePassword: ILabelPlaceholder;
  role: ILabelPlaceholder;
  dateOfBirth: ILabelPlaceholder;
  contactNo: ILabelPlaceholder;
  gender: ILabelPlaceholder;
  maritalStatus: ILabelPlaceholder;
  bloodGroup: ILabelPlaceholder;
  address: ILabelPlaceholder;
  avatar: ILabelPlaceholder;
  roleId: ILabelPlaceholder;
  counterId: ILabelPlaceholder;
}

const addUpdateUserForm: IAddUpdateUserFormProps = {
  guideName: {
    label: {
      en: "Guide Name ✼",
      bn: "ব্যবহৃত নাম ✼",
    },
    placeholder: {
      en: "Enter your guide name",
      bn: "আপনার ব্যবহৃত নাম লিখুন",
    },
  },
  userName: {
    label: {
      en: "User Name ✼",
      bn: "ব্যবহৃত নাম ✼",
    },
    placeholder: {
      en: "Enter your user name",
      bn: "আপনার ব্যবহৃত নাম লিখুন",
    },
  },
  roleId: {
    label: {
      en: "Role Name ✼",
      bn: "ভূমিকা নাম ✼",
    },
    placeholder: {
      en: "Select Role",
      bn: "আপনার ভূমিকা নির্বাচন করুন",
    },
  },
  counterId: {
    label: {
      en: "Counter Name ✼",
      bn: "কাউন্টার নাম ✼",
    },
    placeholder: {
      en: "Enter counter",
      bn: "আপনার কাউন্টার নির্বাচন করুন",
    },
  },
  email: {
    label: {
      en: "Email Address",
      bn: "ইমেইল ঠিকানা",
    },
    placeholder: {
      en: "Enter your valid email address",
      bn: "আপনার বৈধ ইমেইল ঠিকানা লিখুন",
    },
  },
  password: {
    label: {
      en: "Password ✼",
      bn: "পাসওয়ার্ড ✼",
    },
    placeholder: {
      en: "Enter a strong password (min. 8 characters)",
      bn: "একটি শক্তিশালী পাসওয়ার্ড লিখুন (ন্যূনতম ৮ অক্ষর)",
    },
  },
  rePassword: {
    label: {
      en: "Confirm Password ✼",
      bn: "পাসওয়ার্ড নিশ্চিত করুন ✼",
    },
    placeholder: {
      en: "Re-enter your password to confirm",
      bn: "পাসওয়ার্ডটি নিশ্চিত করতে পুনরায় লিখুন",
    },
  },
  role: {
    label: {
      en: "User Role ✼",
      bn: "ব্যবহারকারীর ভূমিকা ✼",
    },
    placeholder: {
      en: "Select your role (e.g., Admin, User)",
      bn: "আপনার ভূমিকা নির্বাচন করুন (যেমন, অ্যাডমিন, ব্যবহারকারী)",
    },
  },
  dateOfBirth: {
    label: {
      en: "Date of Birth",
      bn: "জন্ম তারিখ",
    },
    placeholder: {
      en: "Select your date of birth (DD/MM/YYYY)",
      bn: "আপনার জন্ম তারিখ নির্বাচন করুন (দিন/মাস/বছর)",
    },
  },
  contactNo: {
    label: {
      en: "Contact Number ✼",
      bn: "যোগাযোগের নম্বর ✼",
    },
    placeholder: {
      en: "Enter your phone number (e.g., +8801XXXXXXXXX)",
      bn: "আপনার ফোন নম্বর লিখুন (যেমন, +৮৮০১XXXXXXXXX)",
    },
  },
  gender: {
    label: {
      en: "Gender",
      bn: "লিঙ্গ",
    },
    placeholder: {
      en: "Select your gender (Male, Female, Other)",
      bn: "আপনার লিঙ্গ নির্বাচন করুন (পুরুষ, মহিলা, অন্যান্য)",
    },
  },
  maritalStatus: {
    label: {
      en: "Marital Status",
      bn: "বৈবাহিক অবস্থা",
    },
    placeholder: {
      en: "Select your marital status (Single, Married)",
      bn: "আপনার বৈবাহিক অবস্থা নির্বাচন করুন (অবিবাহিত, বিবাহিত)",
    },
  },
  bloodGroup: {
    label: {
      en: "Blood Group",
      bn: "রক্তের গ্রুপ",
    },
    placeholder: {
      en: "Select your blood group (e.g., A+, O-)",
      bn: "আপনার রক্তের গ্রুপ নির্বাচন করুন (যেমন, A+, O-)",
    },
  },
  address: {
    label: {
      en: "Residential Address",
      bn: "বাসার ঠিকানা",
    },
    placeholder: {
      en: "Enter your complete address (House, Street, City)",
      bn: "আপনার সম্পূর্ণ ঠিকানা লিখুন (বাড়ি, রাস্তা, শহর)",
    },
  },
  avatar: {
    label: {
      en: "Profile Picture",
      bn: "প্রোফাইল ছবি",
    },
    placeholder: {
      en: "Upload your profile picture",
      bn: "আপনার প্রোফাইল ছবি আপলোড করুন",
    },
  },
};

export default addUpdateUserForm;
