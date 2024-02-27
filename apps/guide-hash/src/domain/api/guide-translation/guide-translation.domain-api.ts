import { Inject, Injectable } from '@nestjs/common';
import { Guide, NestedStringObject } from '../../entity/guide/guide.entity';
import {
  GuideStore,
  GuideTranslationStoreToken,
} from '../../entity/guide/guide.store';
import { GuideLanguage } from '@lib/domain/entity/common/language.enum';
import { Observable } from 'rxjs';
import { ProcessRequestForNewTranslationResult } from './process-request-for-new-translation.result';
import { ObservableAsyncResult, result } from '@lib/domain';

@Injectable()
export class GuideTranslationDomainApi {
  constructor(
    @Inject(GuideTranslationStoreToken)
    private readonly guideTranslationStore: GuideStore,
  ) {}

  async processRequestForNewTranslation(newTranslation: {
    translateTo: GuideLanguage;
    translateFrom: GuideLanguage;
    guide: NestedStringObject;
  }): ObservableAsyncResult<ProcessRequestForNewTranslationResult, Guide> {
    const guideInit = await Guide.init(
      {
        language: newTranslation.translateFrom,
        guideContent: newTranslation.guide,
      },
      this.guideTranslationStore,
    );

    const guideTranslation = guideInit.exists
      ? guideInit.get()
      : await guideInit.create();

    const hasTranslation = await guideTranslation.hasTranslationFor(
      newTranslation.translateTo,
    );

    return new Observable((subscriber) => {
      if (!guideInit.exists) {
        subscriber.next(
          result(
            ProcessRequestForNewTranslationResult.NEW_TRANSLATION_CREATED,
            guideTranslation,
          ),
        );
      }

      subscriber.next(
        hasTranslation
          ? result(
              ProcessRequestForNewTranslationResult.TRANSLATION_EXISTS,
              guideTranslation,
            )
          : result(
              ProcessRequestForNewTranslationResult.TRANSLATION_DO_NOT_EXISTS,
              guideTranslation,
            ),
      );
      subscriber.complete();
    });
  }

  async processNewTranslation({
    guideContent,
    language,
    id,
  }: {
    guideContent: NestedStringObject;
    language: GuideLanguage;
    id: string;
  }) {
    const guideInit = await Guide.init(
      {
        language,
        guideContent,
        id,
      },
      this.guideTranslationStore,
    );

    if (guideInit.exists) {
      console.info('Guide already exists');
      return;
    }

    await guideInit.create();
  }
}
