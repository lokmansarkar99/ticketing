import { ILabelPlaceholder } from "./loginForm";

export interface IAddUpdateFareFromProps {
  route: ILabelPlaceholder;
  seatPlan: ILabelPlaceholder;
  type: ILabelPlaceholder;
  fromDate: ILabelPlaceholder;
  toDate: ILabelPlaceholder;
  amount: ILabelPlaceholder;
}

export const addUpdateFareForm: IAddUpdateFareFromProps = {
  route: {
    label: {
      en: "Route Name ✼",
      bn: "রুট নাম ✼",
    },
    placeholder: {
      en: "Select route name",
      bn: "রুট নাম নির্বাচন করুন",
    },
  },
  seatPlan: {
    label: {
      en: "Seat Plan ✼",
      bn: "সিট প্ল্যান ✼",
    },
    placeholder: {
      en: "Select seat plan",
      bn: "সিট প্ল্যান নির্বাচন করুন",
    },
  },
  type: {
    label: {
      en: "Coach Type ✼",
      bn: "কোচের ধরন ✼",
    },
    placeholder: {
      en: "Select coach type",
      bn: "কোচের ধরন নির্বাচন করুন",
    },
  },
  fromDate: {
    label: {
      en: "Starting Date",
      bn: "শুরুর তারিখ",
    },
    placeholder: {
      en: "Select the starting date",
      bn: "শুরুর তারিখ নির্বাচন করুন",
    },
  },
  toDate: {
    label: {
      en: "Ending Date",
      bn: "শেষ তারিখ",
    },
    placeholder: {
      en: "Select the ending date",
      bn: "শেষ তারিখ নির্বাচন করুন",
    },
  },
  amount: {
    label: {
      en: "Fare Amount ✼",
      bn: "ভাড়া পরিমাণ ✼",
    },
    placeholder: {
      en: "Enter fare amount",
      bn: "ভাড়ার পরিমাণ লিখুন",
    },
  },
};
