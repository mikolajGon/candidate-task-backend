import { z } from 'zod';
import { LanguageEnum } from '@lib/message-broker/common/language';
import { guideSchema } from '@lib/message-broker/common/guide';

export const NEW_TRANSLATION = 'new_translation' as const;

export const newTranslationSchema = z.object({
  guideId: z.string(),
  language: LanguageEnum,
  translatedGuide: guideSchema,
});

export type NewTranslationMessage = z.infer<typeof newTranslationSchema>;
