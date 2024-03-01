import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  NEW_TRANSLATION_REQUEST,
  NewTranslationRequestMessage,
} from '@lib/message-broker';
import { autoTranslateDtoSchema } from './auto-translate.dto';
import { v4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SetRequestTimeout } from '../infrastructure/timeout/timeout.decorator';
import { TimedOutTranslationService } from './timed-out-translation.service';
import { GuideContent } from '@lib/domain';

@Controller('/v1/auto-translate')
export class AutoTranslateController {
  private static readonly TRANSLATION_ENDPOINT_TIMEOUT = 15000;
  constructor(
    @Inject('API_GATEWAY') private readonly kafkaClient: ClientKafka,
    private readonly eventEmitter: EventEmitter2,
    private readonly timedOutTranslationService: TimedOutTranslationService,
  ) {}

  @Post()
  @HttpCode(200)
  @SetRequestTimeout(
    AutoTranslateController.TRANSLATION_ENDPOINT_TIMEOUT + 5000,
  )
  autoTranslate(@Body() body: unknown) {
    const validatedBody = autoTranslateDtoSchema.safeParse(body);

    if (!validatedBody.success) {
      throw new BadRequestException('incorrect body');
    }

    const clientId = v4();

    this.kafkaClient.emit<NewTranslationRequestMessage>(
      NEW_TRANSLATION_REQUEST,
      {
        client: { clientId },
        ...validatedBody.data,
      },
    );

    return new Promise((resolve) => {
      // Requirement was to use sync communication.
      // Nevertheless, some websocket/webhook/mail or whatever notification communication with client would be way more elegant
      const timeOutResponse = {
        message:
          'Translation take a little bit longer than expected. It will be ready soon under GET endpoint',
        url: `http://localhost:3000/v1/auto-translate/${clientId}`,
      };

      setTimeout(() => {
        this.timedOutTranslationService.timedOut(clientId);
        resolve(timeOutResponse);
      }, AutoTranslateController.TRANSLATION_ENDPOINT_TIMEOUT);

      this.eventEmitter.on('TRANSLATION_COMPLETE', (translation) => {
        if (this.timedOutTranslationService.hasTimedOut(clientId)) {
          return resolve(timeOutResponse);
        }

        if (translation.client.clientId === clientId) {
          resolve({
            ...validatedBody.data,
            data: translation.translatedGuide,
          });
        }
      });
    });
  }

  @Get(':id')
  public getTimedOutTranslation(
    @Param() { id }: any,
  ): Promise<{ translation: GuideContent } | { message: string }> {
    const observable = this.timedOutTranslationService.getTranslation(id);

    return new Promise((resolve, reject) =>
      observable.subscribe((result) => {
        switch (result.message) {
          case 'READY':
            return resolve({ translation: result.payload });
          case 'NOT_READY':
            return resolve({ message: 'not ready yet, try again later' });
          case 'NOT_EXISTS':
            return reject(new NotFoundException());
        }
      }),
    );
  }
}
