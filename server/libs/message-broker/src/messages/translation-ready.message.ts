import { z } from 'zod';
import { guideSchema } from '@lib/message-broker/common/guide';
import { clientTranslationRequestMessageSchema } from '@lib/message-broker';

export const CLIENT_TRANSLATION_READY = 'client_translation_ready' as const;

export const clientTranslationReadySchema = z.union([
  clientTranslationRequestMessageSchema.extend({
    translateSuccess: z.literal(false),
  }),
  clientTranslationRequestMessageSchema.extend({
    translateSuccess: z.literal(true),
    translatedGuide: guideSchema,
  }),
]);

export type ClientTranslationReady = z.infer<
  typeof clientTranslationReadySchema
>;
