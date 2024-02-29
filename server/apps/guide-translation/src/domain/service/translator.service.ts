import { Inject, Injectable } from '@nestjs/common';
import { Translation } from '../entity/translation/translation.entity';
import {
  TranslationStore,
  TranslationStoreToken,
} from '../entity/translation/translation-store';
import { GuideLanguage } from '@lib/domain';
import { Interval } from '@nestjs/schedule';
import { TranslateFacade, TranslateFacadeToken } from './port/translate.facade';
import {
  TranslateNotificator,
  TranslateNotificatorToken,
} from './port/translate.notificator';

@Injectable()
export class TranslatorService {
  private isTranslating: boolean = false;

  constructor(
    @Inject(TranslationStoreToken)
    private readonly translationStore: TranslationStore,
    @Inject(TranslateFacadeToken)
    private readonly translateFacade: TranslateFacade,
    @Inject(TranslateNotificatorToken)
    private readonly translateNotificator: TranslateNotificator,
  ) {}

  @Interval(10000)
  public scheduleTranslation() {
    if (this.isTranslating) {
      return;
    }

    this.isTranslating = true;
    void this.handleScheduledTranslation();
  }

  private async handleScheduledTranslation() {
    let hasTranslations = true;
    try {
      while (hasTranslations) {
        const translatedTranslation =
          await Translation.processPendingTranslation((pendingTranslation) => {
            return this.translate(pendingTranslation);
          }, this.translationStore);

        const isTranslation = translatedTranslation !== null;
        if (!isTranslation) {
          hasTranslations = false;
          return;
        }

        this.translateNotificator.translationCompleted(translatedTranslation);
      }
    } finally {
      this.isTranslating = false;
    }
  }

  private async translate({
    languageFrom,
    languageTo,
    guideContent,
  }: {
    languageFrom: GuideLanguage;
    languageTo: GuideLanguage;
    guideContent: Record<string, string | number>;
  }): Promise<Record<string, string | number>> {
    const initialObject: { keys: string[]; values: (string | number)[] } = {
      keys: [],
      values: [],
    };

    const separatedKeyAndValues = Object.entries(guideContent).reduce(
      (aggr, [key, value]) => {
        return {
          keys: [...aggr.keys, key],
          values: [...aggr.values, value],
        };
      },
      initialObject,
    );

    const translatedValues = await Promise.all(
      separatedKeyAndValues.values.map((value) => {
        if (typeof value === 'number') return value;
        if (value.length === 0) return value;
        return this.translateFacade.translate({
          languageFrom,
          languageTo,
          text: value,
        });
      }),
    );

    return translatedValues.reduce((aggr, value, index) => {
      return { ...aggr, [separatedKeyAndValues.keys[index]]: value };
    }, {});
  }
}
