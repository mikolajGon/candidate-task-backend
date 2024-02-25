import { GuideLanguage } from './language.enum';
import { GuideStore } from './guide.store';
import { createHash } from 'crypto';
import { uuid } from 'uuidv4';

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
  ): Promise<
    | { exists: true; get: () => Guide }
    | { exists: false; create: () => Promise<Guide> }
  > {
    const hash = this.calculateHash(guide.guideContent);
    const id = await guideStore.getId(hash, guide.language);

    if (id === null) {
      return {
        exists: false,
        create: async () => {
          const newGuideTranslation = new this(
            { id: uuid(), hash, language: guide.language },
            guideStore,
          );
          await guideStore.create(newGuideTranslation);
          return newGuideTranslation;
        },
      };
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
