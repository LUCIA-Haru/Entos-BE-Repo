import { z } from 'zod';

/** Café publication state for admin workflows later. */
export const CafeStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export type CafeStatus = z.infer<typeof CafeStatusSchema>;

/** Weekday enum aligned with Prisma CafeHours.dayOfWeek (0 = Sunday). */
export const DayOfWeekSchema = z.number().int().min(0).max(6);
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;

/** Public café list query (Milestone 3 will use this). */
export const CafeListQuerySchema = z.object({
  city: z.string().trim().min(1).optional(),
  township: z.string().trim().min(1).optional(),
  tag: z.string().trim().min(1).optional(),
  openNow: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .optional()
    .transform((v) => v === true || v === 'true'),
});
export type CafeListQuery = z.infer<typeof CafeListQuerySchema>;

/** Slim café shape safe to return in list endpoints. */
export const CafeSummarySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  slug: z.string(),
  status: CafeStatusSchema,
  city: z.string(),
  township: z.string().nullable(),
  shortDescription: z.string().nullable(),
});
export type CafeSummary = z.infer<typeof CafeSummarySchema>;
