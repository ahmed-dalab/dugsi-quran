import express, { Request, Response} from "express"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser";



// route imports
import authRouter from "./modules/auth/auth.route"
import userRouter from "./modules/users/user.route"
import classRouter from "./modules/classes/class.route"
import studentRouter from "./modules/students/student.route"
import { env } from "./config/env"
import { authenticate, authorize } from "./middlewares/auth.middleware"
const app = express()

app.use(express.json())


// security 
app.use(helmet())


app.use(cookieParser());
const allowedOrigins = env.CORS_ALLOWED_ORIGINS;

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // cleaner rejection
      return callback(null, false);
    },
    credentials: true,
  })
);


app.get('/api/health', (req: Request, res: Response)=>{ 
    res.status(200).json({
        message: "Server is health"
    })
})

// auth routes 
app.use("/api/auth", authRouter) 
app.use('/api/users',authenticate, authorize("admin"), userRouter)
app.use("/api/classes", authenticate, authorize("admin"), classRouter)
app.use("/api/students", authenticate, authorize("admin"), studentRouter)


export default app
