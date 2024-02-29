import { Module } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NewTranslationController } from './message-broker/new-translation.controller';
import { GuideSchema } from './persistance/dynamodb/guide-store/guide.schema';
import { ClientSchema } from './persistance/dynamodb/client-store/client.schema';
import { TranslationDispatchService } from './domain/service/translation-dispatch.service';
import { ClientTranslationDomainApi } from './domain/api/client-translation.domain-api';
import { GuideDynamodbStore } from './persistance/dynamodb/guide-store/guide-dynamodb-store.adapter';
import { GUIDE_STORY_TOKEN } from './domain/entity/guide/guide.store';
import { CLIENT_STORE_TOKEN } from './domain/entity/client/client.store';
import { ClientDynamoDbStore } from './persistance/dynamodb/client-store/client-dynamodb-store.adapter';
import { CLIENT_NOTIFICATOR_TOKEN } from './domain/service/port/client.notificator';
import { ClientProducer } from './message-broker/client.producer';
import { ClientTranslationRequestController } from './message-broker/client-translation-request-controller';

@Module({
  imports: [
    DynamooseModule.forRoot({
      local: `${process.env.DYNAMODB_ADDRESS}`,
    }),
    DynamooseModule.forFeature([
      {
        name: 'GuideModel',
        schema: GuideSchema,
        options: {
          tableName: 'guide-manager-service-guide',
        },
      },
      {
        name: 'ClientModel',
        schema: ClientSchema,
        options: {
          tableName: 'guide-manager-service-client',
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'GUIDE_MANAGER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'guide-manager',
            brokers: [`${process.env.KAFKA_ADDRESS}`],
          },
          consumer: {
            groupId: 'guide-manager-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [NewTranslationController, ClientTranslationRequestController],
  providers: [
    ClientKafka,
    TranslationDispatchService,
    ClientTranslationDomainApi,
    {
      provide: GUIDE_STORY_TOKEN,
      useClass: GuideDynamodbStore,
    },
    {
      provide: CLIENT_STORE_TOKEN,
      useClass: ClientDynamoDbStore,
    },
    {
      provide: CLIENT_NOTIFICATOR_TOKEN,
      useClass: ClientProducer,
    },
  ],
})
export class GuideManagerModule {}
