import { Controller, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import {
  CLIENT_TRANSLATION_READY,
  clientTranslationReadySchema,
} from '@lib/message-broker/messages/translation-ready.message';
import { MessageLogging } from '@lib/message-broker';

@Controller()
export class ClientTranslationReadyController {
  constructor(
    private eventEmitter: EventEmitter2,
    @Inject('API_GATEWAY') private readonly kafkaClient: ClientKafka,
  ) {}

  @MessageLogging
  @EventPattern(CLIENT_TRANSLATION_READY)
  async handleClientTranslationReady(message: unknown): Promise<void> {
    const messageParsed = clientTranslationReadySchema.safeParse(message);

    if (!messageParsed.success) {
      console.error('Incorrect Message: ', message);
      // 1. alerting system eg sentry, skipping since it is POC
      // 2. should send to DLQ, skipping since it is POC
      return;
    }

    this.eventEmitter.emit('TRANSLATION_COMPLETE', messageParsed.data);
  }
}
