import { Schema } from 'dynamoose';
import { Model } from 'nestjs-dynamoose';
import { GuideLanguage } from '@lib/domain';

export const GuideSchema = new Schema({
  externalId: {
    type: String,
    hashKey: true,
  },
  language: {
    type: String,
    rangeKey: true,
  },
  id: {
    type: String,
    index: {
      name: 'idIndex',
      type: 'global',
    },
  },
  content: {
    type: String,
  },
});

export type GuideKey = {
  externalId: string;
  language: GuideLanguage;
};

export type GuideObject = {
  id: string;
  content?: string;
} & GuideKey;

export type GuideModel = Model<GuideObject, GuideKey>;
