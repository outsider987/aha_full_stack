export const locales = {
  en: 'En',
  tc: 'Cn'
} as const;

export type LocaleKeys = keyof typeof locales;
export type Locales = (typeof locales)[LocaleKeys];

export const getLocaleKey = (locale: string): Locales => {
  return locales[locale] || locales['tc'];
};

export const getLocale = (locale: LocaleKeys): LocaleKeys => {
  return locales[locale] ? locale : 'tc';
};

export const localesForMoment = {
  en: 'en-US',
  tc: 'zh-HK'
} as const;
export type LocaleForMomentKeys = keyof typeof localesForMoment;
export type LocaleForMoments = (typeof localesForMoment)[LocaleForMomentKeys];
export const getLocaleForMoment = (
  locale: string = global.locale
): LocaleForMoments => {
  return localesForMoment[locale] || localesForMoment['tc'];
};
