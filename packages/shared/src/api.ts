import { z } from 'zod';

/** Standard success envelope for list endpoints. */
export const ApiListResponseSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
  });

/** Standard success envelope for a single resource. */
export const ApiDataResponseSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: item,
  });

/** Health check payload (liveness). */
export const HealthResponseSchema = z.object({
  ok: z.literal(true),
  service: z.string(),
  timestamp: z.string().datetime(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
