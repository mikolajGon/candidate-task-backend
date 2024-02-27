import { z } from 'zod';
import { LanguageEnum } from '@lib/message-broker/common/language';
import { guideSchema } from '@lib/message-broker/common/guide';

export const NEW_TRANSLATION_REQUEST = 'new_translation_request' as const;

const languageRequestDtoSchema = z.object({
  original_language: LanguageEnum,
  language: LanguageEnum,
});

export type LanguageRequestDto = z.infer<typeof languageRequestDtoSchema>;

export const newTranslationRequestDtoSchema = languageRequestDtoSchema.extend({
  data: guideSchema,
});

export type NewTranslationRequestDto = z.infer<
  typeof newTranslationRequestDtoSchema
>;
