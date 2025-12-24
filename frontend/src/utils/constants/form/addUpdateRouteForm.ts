import { ILabelPlaceholder } from "./loginForm";

interface ISegmentLabelPlaceholder {
  type: ILabelPlaceholder;
  fromStationId: ILabelPlaceholder;
  toStationId: ILabelPlaceholder;
  e_class_amount: ILabelPlaceholder;
  b_class_amount: ILabelPlaceholder;
  s_class_amount: ILabelPlaceholder;
  sleeper_class_amount: ILabelPlaceholder;
}

interface IAddUpdateRouteFormProps {
  routeType: ILabelPlaceholder;
  routeDirection: ILabelPlaceholder;
  kilo: ILabelPlaceholder;
  isPassengerInfoRequired: ILabelPlaceholder;
  via: ILabelPlaceholder;
  from: ILabelPlaceholder;
  middle: ILabelPlaceholder;
  to: ILabelPlaceholder;
  routeName: ILabelPlaceholder;
  viaStations: ILabelPlaceholder;
  segments: ISegmentLabelPlaceholder;
}

export const addUpdateRouteForm: IAddUpdateRouteFormProps = {
  routeType: {
    label: {
      en: "Route Type ",
      bn: "রুট টাইপ",
    },
    placeholder: {
      en: "Select route type",
      bn: "রুট টাইপ নির্বাচন করুন",
    },
  },
  routeDirection: {
    label: {
      en: "Route Direction",
      bn: "রুট দিক",
    },
    placeholder: {
      en: "Select route direction",
      bn: "রুট দিক নির্বাচন করুন",
    },
  },
  kilo: {
    label: {
      en: "Distance (Kilo)",
      bn: "দূরত্ব (কিমি)",
    },
    placeholder: {
      en: "Enter distance in kilo",
      bn: "কিমিতে দূরত্ব লিখুন",
    },
  },
  isPassengerInfoRequired: {
    label: {
      en: "Passenger Information Permission",
      bn: "যাত্রী তথ্যের অনুমতি",
    },
    placeholder: {
      en: "Select passenger information permission",
      bn: "যাত্রী তথ্যের অনুমতি নির্বাচন করুন",
    },
  },
  via: {
    label: {
      en: "Via",
      bn: "মাধ্যমে",
    },
    placeholder: {
      en: "Enter via",
      bn: "মাধ্যমে লিখুন",
    },
  },
  from: {
    label: {
      en: "Starting Station ✼",
      bn: "শুরু স্টেশন ✼",
    },
    placeholder: {
      en: "Select starting station",
      bn: "শুরু স্টেশন নির্বাচন করুন",
    },
  },
  middle: {
    label: {
      en: "Middle Station ",
      bn: "মধ্যবর্তী স্টেশন ",
    },
    placeholder: {
      en: "Select middle station",
      bn: "মধ্যবর্তী স্টেশন নির্বাচন করুন",
    },
  },
  to: {
    label: {
      en: "Destination Station ✼",
      bn: "গন্তব্য স্টেশন ✼",
    },
    placeholder: {
      en: "Select destination station",
      bn: "গন্তব্য স্টেশন নির্বাচন করুন",
    },
  },
  routeName: {
    label: {
      en: "Route Name (readonly) ✼",
      bn: "রুট নাম লিখুন ✼",
    },
    placeholder: {
      en: "Starting ➜ ending station ",
      bn: "শুরু ➜ শেষ স্টেশন",
    },
  },
  viaStations: {
    label: {
      en: "Via Stations ✼",
      bn: "মাধ্যমে স্টেশন ✼",
    },
    placeholder: {
      en: "Select via stations",
      bn: "মাধ্যমে স্টেশন নির্বাচন করুন",
    },
  },
  segments: {
   
    type: {
      label: {
        en: "Segment Type ✼",
        bn: "সেগমেন্ট টাইপ ✼",
      },
      placeholder: {
        en: "Select segment type",
        bn: "সেগমেন্ট টাইপ নির্বাচন করুন",
      },
    },
    fromStationId: {
      label: {
        en: "From Station ✼",
        bn: "শুরু স্টেশন ✼",
      },
      placeholder: {
        en: "Enter from station",
        bn: "শুরু স্টেশন লিখুন",
      },
    },
    toStationId: {
      label: {
        en: "To Station ✼",
        bn: "শেষ স্টেশন ✼",
      },
      placeholder: {
        en: "Enter to station ",
        bn: "শেষ স্টেশন লিখুন",
      },
    },
    e_class_amount: {
      label: {
        en: "E-Class Amount ✼",
        bn: "ই-ক্লাস পরিমাণ ✼",
      },
      placeholder: {
        en: "Enter E-Class fare",
        bn: "ই-ক্লাস ভাড়া লিখুন",
      },
    },
    b_class_amount: {
      label: {
        en: "B-Class Amount ✼",
        bn: "বি-ক্লাস পরিমাণ ✼",
      },
      placeholder: {
        en: "Enter B-Class fare",
        bn: "বি-ক্লাস ভাড়া লিখুন",
      },
    },
    s_class_amount: {
      label: {
        en: "S-Class Amount ✼",
        bn: "এস-ক্লাস পরিমাণ ✼",
      },
      placeholder: {
        en: "Enter S-Class fare",
        bn: "এস-ক্লাস ভাড়া লিখুন",
      },
    },
    sleeper_class_amount: {
      label: {
        en: "Sleeper-Class Amount ✼",
        bn: "স্লিপার-ক্লাস পরিমাণ ✼",
      },
      placeholder: {
        en: "Enter Sleeper-Class fare",
        bn: "স্লিপার-ক্লাস ভাড়া লিখুন",
      },
    },
  },
};
