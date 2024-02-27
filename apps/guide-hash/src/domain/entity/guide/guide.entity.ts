import { GuideLanguage } from '@lib/domain/entity/common/language.enum';
import { GuideStore } from './guide.store';
import { createHash } from 'crypto';
import { v4 } from 'uuid';
import { EntityInit } from '@lib/domain/utils';

// @ts-expect-error because we need generic record of infinite depth.
export type NestedStringObject = Record<
  string,
  | string
  | number
  | NestedStringObject
  | (string | number | NestedStringObject)[]
>;

export type GuideEntityInit = {
  language: GuideLanguage;
  guideContent: NestedStringObject;
  id?: string;
};

type GuideTranslationConstructor = {
  language: GuideLanguage;
  hash: string;
  id: string;
};

export class Guide {
  public static async init(
    guide: GuideEntityInit,
    guideStore: GuideStore,
  ): EntityInit<Guide> {
    const hash = this.calculateHash(guide.guideContent);
    const id = await guideStore.getId(hash, guide.language);

    if (guide.id !== undefined) {
      const idExists = await guideStore.idExists(guide.id);
      if (!idExists) throw new Error('given id do not exists');
    }

    if (id === null) {
      return {
        exists: false,
        create: async () => {
          const newGuideTranslation = new this(
            { id: guide.id ?? v4(), hash, language: guide.language },
            guideStore,
          );
          await guideStore.create(newGuideTranslation);
          return newGuideTranslation;
        },
      };
    }

    if (guide.id !== undefined) {
      if (id !== guide.id) throw new Error('This Guide already has id');
    }

    return {
      exists: true,
      get: () => new this({ id, hash, language: guide.language }, guideStore),
    };
  }

  private static calculateHash(guide: string): string {
    return createHash('sha1').update(JSON.stringify(guide)).digest('hex');
  }

  public get id(): string {
    return this.guideTranslation.id;
  }

  public get language(): GuideLanguage {
    return this.guideTranslation.language;
  }

  public get hash(): string {
    return this.guideTranslation.hash;
  }

  public async hasTranslationFor(language: GuideLanguage): Promise<boolean> {
    return await this.guideTranslationStore.translationExists(
      this.id,
      language,
    );
  }

  private constructor(
    private readonly guideTranslation: GuideTranslationConstructor,
    private readonly guideTranslationStore: GuideStore,
  ) {}
}
