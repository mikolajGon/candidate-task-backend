import { Module } from '@nestjs/common';
import { NewTranslationRequestController } from './message-broker/new-translation-request/new-translation-request.controller';
import { GuideTranslationDomainApi } from './domain/api/guide-translation/guide-translation.domain-api';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { DynamooseModule } from 'nestjs-dynamoose';
import { GuideTranslationStoreToken } from './domain/entity/guide/guide.store';
import { GuideDynamodbStore } from './persistance/dynamodb/guide-translation-store/guide-translation-dynamodb-store.adapter';
import { GuideSchema } from './persistance/dynamodb/guide-translation-store/guide.schema';

// simple microservices, no need to split it in more modules for this poc
// hard coding config since it is recruitment task poc
@Module({
  imports: [
    DynamooseModule.forRoot({
      local: true,
    }),
    DynamooseModule.forFeature([
      {
        name: 'GuideModel',
        schema: GuideSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'GUIDE_HASH',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'guide-hash',
            brokers: ['localhost:19092'],
          },
          consumer: {
            groupId: 'guide-hash-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [NewTranslationRequestController],
  providers: [
    GuideTranslationDomainApi,
    {
      provide: GuideTranslationStoreToken,
      useClass: GuideDynamodbStore,
    },
    ClientKafka,
  ],
})
export class GuideHashModule {}
