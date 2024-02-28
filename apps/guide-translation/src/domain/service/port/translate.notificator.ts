import { Translation } from '../../entity/translation/translation.entity';

export const TranslateNotificatorToken = 'TranslateNotificatorToken' as const;

export interface TranslateNotificator {
  translationCompleted: (translation: Translation) => void;
}
