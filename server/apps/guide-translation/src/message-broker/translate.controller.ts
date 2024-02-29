import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import {
  TRANSLATE,
  translateDtoSchema,
} from '@lib/message-broker/messages/translate.message';
import { TranslateDomainApi } from '../domain/api/translate/translate.domain-api';
import { GuideContent } from '../domain/entity/translation/guide-content';
import { flatten } from 'flat';
import { MessageLogging } from '@lib/message-broker';

@Controller()
export class TranslateController {
  constructor(
    private readonly translateDomainApi: TranslateDomainApi,
    @Inject('GUIDE_TRANSLATION') private readonly kafkaClient: ClientKafka,
  ) {}

  @EventPattern(TRANSLATE)
  @MessageLogging
  async getHello(translateDto: unknown): Promise<void> {
    console.log('translate started');
    const parseResult = translateDtoSchema.safeParse(translateDto);

    if (!parseResult.success) {
      console.error('Incorrect Message: ', translateDto);
      // 1. alerting system eg sentry, skipping since it is POC
      // 2. should send to DLQ, skipping since it is POC
      return;
    }

    const flatGuide: GuideContent = flatten(parseResult.data.guide);

    await this.translateDomainApi.createNewTranslation({
      ...parseResult.data,
      guideContent: flatGuide,
    });
  }
}
