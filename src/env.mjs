import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },
  client: {
    NEXT_PUBLIC_BACKEND_URL: z.string().url(),
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === 'true',
  experimental__runtimeEnv: {
    // only need to destructure client variables: Next,js >= 13.4.4
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
});

export default env;
