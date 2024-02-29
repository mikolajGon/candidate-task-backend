import { z } from 'zod';
import { LanguageEnum } from '@lib/message-broker/common/language';
import { clientSchema } from '@lib/message-broker/common/client';

export const CLIENT_TRANSLATION_REQUEST = 'client_translation_request' as const;

export const clientTranslationRequestMessageSchema = z.object({
  guideId: z.string(),
  language: LanguageEnum,
  client: clientSchema,
});

export type ClientTranslationRequestMessage = z.infer<
  typeof clientTranslationRequestMessageSchema
>;
