import { Injectable } from '@nestjs/common';
import { GuideContent, ObservableResult } from '@lib/domain';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TimedOutTranslationService {
  private readonly inMemoryTranslationStore = new Map<
    string,
    GuideContent | null
  >();

  constructor(private readonly eventEmitter: EventEmitter2) {
    eventEmitter.on('TRANSLATION_COMPLETE', (translation) => {
      if (this.hasTimedOut(translation.client.clientId)) {
        this.inMemoryTranslationStore.set(
          translation.client.clientId,
          translation.translatedGuide,
        );
      }
    });
  }

  public hasTimedOut(id: string) {
    return this.inMemoryTranslationStore.has(id);
  }

  public timedOut(id: string) {
    this.inMemoryTranslationStore.set(id, undefined);
  }

  public getTranslation(
    id: string,
  ): ObservableResult<
    'NOT_EXISTS' | 'NOT_READY' | 'READY',
    GuideContent | undefined
  > {
    return new Observable((subscriber) => {
      if (!this.hasTimedOut(id)) {
        subscriber.next({ message: 'NOT_EXISTS', payload: undefined });
        subscriber.complete();
      }

      const translation = this.inMemoryTranslationStore.get(id);

      if (translation === undefined) {
        subscriber.next({ message: 'NOT_READY', payload: undefined });
        subscriber.complete();
      }

      subscriber.next({ message: 'READY', payload: translation });
      this.inMemoryTranslationStore.delete(id);
      subscriber.complete();
    });
  }
}
