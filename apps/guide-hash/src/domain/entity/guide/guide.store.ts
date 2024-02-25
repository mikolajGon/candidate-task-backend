import { Guide } from './guide.entity';
import { GuideLanguage } from './language.enum';

export const GuideTranslationStoreToken = 'GuideTranslationStorePort' as const;
export interface GuideStore {
  create(guide: Guide): Promise<void>;
  getId(hash: string, language: GuideLanguage): Promise<string | null>;
  translationExists(guideId: string, language: GuideLanguage): Promise<boolean>;
}
