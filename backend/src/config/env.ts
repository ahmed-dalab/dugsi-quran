import dotenv from "dotenv"

dotenv.config()




const env  = {
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL as string
}

export { env }