import { Controller, Inject } from '@nestjs/common';
import { GuideTranslationDomainApi } from '../../domain/api/guide-translation/guide-translation.domain-api';
import { ClientKafka, EventPattern } from '@nestjs/microservices';

@Controller()
export class TranslationCompletedController {
  constructor(
    private readonly guideHashService: GuideTranslationDomainApi,
    @Inject('GUIDE_HASH') private readonly kafkaClient: ClientKafka,
  ) {}

  @EventPattern('translation_completed')
  itsAlive(newTranslationRequest: unknown) {
    console.log('ITS ALIVE', newTranslationRequest);
  }
}
