import { guideSchema, languageMessage } from '@lib/message-broker';
import { z } from 'zod';

export const autoTranslateDtoSchema = languageMessage.extend({
  data: guideSchema,
});

export type AutoTranslateDto = z.infer<typeof autoTranslateDtoSchema>;
