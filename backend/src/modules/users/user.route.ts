import { Router } from "express"
import { createUser, deleteUser, getUser, getUsers, toggleUserStatus, updateUser } from "./user.controller";

const userRouter = Router()



// create user 
userRouter.post("/", createUser)

// get users 
userRouter.get('/', getUsers)
// get user
userRouter.get('/:id', getUser)
// update user
userRouter.put('/:id', updateUser)
// delete user
userRouter.delete('/:id', deleteUser)
// toggle user status
userRouter.patch("/:id/toggle-status", toggleUserStatus)

export default userRouter;
