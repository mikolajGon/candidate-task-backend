import { z } from 'zod';
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
export const guideSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(guideSchema), z.record(guideSchema)]),
);

export type Guide = z.infer<typeof guideSchema>;
