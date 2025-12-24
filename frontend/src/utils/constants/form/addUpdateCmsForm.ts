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

interface ICMSFormProps {
  companyName: ILabelPlaceholder;
  companyNameBangla: ILabelPlaceholder;
  address: ILabelPlaceholder;
  addressBangla: ILabelPlaceholder;
  city: ILabelPlaceholder;
  cityBangla: ILabelPlaceholder;
  postalCode: ILabelPlaceholder;
  supportNumber1: ILabelPlaceholder;
  supportNumber2: ILabelPlaceholder;
  facebook: ILabelPlaceholder;
  instagram: ILabelPlaceholder;
  youtube: ILabelPlaceholder;
  twitter: ILabelPlaceholder;
  linkedin: ILabelPlaceholder;
  email: ILabelPlaceholder;
  googleMap: ILabelPlaceholder;
  aboutUsContent: ILabelPlaceholder;
}

export const cmsForm: ICMSFormProps = {
  companyName: {
    label: { en: "Company Name", bn: "কোম্পানির নাম" },
    placeholder: { en: "Enter company name", bn: "কোম্পানির নাম লিখুন" },
  },
  companyNameBangla: {
    label: { en: "Company Name (Bangla)", bn: "কোম্পানির নাম (বাংলা)" },
    placeholder: { en: "Enter company name in Bangla", bn: "কোম্পানির নাম বাংলায় লিখুন" },
  },
  
  address: {
    label: { en: "Address", bn: "ঠিকানা" },
    placeholder: { en: "Enter address", bn: "ঠিকানা লিখুন" },
  },
  addressBangla: {
    label: { en: "Address (Bangla)", bn: "ঠিকানা (বাংলা)" },
    placeholder: { en: "Enter address in Bangla", bn: "ঠিকানা বাংলায় লিখুন" },
  },
  city: {
    label: { en: "City", bn: "শহর" },
    placeholder: { en: "Enter city", bn: "শহর লিখুন" },
  },
  cityBangla: {
    label: { en: "City (Bangla)", bn: "শহর (বাংলা)" },
    placeholder: { en: "Enter city in Bangla", bn: "শহর বাংলায় লিখুন" },
  },
  postalCode: {
    label: { en: "Postal Code", bn: "পোস্টাল কোড" },
    placeholder: { en: "Enter postal code", bn: "পোস্টাল কোড লিখুন" },
  },
  supportNumber1: {
    label: { en: "Support Number 1", bn: "সাপোর্ট নম্বর ১" },
    placeholder: { en: "Enter first support number", bn: "প্রথম সাপোর্ট নম্বর লিখুন" },
  },
  supportNumber2: {
    label: { en: "Support Number 2", bn: "সাপোর্ট নম্বর ২" },
    placeholder: { en: "Enter second support number", bn: "দ্বিতীয় সাপোর্ট নম্বর লিখুন" },
  },
  email: {
    label: { en: "Email", bn: "ইমেইল" },
    placeholder: { en: "Enter email address", bn: "ইমেইল ঠিকানা লিখুন" },
  },
  facebook: {
    label: { en: "Facebook", bn: "ফেসবুক" },
    placeholder: { en: "Enter Facebook URL", bn: "ফেসবুক ইউআরএল লিখুন" },
  },
  youtube: {
    label: { en: "Youtube", bn: "ইউটিউব" },
    placeholder: { en: "Enter Youtube URL", bn: "ইউটিউব ইউআরএল লিখুন" },
  },
  instagram: {
    label: { en: "Instagram", bn: "ইনস্টাগ্রাম" },
    placeholder: { en: "Enter Instagram URL", bn: "ইনস্টাগ্রাম ইউআরএল লিখুন" },
  },
  twitter: {
    label: { en: "Twitter", bn: "টুইটার" },
    placeholder: { en: "Enter Twitter URL", bn: "টুইটার ইউআরএল লিখুন" },
  },
  linkedin: {
    label: { en: "LinkedIn", bn: "লিঙ্কডইন" },
    placeholder: { en: "Enter LinkedIn URL", bn: "লিঙ্কডইন ইউআরএল লিখুন" },
  },
  googleMap: {
    label: { en: "Google Map", bn: "লিঙ্কডইন" },
    placeholder: { en: "Enter Google Map", bn: "লিঙ্কডইন ইউআরএল লিখুন" },
  },
  aboutUsContent: {
    label: { en: "About Us Content", bn: "লিঙ্কডইন" },
    placeholder: { en: "Enter content", bn: "লিঙ্কডইন ইউআরএল লিখুন" },
  },
};
