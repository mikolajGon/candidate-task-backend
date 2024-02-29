import { GuideLanguage } from '@lib/domain';

export const TranslateFacadeToken = 'TranslateFacadeToken' as const;

export interface TranslateFacade {
  translate: (translation: {
    languageFrom: GuideLanguage;
    languageTo: GuideLanguage;
    text: string;
  }) => Promise<string>;
}
