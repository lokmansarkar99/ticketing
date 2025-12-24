import { ILabelPlaceholder } from "./loginForm";

interface IAddUpdateCoachFromProps {
  registrationNo: ILabelPlaceholder;
  fromCounterId: ILabelPlaceholder;
  destinationCounterId: ILabelPlaceholder;
  fareId: ILabelPlaceholder;
  routeId: ILabelPlaceholder;
  schedule: ILabelPlaceholder;
  lcCode: ILabelPlaceholder;
  deliveryToDipo: ILabelPlaceholder;
  deliveryDate: ILabelPlaceholder;
  color: ILabelPlaceholder;
  noOfSeat: ILabelPlaceholder;
  coachType: ILabelPlaceholder;
  financedBy: ILabelPlaceholder;
  terms: ILabelPlaceholder;
  active: ILabelPlaceholder;
  coachNo: ILabelPlaceholder;
}

export const addUpdateCoachForm: IAddUpdateCoachFromProps = {
  registrationNo: {
    label: {
      en: "Registration Number ✼",
      bn: "নিবন্ধন নম্বর ✼",
    },
    placeholder: {
      en: "Enter registration number",
      bn: "নিবন্ধন নম্বর লিখুন",
    },
  },
  coachNo: {
    label: {
      en: "Coach Number ✼",
      bn: "কোচ নম্বর ✼",
    },
    placeholder: {
      en: "Enter coach number",
      bn: "কোচ নম্বর লিখুন",
    },
  },
  fromCounterId: {
    label: {
      en: "From Counter",
      bn: "কাউন্টার থেকে",
    },
    placeholder: {
      en: "From Counter",
      bn: "কাউন্টার থেকে",
    },
  },
  destinationCounterId: {
    label: {
      en: "Destination Counter",
      bn: "গন্তব্য কাউন্টার",
    },
    placeholder: {
      en: "Destination Counter",
      bn: "গন্তব্য কাউন্টার",
    },
  },
  fareId: {
    label: {
      en: "Fare Amount",
      bn: "ভাড়ার পরিমাণ",
    },
    placeholder: {
      en: "Fare amount",
      bn: "ভাড়ার পরিমাণ",
    },
  },
  routeId: {
    label: {
      en: "Enter route",
      bn: "রুট নম্বর",
    },
    placeholder: {
      en: "Enter Route",
      bn: "রুট নম্বর লিখুন",
    },
  },
  schedule: {
    label: {
      en: "schedule",
      bn: "সময়সূচী",
    },
    placeholder: {
      en: "schedule",
      bn: "সময়সূচী",
    },
  },
  lcCode: {
    label: {
      en: "LC Code",
      bn: "এলসি কোড",
    },
    placeholder: {
      en: "Enter LC code",
      bn: "এলসি কোড লিখুন",
    },
  },
  deliveryToDipo: {
    label: {
      en: "Delivery to Depot",
      bn: "ডিপোতে ডেলিভারি",
    },
    placeholder: {
      en: "Enter delivery to depot",
      bn: "ডিপোতে ডেলিভারি লিখুন",
    },
  },
  deliveryDate: {
    label: {
      en: "Delivery Date",
      bn: "ডেলিভারি তারিখ",
    },
    placeholder: {
      en: "Select delivery date",
      bn: "ডেলিভারি তারিখ নির্বাচন করুন",
    },
  },
  color: {
    label: {
      en: "Coach Color",
      bn: "কোচের রঙ",
    },
    placeholder: {
      en: "Enter coach color",
      bn: "কোচের রঙ লিখুন",
    },
  },
  noOfSeat: {
    label: {
      en: "Number Of Seats ✼",
      bn: "আসনের সংখ্যা ✼",
    },
    placeholder: {
      en: "Enter number of seats",
      bn: "আসনের সংখ্যা লিখুন",
    },
  },
  coachType: {
    label: {
      en: "Coach Type ✼",
      bn: "কোচের ধরন ✼",
    },
    placeholder: {
      en: "Select coach type",
      bn: "কোচের ধরন নির্বাচন করুন",
    },
  },
  financedBy: {
    label: {
      en: "Financed By",
      bn: "কার দ্বারা অর্থায়িত",
    },
    placeholder: {
      en: "Enter financed by",
      bn: "কার দ্বারা অর্থায়িত লিখুন",
    },
  },
  terms: {
    label: {
      en: "Terms",
      bn: "শর্ত",
    },
    placeholder: {
      en: "Enter terms",
      bn: "শর্ত লিখুন",
    },
  },
  active: {
    label: {
      en: "Activity Status ✼",
      bn: "সক্রিয় স্ট্যাটাস ✼",
    },
    placeholder: {
      en: "Select activity status",
      bn: "সক্রিয় স্ট্যাটাস নির্বাচন করুন",
    },
  },
};
