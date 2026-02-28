import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().min(0).max(65535),
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_RESET_PASSWORD_SECRET: z.string().min(32),
  JWT_EXPIRES: z.coerce.number().min(1),
  JWT_REFRESH_EXPIRES: z.coerce.number().min(1),
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(1),
});

const { success, data, error } = envSchema.safeParse(process.env);
if (!success) {
  console.log(z.flattenError(error));
  throw new Error('Validation error in environment variables');
}

export const envConfig = data;
