import type { Language } from './translations';

const LOCALE_MAP: Record<Language, string> = {
  en: 'en-US',
  tr: 'tr-TR',
};

/** Formats a date per the active language via Intl.DateTimeFormat (no hardcoded locale). */
export function formatDate(language: Language, value: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(LOCALE_MAP[language], options).format(new Date(value));
}
