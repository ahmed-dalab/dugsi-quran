import dotenv from "dotenv"

dotenv.config()




const API_VERSION = process.env.API_VERSION || "v1";

const env  = {
    PORT: process.env.PORT || 8080,
    API_VERSION,
    API_PREFIX: `/api/${API_VERSION}`,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as string,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
    CLIENT_URL: process.env.CLIENT_URL as string,
    HASH_SALT_ROUNDS: process.env.HASH_SALT_ROUNDS ? parseInt(process.env.HASH_SALT_ROUNDS) : 12,
   CORS_ALLOWED_ORIGINS: (() => {
  try {
    return process.env.CORS_ALLOWED_ORIGINS
      ? JSON.parse(process.env.CORS_ALLOWED_ORIGINS)
      : [];
  } catch {
    console.error("Invalid CORS_ALLOWED_ORIGINS in .env");
    return [];
  }
})(),
}

export { env }