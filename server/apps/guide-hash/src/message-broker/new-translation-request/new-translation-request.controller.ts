import { Controller, Inject, Logger } from '@nestjs/common';
import { GuideTranslationDomainApi } from '../../domain/api/guide-translation/guide-translation.domain-api';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import {
  CLIENT_TRANSLATION_REQUEST,
  ClientTranslationRequestMessage,
  MessageLogging,
  NEW_TRANSLATION,
  NEW_TRANSLATION_REQUEST,
  NewTranslationMessage,
  NewTranslationRequestMessage,
  newTranslationRequestMessageSchema,
} from '@lib/message-broker';
import { Observable } from 'rxjs';
import { TRANSLATE } from '@lib/message-broker/messages/translate.message';

@Controller()
export class NewTranslationRequestController {
  private readonly logger = new Logger(NewTranslationRequestController.name);
  constructor(
    private readonly guideTranslationDomainApi: GuideTranslationDomainApi,
    @Inject('GUIDE_HASH') private readonly kafkaClient: ClientKafka,
  ) {}

  @EventPattern(NEW_TRANSLATION_REQUEST)
  @MessageLogging
  async handleNewTranslationRequest(
    newTranslationRequest: unknown,
  ): Promise<Observable<any> | undefined> {
    const parseResult = newTranslationRequestMessageSchema.safeParse(
      newTranslationRequest,
    );

    if (!parseResult.success) {
      this.logger.error('Incorrect Message: ', newTranslationRequest);
      // 1. alerting system eg sentry, skipping since it is POC
      // 2. should send to DLQ, skipping since it is POC
      return;
    }

    const validatedNewTranslationRequest: NewTranslationRequestMessage =
      parseResult.data;

    const observableResult =
      await this.guideTranslationDomainApi.processRequestForNewTranslation({
        translateTo: validatedNewTranslationRequest.language,
        translateFrom: validatedNewTranslationRequest.original_language,
        guide: validatedNewTranslationRequest.data,
      });

    observableResult.subscribe((result) => {
      this.logger.debug(result);

      this.kafkaClient.emit<any, ClientTranslationRequestMessage>(
        CLIENT_TRANSLATION_REQUEST,
        {
          guideId: result.payload.id,
          language: validatedNewTranslationRequest.language,
          client: validatedNewTranslationRequest.client,
        },
      );
      switch (result.message) {
        case 'TRANSLATION_DO_NOT_EXISTS':
          this.kafkaClient.emit(TRANSLATE, {
            guideId: result.payload.id,
            languageTo: validatedNewTranslationRequest.language,
            languageFrom: result.payload.language,
            guide: validatedNewTranslationRequest.data,
          });
          break;
        case 'NEW_TRANSLATION_CREATED':
          this.kafkaClient.emit<any, NewTranslationMessage>(NEW_TRANSLATION, {
            guideId: result.payload.id,
            language: result.payload.language,
            translatedGuide: validatedNewTranslationRequest.data,
          });
          break;
        case 'TRANSLATION_EXISTS':
          break;
      }
    });

    return observableResult;
  }
}
