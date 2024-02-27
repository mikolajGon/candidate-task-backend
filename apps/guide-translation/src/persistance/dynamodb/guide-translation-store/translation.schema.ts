import { Schema } from 'dynamoose';
import { Model } from 'nestjs-dynamoose';
import { TranslationStatus } from '../../../domain/entity/translation/translation-status.enum';
import { Language } from '@lib/message-broker/common/language';

export const TranslationSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  languageFrom: {
    type: String,
  },
  languageTo: {
    type: String,
  },
  status: {
    type: String,
    index: {
      name: 'statusIndex',
      type: 'global',
    },
  },
  guideId: {
    type: String,
    index: {
      name: 'guideIdIndex',
      type: 'global',
      rangeKey: 'languageTo',
    },
  },
  guideContent: {
    type: String,
  },
  guideTranslatedContent: {
    type: String,
  },
});

export type TranslationKey = {
  id: string;
};

export type TranslationObject = {
  languageFrom: Language;
  languageTo: Language;
  status: TranslationStatus;
  guideId: string;
  guideContent: string;
  guideTranslatedContent?: string;
} & TranslationKey;

export type TranslationModel = Model<TranslationObject, TranslationKey>;
