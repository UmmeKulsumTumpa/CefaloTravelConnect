import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/User.service.js";

export class UserController {
    constructor (private userService: UserService){};

    async signup(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const {username, email, password} = req.body;
            const token = await this.userService.signup({username, email, password});
            res.status(201).json({token});
        } catch (error){
            next(error);
        }
    }
}

