export interface ILabelPlaceholder {
    label: {
      en: string;
      bn: string;
    };
    placeholder: {
      en: string;
      bn: string;
    };
  }
  
  interface IExtraExpenseFormProps {
    name: ILabelPlaceholder;
    expenseCategoryId: ILabelPlaceholder;
    expenseSubcategoryId: ILabelPlaceholder;
    totalAmount: ILabelPlaceholder;
    date: ILabelPlaceholder;
    file: ILabelPlaceholder;
    note: ILabelPlaceholder;
    paymentAccountId: ILabelPlaceholder;
    paymentAmount: ILabelPlaceholder;
  }
  
  export const extraExpenseForm: IExtraExpenseFormProps = {
    name: {
      label: { en: "Expense Name", bn: "খরচের নাম" },
      placeholder: { en: "Enter expense name", bn: "খরচের নাম লিখুন" },
    },
    expenseCategoryId: {
      label: { en: "Expense Category", bn: "খরচের ক্যাটেগরি" },
      placeholder: { en: "Select expense category", bn: "খরচের ক্যাটেগরি নির্বাচন করুন" },
    },
    expenseSubcategoryId: {
      label: { en: "Expense Subcategory", bn: "খরচের সাবক্যাটেগরি" },
      placeholder: { en: "Select expense subcategory", bn: "খরচের সাবক্যাটেগরি নির্বাচন করুন" },
    },
    totalAmount: {
      label: { en: "Total Amount", bn: "মোট পরিমাণ" },
      placeholder: { en: "Enter total amount", bn: "মোট পরিমাণ লিখুন" },
    },
    date: {
      label: { en: "Date", bn: "তারিখ" },
      placeholder: { en: "Select date", bn: "তারিখ নির্বাচন করুন" },
    },
    file: {
      label: { en: "Attachment (Optional)", bn: "সংযুক্তি (ঐচ্ছিক)" },
      placeholder: { en: "Attach a file if necessary", bn: "প্রয়োজন হলে একটি ফাইল সংযুক্ত করুন" },
    },
    note: {
      label: { en: "Note (Optional)", bn: "নোট (ঐচ্ছিক)" },
      placeholder: { en: "Enter additional details", bn: "অতিরিক্ত বিবরণ লিখুন" },
    },
    paymentAccountId: {
      label: { en: "Payment Account", bn: "পেমেন্ট অ্যাকাউন্ট" },
      placeholder: { en: "Select payment account", bn: "পেমেন্ট অ্যাকাউন্ট নির্বাচন করুন" },
    },
    paymentAmount: {
      label: { en: "Payment Amount", bn: "পেমেন্টের পরিমাণ" },
      placeholder: { en: "Enter payment amount", bn: "পেমেন্টের পরিমাণ লিখুন" },
    },
  };
  