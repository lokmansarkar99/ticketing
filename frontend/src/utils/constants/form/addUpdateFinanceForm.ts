import { ILabelPlaceholder } from "./loginForm";

interface IAddUpdateFinanceFormProps {
  investorId: ILabelPlaceholder;
  investingBalances: ILabelPlaceholder;
  investingType: ILabelPlaceholder;
  interest: ILabelPlaceholder;
  note: ILabelPlaceholder;
}
export const addUpdateFinanceForm: IAddUpdateFinanceFormProps = {
  investorId: {
    label: {
      en: "Investor ID",
      bn: "বিনিয়োগকারী আইডি",
    },
    placeholder: {
      en: "Enter the investor ID",
      bn: "বিনিয়োগকারী আইডি লিখুন",
    },
  },
  investingBalances: {
    label: {
      en: "Investing Balances",
      bn: "বিনিয়োগের ব্যালেন্স",
    },
    placeholder: {
      en: "Enter the investing balances",
      bn: "বিনিয়োগের ব্যালেন্স লিখুন",
    },
  },
  investingType: {
    label: {
      en: "Investing Type",
      bn: "বিনিয়োগের ধরন",
    },
    placeholder: {
      en: "Select the investing type",
      bn: "বিনিয়োগের ধরন নির্বাচন করুন",
    },
  },
  interest: {
    label: {
      en: "Interest",
      bn: "সুদ",
    },
    placeholder: {
      en: "Enter the interest rate",
      bn: "সুদের হার লিখুন",
    },
  },
  note: {
    label: {
      en: "Note",
      bn: "নোট",
    },
    placeholder: {
      en: "Enter any notes",
      bn: "নোট লিখুন",
    },
  },
};
