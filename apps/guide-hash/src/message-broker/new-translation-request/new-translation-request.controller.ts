import { Controller, Inject } from '@nestjs/common';
import { GuideTranslationDomainApi } from '../../domain/api/guide-translation/guide-translation.domain-api';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import {
  NEW_TRANSLATION_REQUEST,
  NewTranslationRequestDto,
  newTranslationRequestDtoSchema,
} from '@lib/message-broker';
import { Observable } from 'rxjs';
import { ProcessTranslationResults } from '../../domain/api/guide-translation/process-translation.results';

@Controller()
export class NewTranslationRequestController {
  constructor(
    private readonly guideHashService: GuideTranslationDomainApi,
    @Inject('GUIDE_HASH') private readonly kafkaClient: ClientKafka,
  ) {}

  @EventPattern(NEW_TRANSLATION_REQUEST)
  async handleNewTranslationRequest(
    newTranslationRequest: unknown,
  ): Promise<Observable<any>> {
    const parseResult = newTranslationRequestDtoSchema.safeParse(
      newTranslationRequest,
    );

    if (!parseResult.success) {
      throw new Error();
    }

    const validatedNewTranslationRequest: NewTranslationRequestDto =
      parseResult.data;

    const observableResult = await this.guideHashService.processNewTranslation({
      translateTo: validatedNewTranslationRequest.language,
      translateFrom: validatedNewTranslationRequest.original_language,
      guide: validatedNewTranslationRequest.data,
    });

    observableResult.subscribe((result) => {
      this.handleProcessTranslationResult(
        result,
        validatedNewTranslationRequest,
      );
    });

    return observableResult;
  }

  private handleProcessTranslationResult(
    result: ProcessTranslationResults,
    validatedNewTranslationRequest: NewTranslationRequestDto,
  ) {
    switch (result) {
      case 'TRANSLATION_DO_NOT_EXISTS':
      case 'NEW_TRANSLATION_CREATED':
        this.kafkaClient.emit(
          'new_translation',
          JSON.stringify({
            language: validatedNewTranslationRequest.original_language,
            guide: validatedNewTranslationRequest.data,
          }),
        );
        break;
      case 'TRANSLATION_EXISTS':
    }
  }

  @EventPattern('new_translation')
  itsAlive(newTranslationRequest: unknown) {
    console.log('ITS ALIVE', newTranslationRequest);
  }
}
