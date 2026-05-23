import express, { Request, Response } from "express"
import helmet from "helmet"
import cors, { type CorsOptions } from "cors"
import cookieParser from "cookie-parser";
import v1Router from "./routes/v1.routes"
import { env } from "./config/env"
import { isDbConnected } from "./config/database"
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware"

const app = express()

app.use(express.json())


// security 
app.use(helmet())


app.use(cookieParser());
const allowedOrigins = env.CORS_ALLOWED_ORIGINS;

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // allow non-browser requests (Postman, server-to-server)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));


app.get('/api/health', async (_req: Request, res: Response)=>{ 
    const connected = await isDbConnected();
    res.status(200).json({
        message: "Server is health",
        version: env.API_VERSION,
        database: connected ? "connected" : "disconnected",
        hasDatabaseUrl: Boolean(env.DATABASE_URL),
    })
})

app.use(env.API_PREFIX, v1Router)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
