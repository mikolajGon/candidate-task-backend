import { GuideLanguage } from '@lib/domain/entity/common/language.enum';
import { GuideStore } from './guide.store';
import { entityDoNotExists, entityExists, EntityInit } from '@lib/domain/utils';
import { GuideContent } from '@lib/domain';
import { v4 } from 'uuid';

export type GuideEntityInit = {
  language: GuideLanguage;
  externalGuideId: string;
  content?: GuideContent;
};

export type GuideEntityConstructor = {
  language: GuideLanguage;
  externalGuideId: string;
  id: string;
  content?: GuideContent;
};

export class Guide {
  public static async init(
    guideEntityInit: GuideEntityInit,
    guideStore: GuideStore,
  ): EntityInit<Guide> {
    const guideConstructor = await guideStore.get(
      guideEntityInit.externalGuideId,
      guideEntityInit.language,
    );

    if (guideConstructor !== null) {
      return entityExists(() => new this(guideConstructor, guideStore));
    }

    return entityDoNotExists(async () => {
      const guide = new this({ ...guideEntityInit, id: v4() }, guideStore);
      await guideStore.save(guide);
      return guide;
    });
  }

  public get externalGuideId(): string {
    return this.guide.externalGuideId;
  }

  public get language(): GuideLanguage {
    return this.guide.language;
  }

  public get id(): string {
    return this.guide.id;
  }

  public get content(): GuideContent | undefined {
    return this.guide.content;
  }

  public get isComplete(): boolean {
    return this.content !== undefined;
  }

  private constructor(
    private readonly guide: GuideEntityConstructor,
    private readonly guideStore: GuideStore,
  ) {}

  public async complete(content: GuideContent) {
    if (this.isComplete) throw new Error('Entity already completed');
    this.guide.content = content;
    await this.guideStore.update(this);
  }
}
