import { Inject, Injectable, Logger } from '@nestjs/common';
import { Guide } from '../entity/guide/guide.entity';
import { Client } from '../entity/client/client.entity';
import { CLIENT_STORE_TOKEN, ClientStore } from '../entity/client/client.store';
import {
  CLIENT_NOTIFICATOR_TOKEN,
  ClientNotificator,
} from './port/client.notificator';

@Injectable()
export class TranslationDispatchService {
  private readonly logger = new Logger(TranslationDispatchService.name);

  constructor(
    @Inject(CLIENT_NOTIFICATOR_TOKEN)
    private readonly clientNotificator: ClientNotificator,
    @Inject(CLIENT_STORE_TOKEN)
    private readonly clientStore: ClientStore,
  ) {}

  public async dispatchToClient(client: Client, guide: Guide) {
    if (client.guideId !== guide.id) throw new Error('Incorrect guide passed');

    if (guide.isComplete) {
      this.clientNotificator.notifyAboutTranslation(client.clientId, guide);
      await client.clientHasBeenNotified();
    }
  }

  public async newTranslation(guide: Guide) {
    await Client.processClientsForGuideId(
      guide.id,
      (clients) => {
        clients.map((client) => {
          try {
            this.clientNotificator.notifyAboutTranslation(
              client.clientId,
              guide,
            );
          } catch (e) {
            this.logger.error(e);
            this.clientNotificator.notifyAboutTranslationFail(
              client.clientId,
              guide,
            );
          }
        });
      },
      this.clientStore,
    );
  }
}
