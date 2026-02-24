export const i18n = {
  defaultLocale: "en",
  locales: ["sv", "en"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
