import { z } from 'zod';
import { LanguageEnum } from '@lib/message-broker/common/language';
import { guideSchema } from '@lib/message-broker/common/guide';
import { clientSchema } from '@lib/message-broker/common';

export const NEW_TRANSLATION_REQUEST = 'new_translation_request' as const;

const languageRequestDtoSchema = z.object({
  original_language: LanguageEnum,
  language: LanguageEnum,
});

export type LanguageRequestDto = z.infer<typeof languageRequestDtoSchema>;

export const newTranslationRequestDtoSchema = languageRequestDtoSchema.extend({
  data: guideSchema,
  client: clientSchema,
});

export type NewTranslationRequestDto = z.infer<
  typeof newTranslationRequestDtoSchema
>;
