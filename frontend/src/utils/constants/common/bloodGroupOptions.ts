export interface IBloodGroupsProps {
  key: string;
  label: {
    en: string;
    bn: string;
  };
}

export const bloodGroupOptions: IBloodGroupsProps[] = [
  {
    key: "a+",
    label: {
      en: "A positive",
      bn: "এ পজিটিভ",
    },
  },
  {
    key: "a-",
    label: {
      en: "A negative",
      bn: "এ নেগেটিভ",
    },
  },
  {
    key: "b+",
    label: {
      en: "B positive",
      bn: "বি পজিটিভ",
    },
  },
  {
    key: "b-",
    label: {
      en: "B negative",
      bn: "বি নেগেটিভ",
    },
  },
  {
    key: "ab+",
    label: {
      en: "AB positive",
      bn: "এবি পজিটিভ",
    },
  },
  {
    key: "ab-",
    label: {
      en: "AB negative",
      bn: "এবি নেগেটিভ",
    },
  },
  {
    key: "o+",
    label: {
      en: "O positive",
      bn: "ও পজিটিভ",
    },
  },
  {
    key: "o-",
    label: {
      en: "O negative",
      bn: "ও নেগেটিভ",
    },
  },
];
