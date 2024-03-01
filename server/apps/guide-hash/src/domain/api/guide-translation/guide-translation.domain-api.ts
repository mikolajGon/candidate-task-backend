import { Inject, Injectable, Logger } from '@nestjs/common';
import { Guide } from '../../entity/guide/guide.entity';
import {
  GuideStore,
  GuideTranslationStoreToken,
} from '../../entity/guide/guide.store';
import { GuideLanguage } from '@lib/domain/entity/common/language.enum';
import { Observable } from 'rxjs';
import { GuideContent, ObservableAsyncResult, result } from '@lib/domain';
import { ProcessTranslationResults } from './process-translation.results';

@Injectable()
export class GuideTranslationDomainApi {
  private readonly logger = new Logger(GuideTranslationDomainApi.name);
  constructor(
    @Inject(GuideTranslationStoreToken)
    private readonly guideTranslationStore: GuideStore,
  ) {}

  async processRequestForNewTranslation(newTranslation: {
    translateTo: GuideLanguage;
    translateFrom: GuideLanguage;
    guide: GuideContent;
  }): ObservableAsyncResult<ProcessTranslationResults, Guide> {
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
            ProcessTranslationResults.NEW_TRANSLATION_CREATED,
            guideTranslation,
          ),
        );
      }

      subscriber.next(
        hasTranslation
          ? result(
              ProcessTranslationResults.TRANSLATION_EXISTS,
              guideTranslation,
            )
          : result(
              ProcessTranslationResults.TRANSLATION_DO_NOT_EXISTS,
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
    guideContent: GuideContent;
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
      this.logger.log('Guide already exists');
      return;
    }

    await guideInit.create();
  }
}
