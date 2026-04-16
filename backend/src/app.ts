import express, { Request, Response} from "express"
import authRouter from "./modules/auth/auth.route"
const app = express()




app.use(express.json())



app.get('/health', (req: Request, res: Response)=>{ 
    res.status(200).json({
        message: "Server is health"
    })
})

// auth routes 
app.use("/api/auth", authRouter) 


export default app