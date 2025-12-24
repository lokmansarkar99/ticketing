export interface IPhotoCropAspectRatioProps {
  title: {
    en: string;
    bn: string;
  };
  key: {
    en: string;
    bn: string;
  };
  ratio: number;
}

export const photoCropAspectRatio: IPhotoCropAspectRatioProps[] = [
  {
    title: {
      en: "Square",
      bn: "বর্গাকার",
    },
    key: {
      en: "1:1",
      bn: "১ঃ১",
    },
    ratio: 1 / 1,
  },
  {
    title: {
      en: "Standard",
      bn: "স্ট্যান্ডার্ড",
    },
    key: {
      en: "4:3",
      bn: "৪ঃ৩",
    },
    ratio: 4 / 3,
  },
  {
    title: {
      en: "Classic 35mm",
      bn: "ক্লাসিক ৩৫মিমি",
    },
    key: {
      en: "3:2",
      bn: "৩ঃ২",
    },
    ratio: 3 / 2,
  },
  {
    title: {
      en: "Widescreen",
      bn: "ওয়াইডস্ক্রিন",
    },
    key: {
      en: "16:9",
      bn: "১৬ঃ৯",
    },
    ratio: 16 / 9,
  },
  {
    title: {
      en: "Medium format",
      bn: "মিডিয়াম ফরম্যাট",
    },
    key: {
      en: "5:4",
      bn: "৫ঃ৪",
    },
    ratio: 5 / 4,
  },
  {
    title: {
      en: "Photograph print",
      bn: "ফটোগ্রাফ প্রিন্ট",
    },
    key: {
      en: "7:5",
      bn: "৭ঃ৫",
    },
    ratio: 7 / 5,
  },
  {
    title: {
      en: "Common in computer displays",
      bn: "কম্পিউটার ডিসপ্লেতে সাধারণ",
    },
    key: {
      en: "8:5",
      bn: "৮ঃ৫",
    },
    ratio: 8 / 5,
  },
  {
    title: {
      en: "8x10 (Common print size)",
      bn: "৮x১০ (সাধারণ প্রিন্ট সাইজ)",
    },
    key: {
      en: "4:5",
      bn: "৪ঃ৫",
    },
    ratio: 4 / 5,
  },
  {
    title: {
      en: "6x8 (Common print size)",
      bn: "৬x৮ (সাধারণ প্রিন্ট সাইজ)",
    },
    key: {
      en: "3:4",
      bn: "৩ঃ৪",
    },
    ratio: 3 / 4,
  },
  {
    title: {
      en: "4x6 (Common print size)",
      bn: "৪x৬ (সাধারণ প্রিন্ট সাইজ)",
    },
    key: {
      en: "2:3",
      bn: "২ঃ৩",
    },
    ratio: 2 / 3,
  }
];
