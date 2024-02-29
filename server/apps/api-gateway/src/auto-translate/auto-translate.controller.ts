import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  NEW_TRANSLATION_REQUEST,
  NewTranslationRequestMessage,
} from '@lib/message-broker';
import { autoTranslateDtoSchema } from './auto-translate.dto';
import { v4 } from 'uuid';
import { SetRequestTimeout } from '../infrastructure/timeout/timeout.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('/v1/auto-translate')
export class AutoTranslateController {
  private static readonly TRANSLATION_ENDPOINT_TIMEOUT = 20000;
  constructor(
    @Inject('API_GATEWAY') private readonly kafkaClient: ClientKafka,
    private eventEmitter: EventEmitter2,
  ) {}

  //skipping auth
  @Post()
  @HttpCode(200)
  @SetRequestTimeout(
    AutoTranslateController.TRANSLATION_ENDPOINT_TIMEOUT + 5000,
  )
  getHello(@Body() body: unknown) {
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
      setTimeout(
        () => resolve(true),
        AutoTranslateController.TRANSLATION_ENDPOINT_TIMEOUT,
      );

      this.eventEmitter.on('TRANSLATION_COMPLETE', (translation) => {
        console.log(translation);
        if (translation.client.clientId === clientId) {
          resolve(translation);
        }
      });
    });
  }
}
