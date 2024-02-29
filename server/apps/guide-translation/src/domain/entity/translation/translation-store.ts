import { Translation, TranslationConstructor } from './translation.entity';
import { TranslationStatus } from './translation-status.enum';
import { GuideLanguage } from '@lib/domain';

export const TranslationStoreToken = 'TranslationStoreToken' as const;
export interface TranslationStore {
  getByGuideIdAndLanguage(
    guideId: string,
    language: GuideLanguage,
  ): Promise<TranslationConstructor | null>;
  create(guide: Translation): Promise<void>;
  getPending(): Promise<TranslationConstructor | null>;
  changeStatus(id: string, status: TranslationStatus): Promise<void>;
  saveCompleted(guide: Translation): Promise<void>;
}
