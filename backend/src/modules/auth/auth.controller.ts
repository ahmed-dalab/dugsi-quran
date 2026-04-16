import {Request,Response } from "express"

const login = async(req: Request, res: Response)=>{
    try{
    //     logic of the login
    res.status(200).json({ message: "Login success"})
    }catch(error)
    {
      console.error(error)
    }
}

export { login }