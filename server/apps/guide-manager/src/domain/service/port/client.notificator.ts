import { Guide } from '../../entity/guide/guide.entity';

export const CLIENT_NOTIFICATOR_TOKEN = 'CLIENT_NOTIFICATOR_TOKEN' as const;

export interface ClientNotificator {
  notifyAboutTranslation(clientId: string, guide: Guide): void;

  notifyAboutTranslationFail(clientId: string, guide: Guide): void;
}
