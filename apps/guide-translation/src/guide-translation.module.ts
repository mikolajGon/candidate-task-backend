import { Module } from '@nestjs/common';
import { TranslateController } from './message-broker/translate.controller';
import { TranslateDomainApi } from './domain/api/translate/translate.domain-api';
import { TranslatorService } from './domain/service/translator.service';
import { HttpModule } from '@nestjs/axios';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { DynamooseModule } from 'nestjs-dynamoose';
import { TranslationSchema } from './persistance/dynamodb/guide-translation-store/translation.schema';
import { TranslationStoreToken } from './domain/entity/translation/translation-store';
import { TranslationDynamodbStore } from './persistance/dynamodb/guide-translation-store/translation-dynamodb-store.adapter';
import { TranslateHttpFacade } from './facade/translate/translate-http.facade';
import { ScheduleModule } from '@nestjs/schedule';
import { TranslateFacadeToken } from './domain/service/port/translate.facade';
import { TranslateNotificatorToken } from './domain/service/port/translate.notificator';
import { NewTranslationProducer } from './message-broker/new-translation.producer';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    DynamooseModule.forRoot({
      local: true,
    }),
    DynamooseModule.forFeature([
      {
        name: 'TranslationModel',
        schema: TranslationSchema,
        options: {
          tableName: 'guide-translation-service-translation',
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'GUIDE_TRANSLATION',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'guide-translation',
            brokers: ['localhost:19092'],
          },
          consumer: {
            groupId: 'guide-translation-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TranslateController],
  providers: [
    TranslateDomainApi,
    {
      provide: TranslationStoreToken,
      useClass: TranslationDynamodbStore,
    },
    {
      provide: TranslateFacadeToken,
      useClass: TranslateHttpFacade,
    },
    {
      provide: TranslateNotificatorToken,
      useClass: NewTranslationProducer,
    },
    TranslatorService,
    ClientKafka,
  ],
})
export class GuideTranslationModule {}
