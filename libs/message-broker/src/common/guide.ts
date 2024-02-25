import { z } from 'zod';

// @ts-expect-error because we need generic record of infinite depth.
export type NestedStringObject = Record<
  string,
  | string
  | number
  | NestedStringObject
  | (string | number | NestedStringObject)[]
>;

export const guideSchema: z.ZodType<NestedStringObject> = z.lazy(() =>
  z.record(z.string(), z.union([guideSchemaUnion, z.array(guideSchemaUnion)])),
);

const guideSchemaUnion = z.union([z.string(), z.number(), guideSchema]);
