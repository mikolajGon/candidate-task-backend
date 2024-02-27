import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-dynamoose';
import { TranslationModel, TranslationObject } from './translation.schema';
import { TranslationStore } from '../../../domain/entity/translation/translation-store';
import {
  Translation,
  TranslationConstructor,
} from '../../../domain/entity/translation/translation.entity';
import { TranslationStatus } from '../../../domain/entity/translation/translation-status.enum';
import { Language } from '@lib/message-broker/common/language';
import { GuideLanguage } from '@lib/domain';

@Injectable()
export class TranslationDynamodbStore implements TranslationStore {
  constructor(
    @InjectModel('TranslationModel')
    private translationModel: TranslationModel,
  ) {}

  async create(translation: Translation): Promise<void> {
    await this.translationModel.create(this.domainToModel(translation));
  }

  async getPending(): Promise<TranslationConstructor | null> {
    const result = await this.translationModel
      .query('status')
      .using('statusIndex')
      .eq('PENDING')
      .limit(1)
      .exec();

    const pendingTranslation = result[0];
    return pendingTranslation === undefined
      ? null
      : this.modelToDomain(pendingTranslation);
  }

  async changeStatus(id: string, status: TranslationStatus): Promise<void> {
    const object = await this.translationModel.get({ id });
    await this.translationModel.update({ ...object, status });
  }

  async saveCompleted(translation: Translation): Promise<void> {
    await this.translationModel.update(this.domainToModel(translation));
  }

  async getByGuideIdAndLanguage(
    guideId: string,
    language: GuideLanguage,
  ): Promise<TranslationConstructor | null> {
    const result = await this.translationModel
      .query('guideId')
      .using('guideIdIndex')
      .eq(guideId)
      .where('languageTo')
      .eq(language)
      .limit(1)
      .exec();

    const translation = result[0];

    return translation === undefined ? null : this.modelToDomain(translation);
  }

  private domainToModel(translation: Translation): TranslationObject {
    return {
      id: translation.id,
      guideId: translation.guideId,
      languageFrom: translation.languageFrom,
      languageTo: translation.languageTo,
      status: translation.status,
      guideTranslatedContent:
        translation.translatedGuideContent === undefined
          ? translation.translatedGuideContent
          : JSON.stringify(translation.translatedGuideContent),
      guideContent: JSON.stringify(translation.guideContent),
    };
  }

  private modelToDomain(pendingTranslation: TranslationObject) {
    return {
      id: pendingTranslation.id,
      guideId: pendingTranslation.guideId,
      languageFrom: <Language>pendingTranslation.languageFrom,
      languageTo: pendingTranslation.languageTo,
      status: pendingTranslation.status,
      guideContent: JSON.parse(pendingTranslation.guideContent),
    };
  }
}
