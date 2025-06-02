import { z } from 'zod';

const databaseSchema = {
  DB_URL: z
    .string()
    .url()
    .refine(
      (url) => url.startsWith('postgres://') || url.startsWith('postgresql://'),
      {
        message:
          'DB_URL must be a valid PostgreSQL connection string (e.g., postgresql://user:password@host:port/database)',
      },
    ),
};

const commonJwtSchema = {
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters long'),
  JWT_ACCESS_TIME: z.coerce.number().int().positive(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_TIME: z.coerce.number().int().positive(),
};

const commonCookieSchema = {
  REFRESH_COOKIE: z.string(),
  COOKIE_SECRET: z.string(),
};

const seederSchema = {
  SEED_ADMIN_EMAIL: z.string().email().optional().default('admin@example.com'),
  SEED_ADMIN_PASSWORD: z
    .string()
    .min(8, 'SEED_ADMIN_PASSWORD must be at least 8 characters long')
    .optional()
    .default('AdminPassword123!'),
  SEED_USER_EMAIL: z.string().email().optional().default('user@example.com'),
  SEED_USER_PASSWORD: z
    .string()
    .min(8, 'SEED_USER_PASSWORD must be at least 8 characters long')
    .optional()
    .default('UserPassword123!'),
};

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DOMAIN: z.string().default('localhost'),
  APP_ID: z.coerce.number().int().positive().optional(),
  CORS_ORIGINS: z
    .string()
    .optional()
    .default('http://localhost:3000,http://127.0.0.1:3000'),
  ...databaseSchema,
  ...commonJwtSchema,
  ...commonCookieSchema,
  ...seederSchema,
});

export const EnvironmentVariablesSchema = EnvSchema;

export type EnvironmentVariables = z.infer<typeof EnvironmentVariablesSchema>;

export function validate(
  rawConfig: Record<string, unknown>,
): EnvironmentVariables {
  const result = EnvironmentVariablesSchema.safeParse(rawConfig);

  if (result.success === false) {
    console.error(
      `Invalid environment variables:`,
      result.error.flatten().fieldErrors,
    );
    throw new Error(
      `Invalid environment variables. Field Errors: ${JSON.stringify(
        result.error.flatten().fieldErrors,
        null,
        2,
      )}`,
    );
  }
  return result.data;
}
