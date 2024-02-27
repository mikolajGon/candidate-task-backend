import { Controller } from '@nestjs/common';
import { GuideTranslationDomainApi } from '../../domain/api/guide-translation/guide-translation.domain-api';
import { EventPattern } from '@nestjs/microservices';
import { NEW_TRANSLATION, newTranslationSchema } from '@lib/message-broker';

@Controller()
export class NewTranslationController {
  constructor(
    private readonly guideTranslationDomainApi: GuideTranslationDomainApi,
  ) {}

  @EventPattern(NEW_TRANSLATION)
  async handleNewTranslation(newTranslation: unknown) {
    const parseResult = newTranslationSchema.safeParse(newTranslation);

    if (!parseResult.success) {
      console.error('Incorrect Message: ', newTranslation);
      // 1. alerting system eg sentry, skipping since it is POC
      // 2. should send to DLQ, skipping since it is POC
      return;
    }

    const { language, translatedGuide, guideId } = parseResult.data;

    await this.guideTranslationDomainApi.processNewTranslation({
      language,
      id: guideId,
      guideContent: translatedGuide,
    });
  }
}
