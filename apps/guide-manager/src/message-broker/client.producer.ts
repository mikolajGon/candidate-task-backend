import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Guide } from '../domain/entity/guide/guide.entity';
import { Client } from '../domain/entity/client/client.entity';
import {
  CLIENT_TRANSLATION_READY,
  ClientTranslationReady,
} from '@lib/message-broker/messages/translation-ready.message';
import { ClientNotificator } from '../domain/service/port/client.notificator';

@Injectable()
export class ClientProducer implements ClientNotificator {
  constructor(
    @Inject('GUIDE_MANAGER') private readonly kafkaClient: ClientKafka,
  ) {}

  public notifyAboutTranslation(clientId: string, guide: Guide) {
    this.kafkaClient.emit<unknown, ClientTranslationReady>(
      CLIENT_TRANSLATION_READY,
      {
        translateSuccess: true,
        client: { clientId },
        guideId: guide.externalGuideId,
        language: guide.language,
        translatedGuide: guide.content,
      },
    );
  }
  public notifyAboutTranslationFail(clientId: string, guide: Guide) {
    this.kafkaClient.emit<unknown, ClientTranslationReady>(
      CLIENT_TRANSLATION_READY,
      {
        translateSuccess: false,
        client: { clientId },
        guideId: guide.externalGuideId,
        language: guide.language,
      },
    );
  }
}
