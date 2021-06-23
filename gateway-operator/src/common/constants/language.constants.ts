export type LanguageCode = 'en' | 'ru' | 'ar';

export const LanguagesMap: { [key in LanguageCode]: number } = {
    en: 1,
    ru: 2,
    ar: 3,
};

export const LanguageRecord: Record<number, LanguageCode> = {};
for (const [key, value] of Object.entries(LanguagesMap)) LanguageRecord[value] = key as LanguageCode;

export const LanguageCodeArray = Object.keys(LanguagesMap) as LanguageCode[];
