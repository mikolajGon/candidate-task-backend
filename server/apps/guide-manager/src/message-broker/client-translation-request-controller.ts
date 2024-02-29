import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import {
  CLIENT_TRANSLATION_REQUEST,
  ClientTranslationRequestMessage,
  clientTranslationRequestMessageSchema,
  MessageLogging,
} from '@lib/message-broker';
import { Observable } from 'rxjs';
import { ClientTranslationDomainApi } from '../domain/api/client-translation.domain-api';

@Controller()
export class ClientTranslationRequestController {
  private readonly logger = new Logger(ClientTranslationRequestController.name);
  constructor(
    private readonly clientTranslationDomainApi: ClientTranslationDomainApi,
  ) {}

  @EventPattern(CLIENT_TRANSLATION_REQUEST)
  @MessageLogging
  async handleClientTranslationRequest(
    newTranslationRequest: unknown,
  ): Promise<Observable<any> | undefined> {
    const parseResult = clientTranslationRequestMessageSchema.safeParse(
      newTranslationRequest,
    );

    if (!parseResult.success) {
      this.logger.error('Incorrect Message: ', newTranslationRequest);
      // 1. alerting system eg sentry, skipping since it is POC
      // 2. should send to DLQ, skipping since it is POC
      return;
    }

    const clientTranslationRequestMessage: ClientTranslationRequestMessage =
      parseResult.data;

    await this.clientTranslationDomainApi.clientTranslationRequest(
      clientTranslationRequestMessage.client.clientId,
      {
        externalGuideId: clientTranslationRequestMessage.guideId,
        language: clientTranslationRequestMessage.language,
      },
    );
  }
}
