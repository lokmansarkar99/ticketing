import { ILabelPlaceholder } from "./loginForm";

export interface IAddUpdateAccountFromProps {
  bankName: ILabelPlaceholder;
  accountHolderName: ILabelPlaceholder;
  accountName: ILabelPlaceholder;
  accountNumber: ILabelPlaceholder;
  accountType: ILabelPlaceholder;
  openingBalance: ILabelPlaceholder;
}

export const addUpdateAccountForm: IAddUpdateAccountFromProps = {
  bankName: {
    label: {
      en: "Bank Name ✼",
      bn: "ব্যাংকের নাম ✼",
    },
    placeholder: {
      en: "Enter the bank name",
      bn: "ব্যাংকের নাম লিখুন",
    },
  },
  accountHolderName: {
    label: {
      en: "Account Holder Name ✼",
      bn: "অ্যাকাউন্ট হোল্ডারের নাম ✼",
    },
    placeholder: {
      en: "Enter the account holder name",
      bn: "অ্যাকাউন্ট হোল্ডারের নাম লিখুন",
    },
  },
  accountName: {
    label: {
      en: "Account Name ✼",
      bn: "অ্যাকাউন্টের নাম ✼",
    },
    placeholder: {
      en: "Enter the account name",
      bn: "অ্যাকাউন্টের নাম লিখুন",
    },
  },
  accountNumber: {
    label: {
      en: "Account Number ✼",
      bn: "অ্যাকাউন্ট নম্বর ✼",
    },
    placeholder: {
      en: "Enter the account number",
      bn: "অ্যাকাউন্ট নম্বর লিখুন",
    },
  },
  accountType: {
    label: {
      en: "Account Type ✼",
      bn: "অ্যাকাউন্টের ধরন ✼",
    },
    placeholder: {
      en: "Select the account type",
      bn: "অ্যাকাউন্টের ধরন নির্বাচন করুন",
    },
  },
  openingBalance: {
    label: {
      en: "Opening Balance ✼",
      bn: "প্রারম্ভিক ব্যালেন্স ✼",
    },
    placeholder: {
      en: "Enter the opening balance",
      bn: "প্রারম্ভিক ব্যালেন্স লিখুন",
    },
  },
};
