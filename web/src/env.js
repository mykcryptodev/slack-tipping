import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    AUTH_SLACK_ID: z.string(),
    AUTH_SLACK_SECRET: z.string(),
    AUTH_SLACK_SIGNING_SECRET: z.string(),
    AUTH_SLACK_STATE_SECRET: z.string(),
    THIRDWEB_ENGINE_ACCESS_TOKEN: z.string(),
    THIRDWEB_ENGINE_URL: z.string(),
    THIRDWEB_CLIENT_ID: z.string(),
    REDIS_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_SLACK_ID: process.env.AUTH_SLACK_ID,
    AUTH_SLACK_SECRET: process.env.AUTH_SLACK_SECRET,
    AUTH_SLACK_SIGNING_SECRET: process.env.AUTH_SLACK_SIGNING_SECRET,
    AUTH_SLACK_STATE_SECRET: process.env.AUTH_SLACK_STATE_SECRET,
    THIRDWEB_ENGINE_ACCESS_TOKEN: process.env.THIRDWEB_ENGINE_ACCESS_TOKEN,
    THIRDWEB_ENGINE_URL: process.env.THIRDWEB_ENGINE_URL,
    THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
    REDIS_URL: process.env.REDIS_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
