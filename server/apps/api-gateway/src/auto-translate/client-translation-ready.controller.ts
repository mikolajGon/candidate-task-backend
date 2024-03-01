import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  CLIENT_TRANSLATION_READY,
  clientTranslationReadySchema,
} from '@lib/message-broker/messages/translation-ready.message';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageLogging } from '@lib/message-broker';

@Controller()
export class ClientTranslationReadyController {
  private readonly logger = new Logger(ClientTranslationReadyController.name);
  constructor(private eventEmitter: EventEmitter2) {}

  @EventPattern(CLIENT_TRANSLATION_READY)
  @MessageLogging
  async handleClientTranslationReady(message: unknown): Promise<void> {
    const messageParsed = clientTranslationReadySchema.safeParse(message);

    if (!messageParsed.success) {
      this.logger.error('Incorrect Message: ', message);
      // 1. alerting system eg sentry, skipping since it is POC
      // 2. should send to DLQ, skipping since it is POC
      return;
    }
    this.eventEmitter.emit('TRANSLATION_COMPLETE', messageParsed.data);
  }
}
