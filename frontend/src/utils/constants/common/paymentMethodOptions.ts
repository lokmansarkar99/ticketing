export interface IPaymentMethodOptions {
  en: string;
  bn: string;
  key: string;
}
export interface ICounterPaymentMethodOptions {
  en: string;
  bn: string;
  key: string;
}
export const paymentMethodOptions: IPaymentMethodOptions[] = [
  { key: "credit_card", en: "Credit Card", bn: "ক্রেডিট কার্ড" },
  { key: "debit_card", en: "Debit Card", bn: "ডেবিট কার্ড" },
  { key: "paypal", en: "PayPal", bn: "পেপাল" },
  { key: "bank_transfer", en: "Bank Transfer", bn: "ব্যাংক ট্রান্সফার" },
  { key: "mobile_payment", en: "Mobile Payment", bn: "মোবাইল পেমেন্ট" },
  { key: "google_pay", en: "Google Pay", bn: "গুগল পে" },
  { key: "apple_pay", en: "Apple Pay", bn: "অ্যাপল পে" },
  { key: "bkash", en: "bKash", bn: "বিকাশ" },
  { key: "nagad", en: "Nagad", bn: "নগদ" },
  { key: "rocket", en: "Rocket", bn: "রকেট" },
  { key: "stripe", en: "Stripe", bn: "স্ট্রাইপ" },
  { key: "cash", en: "Cash", bn: "নগদ" },
];
export const counterPaymentMethodOptions: ICounterPaymentMethodOptions[] = [
  { key: "cash", en: "Cash", bn: "নগদ" },
];
