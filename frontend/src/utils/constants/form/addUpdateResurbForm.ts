import { ILabelPlaceholder } from "./loginForm";

interface IReservationFormProps {
  registrationNo: ILabelPlaceholder;
  routeId: ILabelPlaceholder;
  fromDate: ILabelPlaceholder;
  fromDateTime: ILabelPlaceholder;
  toDate: ILabelPlaceholder;
  toDateTime: ILabelPlaceholder;
  passengerName: ILabelPlaceholder;
  contactNo: ILabelPlaceholder;
  address: ILabelPlaceholder;
  amount: ILabelPlaceholder;
  paidAmount: ILabelPlaceholder;
  dueAmount: ILabelPlaceholder;
  remarks: ILabelPlaceholder;
  noOfSeat: ILabelPlaceholder;
  fromStationId: ILabelPlaceholder;
  destinationStationId: ILabelPlaceholder;
  coachClass: ILabelPlaceholder;
}

export const addUpdateResurbForm: IReservationFormProps = {
  registrationNo: {
    label: {
      en: "Registration Number",
      bn: "নিবন্ধন নম্বর",
    },
    placeholder: {
      en: "Enter registration number",
      bn: "নিবন্ধন নম্বর লিখুন",
    },
  },
  routeId: {
    label: {
      en: "Route",
      bn: "রুট",
    },
    placeholder: {
      en: "Select route",
      bn: "রুট নির্বাচন করুন",
    },
  },
  fromDate: {
    label: {
      en: "From Date",
      bn: "শুরুর তারিখ",
    },
    placeholder: {
      en: "Select from date",
      bn: "শুরুর তারিখ নির্বাচন করুন",
    },
  },
  fromDateTime: {
    label: {
      en: "From DateTime",
      bn: "শুরুর সময়",
    },
    placeholder: {
      en: "Select from date and time",
      bn: "শুরুর সময় নির্বাচন করুন",
    },
  },
  toDate: {
    label: {
      en: "To Date",
      bn: "শেষ তারিখ",
    },
    placeholder: {
      en: "Select to date",
      bn: "শেষ তারিখ নির্বাচন করুন",
    },
  },
  toDateTime: {
    label: {
      en: "To DateTime",
      bn: "শেষ সময়",
    },
    placeholder: {
      en: "Select to date and time",
      bn: "শেষ সময় নির্বাচন করুন",
    },
  },
  passengerName: {
    label: {
      en: "Passenger Name",
      bn: "যাত্রীর নাম",
    },
    placeholder: {
      en: "Enter passenger name",
      bn: "যাত্রীর নাম লিখুন",
    },
  },
  contactNo: {
    label: {
      en: "Contact Number",
      bn: "যোগাযোগ নম্বর",
    },
    placeholder: {
      en: "Enter contact number",
      bn: "যোগাযোগ নম্বর লিখুন",
    },
  },
  address: {
    label: {
      en: "Address",
      bn: "ঠিকানা",
    },
    placeholder: {
      en: "Enter address",
      bn: "ঠিকানা লিখুন",
    },
  },
  amount: {
    label: {
      en: "Amount",
      bn: "পরিমাণ",
    },
    placeholder: {
      en: "Enter amount",
      bn: "পরিমাণ লিখুন",
    },
  },
  paidAmount: {
    label: {
      en: "Paid Amount",
      bn: "প্রদত্ত পরিমাণ",
    },
    placeholder: {
      en: "Enter paid amount",
      bn: "প্রদত্ত পরিমাণ লিখুন",
    },
  },
  dueAmount: {
    label: {
      en: "Due Amount",
      bn: "বাকি পরিমাণ",
    },
    placeholder: {
      en: "calculated due amount",
      bn: "বাকি পরিমাণ দেখুন",
    },
  },
  remarks: {
    label: {
      en: "Note",
      bn: "মন্তব্য",
    },
    placeholder: {
      en: "Enter Note",
      bn: "মন্তব্য লিখুন",
    },
  },
  noOfSeat: {
    label: {
      en: "Number of Seats",
      bn: "আসনের সংখ্যা",
    },
    placeholder: {
      en: "Enter number of seats",
      bn: "আসনের সংখ্যা লিখুন",
    },
  },
  fromStationId: {
    label: { en: "From Station", bn: "যাত্রা শুরুর স্টেশন" },
    placeholder: {
      en: "Select from station",
      bn: "যাত্রা শুরুর স্টেশন নির্বাচন করুন",
    },
  },
  destinationStationId: {
    label: { en: "Destination Station", bn: "গন্তব্য স্টেশন" },
    placeholder: {
      en: "Select destination station",
      bn: "গন্তব্য স্টেশন নির্বাচন করুন",
    },
  },
  coachClass: {
    label: { en: "Coach Class", bn: "কোচ শ্রেণী" },
    placeholder: { en: "Select coach class", bn: "কোচ শ্রেণী নির্বাচন করুন" },
  },
};
