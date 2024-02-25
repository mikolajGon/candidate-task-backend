import { Inject, Injectable } from '@nestjs/common';
import { Guide, NestedStringObject } from '../../entity/guide/guide.entity';
import {
  GuideStore,
  GuideTranslationStoreToken,
} from '../../entity/guide/guide.store';
import { GuideLanguage } from '../../entity/guide/language.enum';
import { Observable } from 'rxjs';
import { ProcessTranslationResults } from './process-translation.results';

@Injectable()
export class GuideTranslationDomainApi {
  constructor(
    @Inject(GuideTranslationStoreToken)
    private readonly guideTranslationStore: GuideStore,
  ) {}

  async processNewTranslation(newTranslation: {
    translateTo: GuideLanguage;
    translateFrom: GuideLanguage;
    guide: NestedStringObject;
  }): Promise<Observable<ProcessTranslationResults>> {
    const guideTranslationInit = await Guide.init(
      {
        language: newTranslation.translateFrom,
        guideContent: newTranslation.guide,
      },
      this.guideTranslationStore,
    );

    const guideTranslation = guideTranslationInit.exists
      ? guideTranslationInit.get()
      : await guideTranslationInit.create();

    const hasTranslation = await guideTranslation.hasTranslationFor(
      newTranslation.translateTo,
    );

    return new Observable((subscriber) => {
      if (!guideTranslationInit.exists) {
        subscriber.next(ProcessTranslationResults.NEW_TRANSLATION_CREATED);
      }

      subscriber.next(
        hasTranslation
          ? ProcessTranslationResults.TRANSLATION_EXISTS
          : ProcessTranslationResults.TRANSLATION_DO_NOT_EXISTS,
      );
      subscriber.complete();
    });
  }
}
