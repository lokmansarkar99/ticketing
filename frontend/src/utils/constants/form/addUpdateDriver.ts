import { ILabelPlaceholder } from "./loginForm";

interface IAddUpdateDriverFormProps {
  name: ILabelPlaceholder;
  email: ILabelPlaceholder;
  contactNo: ILabelPlaceholder;
  dateOfBirth: ILabelPlaceholder;
  gender: ILabelPlaceholder;
  maritalStatus: ILabelPlaceholder;
  bloodGroup: ILabelPlaceholder;
  address: ILabelPlaceholder;
  avatar: ILabelPlaceholder;
  licenseNumber: ILabelPlaceholder;
  licenseIssueDate: ILabelPlaceholder;
  licenseExpDate: ILabelPlaceholder;
  licensePhoto: ILabelPlaceholder;
  emergencyNumber: ILabelPlaceholder;
  referenceBy: ILabelPlaceholder;
}

export const addUpdateDriverForm: IAddUpdateDriverFormProps = {
  licenseNumber: {
    label: {
      en: "License Number ✼",
      bn: "ড্রাইভিং লাইসেন্স নম্বর ✼",
    },
    placeholder: {
      en: "Enter your license number",
      bn: "আপনার লাইসেন্স নম্বর লিখুন",
    },
  },
  licenseIssueDate: {
    label: {
      en: "License Issue Date ✼",
      bn: "ড্রাইভিং লাইসেন্স ইস্যু তারিখ ✼",
    },
    placeholder: {
      en: "Select license issue date",
      bn: "লাইসেন্স ইস্যু তারিখ নির্বাচন করুন",
    },
  },
  licenseExpDate: {
    label: {
      en: "Driving License Expire Date ✼",
      bn: "লাইসেন্স মেয়াদ শেষ হওয়ার তারিখ ✼",
    },
    placeholder: {
      en: "Select license expire date",
      bn: "লাইসেন্স মেয়াদ শেষ তারিখ নির্বাচন করুন",
    },
  },
  licensePhoto: {
    label: {
      en: "Driving License Photo ✼",
      bn: "ড্রাইভিং লাইসেন্সের ছবি ✼",
    },
    placeholder: {
      en: "Select driving license photo",
      bn: "ড্রাইভিং লাইসেন্সের ছবি নির্বাচন করুন",
    },
  },
  emergencyNumber: {
    label: {
      en: "Emergency Number ✼",
      bn: "জরুরি নম্বর ✼",
    },
    placeholder: {
      en: "Select emergency number",
      bn: "জরুরি নম্বর নির্বাচন করুন",
    },
  },
  referenceBy: {
    label: {
      en: "Reference by ✼",
      bn: "রেফারেন্সকারী ✼",
    },
    placeholder: {
      en: "Enter reference by",
      bn: "রেফারেন্সকারী লিখুন",
    },
  },

  name: {
    label: {
      en: "Full Name ✼",
      bn: "পুরো নাম ✼",
    },
    placeholder: {
      en: "Enter your full name (First and Last)",
      bn: "আপনার পুরো নাম লিখুন (প্রথম ও শেষ নাম)",
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
  contactNo: {
    label: {
      en: "Contact Number ✼",
      bn: "যোগাযোগের নম্বর ✼",
    },
    placeholder: {
      en: "Enter your phone number",
      bn: "আপনার ফোন নম্বর লিখুন",
    },
  },
  dateOfBirth: {
    label: {
      en: "Date of Birth",
      bn: "জন্ম তারিখ",
    },
    placeholder: {
      en: "Select your date of birth",
      bn: "আপনার জন্ম তারিখ নির্বাচন করুন",
    },
  },
  gender: {
    label: {
      en: "Gender",
      bn: "লিঙ্গ",
    },
    placeholder: {
      en: "Select your gender",
      bn: "আপনার লিঙ্গ নির্বাচন করুন",
    },
  },
  maritalStatus: {
    label: {
      en: "Select Marital Status",
      bn: "বৈবাহিক অবস্থা  নির্বাচন করুন",
    },
    placeholder: {
      en: "Select your marital status",
      bn: "আপনার বৈবাহিক অবস্থা নির্বাচন করুন",
    },
  },
  bloodGroup: {
    label: {
      en: "Blood Group",
      bn: "রক্তের গ্রুপ",
    },
    placeholder: {
      en: "Select your blood group",
      bn: "আপনার রক্তের গ্রুপ নির্বাচন করুন",
    },
  },
  address: {
    label: {
      en: "Residential Address",
      bn: "বাসার ঠিকানা",
    },
    placeholder: {
      en: "House, Street, City",
      bn: "বাড়ি, রাস্তা, শহর",
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
