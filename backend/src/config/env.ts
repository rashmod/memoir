import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config());

const schema = z
  .object({
    HOST: z.string().trim().min(1),
    PORT: z.coerce.number().int().positive(),
    NODE_ENV: z.enum(["development", "production", "test"]),

    DB_HOST: z.string().trim().min(1),
    DB_USER: z.string().trim().min(1),
    DB_PASSWORD: z.string().trim().min(1),
    DB_NAME: z.string().trim().min(1),
    DB_PORT: z.coerce.number().int().positive(),
    DB_URL: z.string().trim().min(1),

    YOUTUBE_API_KEY: z.string().trim().min(1),
  })
  .refine(
    (data) =>
      data.DB_URL ===
      `postgresql://${data.DB_USER}:${data.DB_PASSWORD}@${data.DB_HOST}:${data.DB_PORT}/${data.DB_NAME}`,
    { path: ["DB_URL"] },
  );

const parsedEnv = schema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsedEnv.error.format(), null, 4),
  );
  process.exit(1);
}

export default parsedEnv.data;
