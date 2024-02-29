import { Guide, GuideEntityConstructor } from './guide.entity';
import { GuideLanguage } from '@lib/domain';

export const GUIDE_STORY_TOKEN = 'GuideTranslationStorePort' as const;
export interface GuideStore {
  get(
    externalGuideId: string,
    language: GuideLanguage,
  ): Promise<GuideEntityConstructor | null>;
  save(guide: Guide): Promise<void>;
  update(guide: Guide): Promise<void>;
}
