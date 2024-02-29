import { Schema } from 'dynamoose';
import { Model } from 'nestjs-dynamoose';

export const ClientSchema = new Schema({
  clientId: {
    type: String,
    hashKey: true,
  },
  guideId: {
    type: String,
    rangeKey: true,
    index: {
      type: 'global',
    },
  },
});

export type ClientKey = {
  clientId: string;
  guideId: string;
};

export type ClientObject = ClientKey;

export type ClientModel = Model<ClientObject, ClientKey>;
