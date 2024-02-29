import { z } from 'zod';
import { LanguageEnum } from '@lib/message-broker/common/language';
import { guideSchema } from '@lib/message-broker/common/guide';
import { clientSchema } from '@lib/message-broker/common';

export const NEW_TRANSLATION_REQUEST = 'new_translation_request' as const;

export const languageMessage = z.object({
  original_language: LanguageEnum,
  language: LanguageEnum,
});

export type LanguageMessage = z.infer<typeof languageMessage>;

export const newTranslationRequestMessageSchema = languageMessage.extend({
  data: guideSchema,
  client: clientSchema,
});

export type NewTranslationRequestMessage = z.infer<
  typeof newTranslationRequestMessageSchema
>;
