import { Schema } from 'dynamoose';
import { Model } from 'nestjs-dynamoose';

export const GuideSchema = new Schema({
  language: {
    type: String,
    hashKey: true,
  },
  hash: {
    type: String,
    rangeKey: true,
  },
  id: {
    type: String,
    index: {
      name: 'idIndex',
      type: 'global',
      rangeKey: 'language',
    },
  },
});

export type GuideKey = {
  hash: string;
  language: string;
};

export type GuideObject = {
  id: string;
} & GuideKey;

export type GuideModel = Model<GuideObject, GuideKey>;
