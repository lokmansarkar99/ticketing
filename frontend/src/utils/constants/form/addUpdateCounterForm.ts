import { ILabelPlaceholder } from "./loginForm";

export interface IAddUpdateCounterFormProps {
  type: ILabelPlaceholder;
  name: ILabelPlaceholder;
  address: ILabelPlaceholder;
  landMark: ILabelPlaceholder;
  locationUrl: ILabelPlaceholder;
  phone: ILabelPlaceholder;
  mobile: ILabelPlaceholder;
  fax: ILabelPlaceholder;
  email: ILabelPlaceholder;
  primaryContactPersonName: ILabelPlaceholder;
  country: ILabelPlaceholder;
  stationId: ILabelPlaceholder;
  status: ILabelPlaceholder;
  bookingAllowStatus: ILabelPlaceholder;
  bookingAllowClass: ILabelPlaceholder;
  zone: ILabelPlaceholder;
  isSmsSend: ILabelPlaceholder;
  commissionType: ILabelPlaceholder;
  commission: ILabelPlaceholder;
}

export const addUpdateCounterForm: IAddUpdateCounterFormProps = {
  type: {
    label: {
      en: "Counter Type ✼",
      bn: "কাউন্টার টাইপ ✼",
    },
    placeholder: {
      en: "Select counter type",
      bn: "কাউন্টার টাইপ নির্বাচন করুন",
    },
  },
  name: {
    label: {
      en: "Counter Name ✼",
      bn: "কাউন্টার নাম ✼",
    },
    placeholder: {
      en: "Enter counter name",
      bn: "কাউন্টার নাম লিখুন",
    },
  },
  commissionType: {
    label: {
      en: "Select Comission Type",
      bn: "কমিশন প্রকার",
    },
    placeholder: {
      en: "Select Comission Type",
      bn: "কমিশন প্রকার",
    },
  },
  commission: {
    label: {
      en: "Enter Comission✼",
      bn: "কমিশন লিখুন✼",
    },
    placeholder: {
      en: "Enter Comission",
      bn: "কমিশন লিখুন",
    },
  },
  address: {
    label: {
      en: "Counter Address ✼",
      bn: "কাউন্টারের ঠিকানা ✼",
    },
    placeholder: {
      en: "Enter counter address",
      bn: "কাউন্টারের ঠিকানা লিখুন",
    },
  },
  landMark: {
    label: {
      en: "Counter Landmark",
      bn: "কাউন্টারের ল্যান্ডমার্ক",
    },
    placeholder: {
      en: "Enter counter landmark",
      bn: "কাউন্টারের ল্যান্ডমার্ক লিখুন",
    },
  },
  locationUrl: {
    label: {
      en: "Location URL",
      bn: "অবস্থান URL",
    },
    placeholder: {
      en: "Enter location URL",
      bn: "অবস্থান URL লিখুন",
    },
  },
  phone: {
    label: {
      en: "Phone Number",
      bn: "ফোন নম্বর",
    },
    placeholder: {
      en: "Enter phone number",
      bn: "ফোন নম্বর লিখুন",
    },
  },
  mobile: {
    label: {
      en: "Mobile Number ✼",
      bn: "মোবাইল নম্বর ✼",
    },
    placeholder: {
      en: "Enter mobile number",
      bn: "মোবাইল নম্বর লিখুন",
    },
  },
  fax: {
    label: {
      en: "Fax Number",
      bn: "ফ্যাক্স নম্বর",
    },
    placeholder: {
      en: "Enter fax number",
      bn: "ফ্যাক্স নম্বর লিখুন",
    },
  },
  email: {
    label: {
      en: "Email Address",
      bn: "ইমেল ঠিকানা",
    },
    placeholder: {
      en: "Enter email address",
      bn: "ইমেল ঠিকানা লিখুন",
    },
  },
  primaryContactPersonName: {
    label: {
      en: "Primary Contact Person Name ✼",
      bn: "প্রধান যোগাযোগ ব্যক্তির নাম ✼",
    },
    placeholder: {
      en: "Enter primary contact person name",
      bn: "প্রধান যোগাযোগ ব্যক্তির নাম লিখুন",
    },
  },
  country: {
    label: {
      en: "Country Name",
      bn: "দেশের নাম",
    },
    placeholder: {
      en: "Enter country name",
      bn: "দেশের নাম লিখুন",
    },
  },
  stationId: {
    label: {
      en: "Station ✼",
      bn: "স্টেশন ✼",
    },
    placeholder: {
      en: "Select station",
      bn: "স্টেশন নির্বাচন করুন",
    },
  },
  status: {
    label: {
      en: "Status ✼",
      bn: "অবস্থা ✼",
    },
    placeholder: {
      en: "Select status",
      bn: "অবস্থা নির্বাচন করুন",
    },
  },
  bookingAllowStatus: {
    label: {
      en: "Booking Allow Status",
      bn: "বুকিং অনুমতি অবস্থা",
    },
    placeholder: {
      en: "Select booking allow status",
      bn: "বুকিং অনুমতি অবস্থা নির্বাচন করুন",
    },
  },
  bookingAllowClass: {
    label: {
      en: "Booking Allow Class",
      bn: "বুকিং অনুমতি ক্লাস",
    },
    placeholder: {
      en: "Select booking allow class",
      bn: "বুকিং অনুমতি ক্লাস নির্বাচন করুন",
    },
  },
  zone: {
    label: {
      en: "Zone",
      bn: "জোন",
    },
    placeholder: {
      en: "Enter zone",
      bn: "জোন লিখুন",
    },
  },
  isSmsSend: {
    label: {
      en: "Do You Want To Send SMS? ✼",
      bn: "আপনি কে এসএমএস পাঠাতে চান? ✼",
    },
    placeholder: {
      en: "Do you want to send sms?",
      bn: "আপনি কে এসএমএস পাঠাতে চান?",
    },
  },
};
