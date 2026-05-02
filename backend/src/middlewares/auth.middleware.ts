import jwt from "jsonwebtoken";
import { env } from "../config/env";
import {User, UserRole} from "../modules/users/user.model";
import type { Request, Response, NextFunction } from "express"


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.sub).select("-password");
    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "User not found",
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role
    };

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized: Invalid token",
    });
  }
};


export const authorize = (...roles: UserRole[])=>{
    return (req: Request, res: Response, next: NextFunction)=>{
        if(!req.user || !roles.includes(req.user?.role)){
            return res.status(403).json({
                status: 'failed',
                message: "Forbidden: You don't have permission to access this resource"
            })
        }
        next()
    }
}