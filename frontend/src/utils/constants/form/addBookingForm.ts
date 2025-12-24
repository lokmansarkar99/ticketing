import { ILabelPlaceholder } from "./loginForm";

export interface IAddBookingFromProps {
  name: ILabelPlaceholder;
  paymentType: ILabelPlaceholder;
  paymentAmount: ILabelPlaceholder;
  email: ILabelPlaceholder;
  phone: ILabelPlaceholder;
  gender: ILabelPlaceholder;
  address: ILabelPlaceholder;
  passportOrNID: ILabelPlaceholder;
  nationality: ILabelPlaceholder;
  boardingPoint: ILabelPlaceholder;
  droppingPoint: ILabelPlaceholder;
  returnBoardingPoint: ILabelPlaceholder;
  returnDroppingPoint: ILabelPlaceholder;
  paymentMethod: ILabelPlaceholder;
}

export const addBookingSeatForm: IAddBookingFromProps = {
  name: {
    label: {
      en: "Name ",
      bn: "নাম ",
    },
    placeholder: {
      en: "Enter your name",
      bn: "আপনার নাম লিখুন",
    },
  },
  paymentAmount: {
    label: {
      en: "Partial Payment ✼",
      bn: "আংশিক পেমেন্ট ✼",
    },
    placeholder: {
      en: "Enter partial payment",
      bn: "আংশিক পেমেন্ট লিখুন",
    },
  },

  paymentType: {
    label: {
      en: "Payment Type",
      bn: "পেমেন্ট প্রকার",
    },
    placeholder: {
      en: "Enter Payment Type",
      bn: "আপনার পেমেন্ট প্রকার",
    },
  },
  gender: {
    label: {
      en: "Gender",
      bn: "জেন্ডার",
    },
    placeholder: {
      en: "Enter your gender",
      bn: "আপনার জেন্ডার",
    },
  },
  email: {
    label: {
      en: "Email",
      bn: "ইমেইল",
    },
    placeholder: {
      en: "Enter your email",
      bn: "আপনার ইমেইল লিখুন",
    },
  },
  phone: {
    label: {
      en: "Phone ✼",
      bn: "ফোন ✼",
    },
    placeholder: {
      en: "Enter your phone number",
      bn: "আপনার ফোন নম্বর লিখুন",
    },
  },

  address: {
    label: {
      en: "Address",
      bn: "ঠিকানা",
    },
    placeholder: {
      en: "Enter your address",
      bn: "আপনার ঠিকানা লিখুন",
    },
  },
  passportOrNID: {
    label: {
      en: "Passport or NID",
      bn: "পাসপোর্ট বা এনআইডি",
    },
    placeholder: {
      en: "Enter Passport or NID No:",
      bn: "আপনার পাসপোর্ট বা এনআইডি নম্বর লিখুন",
    },
  },
  nationality: {
    label: {
      en: "Nationality",
      bn: "জাতীয়তা",
    },
    placeholder: {
      en: "Select your nationality",
      bn: "আপনার জাতীয়তা ",
    },
  },
  boardingPoint: {
    label: {
      en: "Boarding Point",
      bn: "বোর্ডিং পয়েন্ট",
    },
    placeholder: {
      en: "Enter your boarding point",
      bn: "আপনার বোর্ডিং পয়েন্ট লিখুন",
    },
  },

  droppingPoint: {
    label: {
      en: "Dropping Point",
      bn: "ফিরে আসা ড্রপিং পয়েন্ট",
    },
    placeholder: {
      en: "Enter your dropping point",
      bn: "আপনার ফিরে আসা ড্রপিং পয়েন্ট লিখুন",
    },
  },
  returnBoardingPoint: {
    label: {
      en: "Return Boarding Point",
      bn: "ফিরে আসা বোর্ডিং পয়েন্ট",
    },
    placeholder: {
      en: "Enter your Return boarding point",
      bn: "আপনার ফিরে আসা বোর্ডিং পয়েন্ট লিখুন",
    },
  },
  returnDroppingPoint: {
    label: {
      en: "Return Dropping Point",
      bn: "ফিরে আসা বোর্ডিং পয়েন্ট",
    },
    placeholder: {
      en: "Enter your return dropping point",
      bn: "আপনার ফিরে আসা বোর্ডিং পয়েন্ট লিখুন",
    },
  },
  paymentMethod: {
    label: {
      en: "Payment Method",
      bn: "পেমেন্ট পদ্ধতি",
    },
    placeholder: {
      en: "Select your payment method",
      bn: "আপনার পেমেন্ট পদ্ধতি নির্বাচন করুন",
    },
  },
};
