export interface IGenderOptionsProps {
  key: string;
  label: {
    en: string;
    bn: string;
  };
}
export const genderOptions: IGenderOptionsProps[] = [
  {
    label: { en: "Male", bn: "পুরুষ" },
    key: "Male",
  },
  {
    label: {
      en: "Female",
      bn: "মহিলা",
    },
    key: "Female",
  },
  {
    label: {
      en: "Others",
      bn: "অন্যান্য",
    },
    key: "Others",
  },
];
