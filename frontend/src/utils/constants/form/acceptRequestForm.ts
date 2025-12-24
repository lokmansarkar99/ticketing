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

interface ICancelRequestFormProps {
  cancelNote: ILabelPlaceholder;
  refundPercentage: ILabelPlaceholder;
  refundType: ILabelPlaceholder;
}

export const acceptRequestForm: ICancelRequestFormProps = {
  cancelNote: {
    label: {
      en: "Cancel Note",
      bn: "বাতিল নোট",
    },
    placeholder: {
      en: "Enter the reason for cancellation",
      bn: "বাতিলের কারণ লিখুন",
    },
  },
  refundPercentage: {
    label: {
      en: "Refund Amount",
      bn: "রিফান্ডের পরিমান",
    },
    placeholder: {
      en: "Enter refund amount",
      bn: "রিফান্ড পরিমান লিখুন",
    },
  },
  refundType: {
    label: {
      en: "Refund Type ✼",
      bn: "রিফান্ডের ধরন ✼",
    },
    placeholder: {
      en: "Select refund type",
      bn: "রিফান্ডের ধরন নির্বাচন করুন",
    },
  },
};
