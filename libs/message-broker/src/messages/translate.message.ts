import { z } from 'zod';
import { LanguageEnum } from '@lib/message-broker/common/language';
import {
  guideSchema,
  NestedStringObject,
} from '@lib/message-broker/common/guide';

export const TRANSLATE = 'translate';

const languageRequestDtoSchema = z.object({
  languageFrom: LanguageEnum,
  languageTo: LanguageEnum,
});

type LanguageRequestDto = z.infer<typeof languageRequestDtoSchema>;

export const translateDtoSchema: z.ZodType<
  LanguageRequestDto & { guide: NestedStringObject }
> = languageRequestDtoSchema.extend({
  guide: guideSchema,
});

export type TranslateDtoSchema = z.infer<typeof translateDtoSchema>;
