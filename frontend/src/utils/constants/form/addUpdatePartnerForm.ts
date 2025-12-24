import { ILabelPlaceholder } from "./loginForm";

interface IAddUpdatePartnerFormProps {
  name: ILabelPlaceholder;
  email: ILabelPlaceholder;
  phone: ILabelPlaceholder;
  address: ILabelPlaceholder;
  city: ILabelPlaceholder;
  postalCode: ILabelPlaceholder;
  country: ILabelPlaceholder;
}

export const addUpdatePartnerForm: IAddUpdatePartnerFormProps = {
  name: {
    label: {
      en: "Partner's Name ✼",
      bn: "অংশীদারের নাম ✼",
    },
    placeholder: {
      en: "Enter the partner name",
      bn: "অংশীদারের নাম লিখুন",
    },
  },
  email: {
    label: {
      en: "Partner's Email",
      bn: "অংশীদারের ইমেইল",
    },
    placeholder: {
      en: "Enter the partner email",
      bn: "অংশীদারের ইমেইল লিখুন",
    },
  },
  phone: {
    label: {
      en: "Partner's Phone ✼",
      bn: "অংশীদারের ফোন ✼",
    },
    placeholder: {
      en: "Enter the partner number",
      bn: "অংশীদারের ফোন লিখুন",
    },
  },
  address: {
    label: {
      en: "Partner's Address",
      bn: "অংশীদারের ঠিকানা",
    },
    placeholder: {
      en: "Enter the address",
      bn: "অংশীদারের ঠিকানা লিখুন",
    },
  },
  city: {
    label: {
      en: "Partner's City",
      bn: "অংশীদারের শহর",
    },
    placeholder: {
      en: "Enter the partner city",
      bn: "অংশীদারের শহর লিখুন",
    },
  },
  postalCode: {
    label: {
      en: "Postal Code",
      bn: "পোস্টাল কোড",
    },
    placeholder: {
      en: "Enter the postal code",
      bn: "পোস্টাল কোড লিখুন",
    },
  },
  country: {
    label: {
      en: "Country Name",
      bn: "দেশের নাম",
    },
    placeholder: {
      en: "Enter the country name",
      bn: "দেশের নাম লিখুন",
    },
  },
};
