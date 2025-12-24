import { ILabelPlaceholder } from "./loginForm";

interface addUpdateExpenseFormProps {
  coachConfigId: ILabelPlaceholder;
  supervisorId: ILabelPlaceholder;
  expenseCategoryId: ILabelPlaceholder;
  routeDirection: ILabelPlaceholder;
  amount: ILabelPlaceholder;
  date: ILabelPlaceholder;
}

export const addUpdateExpenseForm: addUpdateExpenseFormProps = {
  coachConfigId: {
    label: { en: "Coach Config ID", bn: "কোচ কনফিগারেশন আইডি" },
    placeholder: {
      en: "Enter coach config ID",
      bn: "কোচ কনফিগারেশন আইডি লিখুন",
    },
  },
  supervisorId: {
    label: { en: "Supervisor ID", bn: "সুপারভাইজার আইডি" },
    placeholder: { en: "Enter supervisor ID", bn: "সুপারভাইজার আইডি লিখুন" },
  },
  expenseCategoryId: {
    label: { en: "Expense Category ID", bn: "ব্যয় বিভাগ আইডি" },
    placeholder: {
      en: "Enter expense category ID",
      bn: "ব্যয় বিভাগ আইডি লিখুন",
    },
  },
  routeDirection: {
    label: { en: "Route Direction", bn: "রুট দিক" },
    placeholder: { en: "Select route direction", bn: "রুট দিক নির্বাচন করুন" },
  },
  amount: {
    label: { en: "Amount", bn: "পরিমাণ" },
    placeholder: { en: "Enter amount", bn: "পরিমাণ লিখুন" },
  },
  date: {
    label: { en: "Date", bn: "তারিখ" },
    placeholder: { en: "Select date", bn: "তারিখ নির্বাচন করুন" },
  },
};
