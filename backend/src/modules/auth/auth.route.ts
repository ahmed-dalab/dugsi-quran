import { Router} from "express"
import { login } from "./auth.controller"


const authRouter = Router()


// login 
authRouter.post('/login', login)


export default authRouter