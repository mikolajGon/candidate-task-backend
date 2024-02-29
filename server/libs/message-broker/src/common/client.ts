import { z } from 'zod';

export const clientSchema = z.object({
  clientId: z.string(),
});

export type Client = z.infer<typeof clientSchema>;
