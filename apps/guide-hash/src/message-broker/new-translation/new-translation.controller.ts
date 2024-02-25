import { Controller, Inject } from '@nestjs/common';
import { GuideTranslationDomainApi } from '../../domain/api/guide-translation/guide-translation.domain-api';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { NEW_TRANSLATION } from '@lib/message-broker';

@Controller()
export class NewTranslationController {
  constructor(
    private readonly guideHashService: GuideTranslationDomainApi,
    @Inject('GUIDE_HASH') private readonly kafkaClient: ClientKafka,
  ) {}

  @EventPattern(NEW_TRANSLATION)
  itsAlive(newTranslationRequest: unknown) {
    console.log('ITS ALIVE', newTranslationRequest);
  }
}
