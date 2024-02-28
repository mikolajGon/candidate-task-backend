import { z } from 'zod';
import { LanguageEnum } from '@lib/message-broker/common/language';
import { guideSchema } from '@lib/message-broker/common/guide';

export const TRANSLATE = 'translate';

export const translateDtoSchema = z.object({
  languageFrom: LanguageEnum,
  languageTo: LanguageEnum,
  guide: guideSchema,
  guideId: z.string(),
});

export type TranslateDtoSchema = z.infer<typeof translateDtoSchema>;
