export interface IMaritalStatusOptionsProps {
  key: string;
  label: {
    en: string;
    bn: string;
  };
}
export const maritalStatusOptions: IMaritalStatusOptionsProps[] = [
  {
    label: { en: "Married", bn: "বিবাহিত" },
    key: "Married",
  },
  {
    label: {
      en: "Unmarried",
      bn: "অবিবাহিত",
    },
    key: "Unmarried",
  },
];
