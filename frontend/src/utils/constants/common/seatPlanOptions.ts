export interface ISeatPlanOptionsProps {
  en: string;
  bn: string;
  key: string;
  value: number;
}
export const seatPlanOptions: ISeatPlanOptionsProps[] = [
  {
    en: "Economy AC 40 (back)",
    bn: "ইকোনমি এসি ৪০ (পিছনে)",
    key: "economy_ac_40_back",
    value: 40,
  },
  { en: "Economy AC 40", bn: "ইকোনমি এসি ৪০", key: "economy_ac_40", value: 40 },
  {
    en: "Economy AC 36 (back)",
    bn: "ইকোনমি এসি ৩৬ (পিছনে)",
    key: "economy_ac_36_back",
    value: 36,
  },
  { en: "Economy AC 36", bn: "ইকোনমি এসি ৩৬", key: "economy_ac_36", value: 36 },
  {
    en: "AC Suite Class 43 (back)",
    bn: "এসি স্যুট ক্লাস ৪৩ (পিছনে)",
    key: "ac_suite_class_43_back",
    value: 43,
  },
  {
    en: "AC Suite Class 43",
    bn: "এসি স্যুট ক্লাস ৪৩",
    key: "ac_suite_class_43",
    value: 43,
  },
  {
    en: "30 AC Sleeper DHK-COX",
    bn: "৩০ এসি স্লিপার ঢাকা-কক্স",
    key: "30_ac_sleeper_dhk_cox",
    value: 30,
  },
  {
    en: "30 AC Sleeper COX-DHK",
    bn: "৩০ এসি স্লিপার কক্স-ঢাকা",
    key: "30_ac_sleeper_cox_dhk",
    value: 30,
  },
];
