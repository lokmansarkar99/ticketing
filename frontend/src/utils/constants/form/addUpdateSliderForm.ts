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
  
  interface IImageUploadFormProps {
    image: ILabelPlaceholder;
  }
  
  export const addUpdateSliderForm: IImageUploadFormProps = {
    image: {
      label: {
        en: "Image (1920 x 500) ✼",
        bn: "ছবি (১৯২০ x ৫০০) ✼",
      },
      placeholder: {
        en: "Upload an image",
        bn: "একটি ছবি আপলোড করুন",
      },
    },
  };
  