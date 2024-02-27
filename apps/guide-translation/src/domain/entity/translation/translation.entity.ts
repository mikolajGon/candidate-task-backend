import { TranslationStore } from './translation-store';
import { v4 as uuid } from 'uuid';
import { GuideLanguage } from '@lib/domain';
import { TranslationStatus } from './translation-status.enum';
import { GuideContent } from './guide-content';
import { entityDoNotExists, entityExists, EntityInit } from '@lib/domain/utils';

export type TranslationEntityInit = {
  languageFrom: GuideLanguage;
  languageTo: GuideLanguage;
  guideContent: GuideContent;
  guideId: string;
};

export type TranslationConstructor = TranslationEntityInit & {
  status: TranslationStatus;
  id: string;
  translatedGuideContent?: GuideContent;
};

export class Translation {
  public static async init(
    translationEntityInit: TranslationEntityInit,
    translationStore: TranslationStore,
  ): EntityInit<Translation> {
    const translation = await translationStore.getByGuideIdAndLanguage(
      translationEntityInit.guideId,
      translationEntityInit.languageTo,
    );

    if (translation == null) {
      return entityDoNotExists(async () => {
        const translationEntity = new this(
          {
            ...translationEntityInit,
            id: uuid(),
            status: 'PENDING',
          },
          translationStore,
        );

        await translationStore.create(translationEntity);

        return translationEntity;
      });
    }

    return entityExists(() => new this(translation, translationStore));
  }

  public static async processPendingTranslation(
    processPendingTranslation: (
      pendingTranslation: Translation,
    ) => Promise<GuideContent>,
    translationStore: TranslationStore,
  ) {
    const pendingTranslation = await this.getPending(translationStore);
    if (pendingTranslation === null) return null;

    try {
      await translationStore.changeStatus(pendingTranslation.id, 'IN_PROGRESS');

      const translatedContent =
        await processPendingTranslation(pendingTranslation);

      return pendingTranslation.complete(translatedContent);
    } catch (e) {
      await translationStore.changeStatus(pendingTranslation.id, 'PENDING');
      throw e;
    }
  }

  private static async getPending(translationStore: TranslationStore) {
    const pendingTranslation = await translationStore.getPending();
    return pendingTranslation === null
      ? null
      : new this(pendingTranslation, translationStore);
  }

  public get status(): TranslationStatus {
    return this.translation.status;
  }

  public get id(): string {
    return this.translation.id;
  }

  get languageFrom(): GuideLanguage {
    return this.translation.languageFrom;
  }

  get languageTo(): GuideLanguage {
    return this.translation.languageTo;
  }

  get guideContent(): GuideContent {
    return this.translation.guideContent;
  }

  get guideId(): string {
    return this.translation.guideId;
  }

  get translatedGuideContent(): GuideContent | undefined {
    return this.translation.translatedGuideContent;
  }

  private constructor(
    private readonly translation: TranslationConstructor,
    private readonly translationStore: TranslationStore,
  ) {}

  public async complete(translatedContent: GuideContent): Promise<Translation> {
    this.translation.translatedGuideContent = translatedContent;
    this.translation.status = 'DONE';
    await this.translationStore.saveCompleted(this);

    return this;
  }
}
