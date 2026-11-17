import { z } from 'zod';

/** V1 roles: everyday user vs admin (CMS API gate later). */
export const UserRoleSchema = z.enum(['USER', 'ADMIN']);
export type UserRole = z.infer<typeof UserRoleSchema>;
