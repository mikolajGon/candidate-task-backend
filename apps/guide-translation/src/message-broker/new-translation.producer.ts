import { Inject, Injectable } from '@nestjs/common';
import { TranslateNotificator } from '../domain/service/port/translate.notificator';
import { Translation } from '../domain/entity/translation/translation.entity';
import { unflatten } from 'flat';
import { ClientKafka } from '@nestjs/microservices';
import {
  NEW_TRANSLATION,
  NEW_TRANSLATION_REQUEST,
  NewTranslationMessage,
  NewTranslationRequestDto,
} from '@lib/message-broker';
import { Guide } from '@lib/message-broker/common/guide';

@Injectable()
export class NewTranslationProducer implements TranslateNotificator {
  constructor(
    @Inject('GUIDE_TRANSLATION') private readonly kafkaClient: ClientKafka,
  ) {}
  public translationCompleted(translation: Translation) {
    const translatedGuide: Guide = unflatten(
      translation.translatedGuideContent,
    );

    this.kafkaClient.emit<unknown, NewTranslationMessage>(NEW_TRANSLATION, {
      guideId: translation.guideId,
      language: translation.languageTo,
      translatedGuide,
    });
  }
}
