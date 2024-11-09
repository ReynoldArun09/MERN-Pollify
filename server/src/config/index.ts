import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvVariables = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().min(1).max(4),
  MONGO_DB_URI: z.string().min(1).readonly(),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
});

export const ParsedEnv = EnvVariables.parse(process.env);
