import { Router} from "express"
import { login, logout, me, refreshToken } from "./auth.controller"
import { authenticate } from "../../middlewares/auth.middleware"
import { loginValidationSchema } from "./auth.validations"
import { validateRequest } from "../../middlewares/validateRequest"


const authRouter = Router()


// login 
authRouter.post('/login', login)
//  refresh token 
authRouter.post('/refresh-token', refreshToken)
// logout 
authRouter.post("/logout", logout);
// reset password 
// auth me 
authRouter.get("/me", authenticate, me);

export default authRouter