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
  
  interface IDescriptionImageFormProps {
    description: ILabelPlaceholder;
    image: ILabelPlaceholder;
  }
  
  export const addUpdateAboutUsForm: IDescriptionImageFormProps = {
    description: {
      label: {
        en: "Description ✼",
        bn: "বিবরণ ✼",
      },
      placeholder: {
        en: "Enter a description",
        bn: "একটি বিবরণ লিখুন",
      },
    },
    image: {
      label: {
        en: "Image (Optional)",
        bn: "ছবি (ঐচ্ছিক)",
      },
      placeholder: {
        en: "Upload an image",
        bn: "একটি ছবি আপলোড করুন",
      },
    },
  };
  