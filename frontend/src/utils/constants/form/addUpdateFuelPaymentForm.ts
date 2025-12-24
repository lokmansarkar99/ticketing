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

interface IFuelPaymentFormProps {
  registrationNo: ILabelPlaceholder;
  fuelCompanyId: ILabelPlaceholder;
  amount: ILabelPlaceholder;
  payments: {
    accountId: ILabelPlaceholder;
    paymentAmount: ILabelPlaceholder;
  };
}

export const fuelPaymentForm: IFuelPaymentFormProps = {
  registrationNo: {
    label: { en: "Registration Number", bn: "রেজিস্ট্রেশন নম্বর" },
    placeholder: {
      en: "Enter registration number",
      bn: "রেজিস্ট্রেশন নম্বর লিখুন",
    },
  },
  fuelCompanyId: {
    label: { en: "Fuel Company ID", bn: "জ্বালানি কোম্পানি আইডি" },
    placeholder: {
      en: "Enter fuel company ID",
      bn: "জ্বালানি কোম্পানি আইডি লিখুন",
    },
  },
  amount: {
    label: { en: "Amount", bn: "পরিমাণ" },
    placeholder: { en: "Enter amount", bn: "পরিমাণ লিখুন" },
  },
  payments: {
    accountId: {
      label: { en: "Payment Account ID", bn: "পেমেন্ট অ্যাকাউন্ট আইডি" },
      placeholder: {
        en: "Enter payment account ID",
        bn: "পেমেন্ট অ্যাকাউন্ট আইডি লিখুন",
      },
    },
    paymentAmount: {
      label: { en: "Payment Amount", bn: "পেমেন্টের পরিমাণ" },
      placeholder: { en: "Enter payment amount", bn: "পেমেন্টের পরিমাণ লিখুন" },
    },
  },
};
