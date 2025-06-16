import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/User.service.js";
import { SignupDto, UpdateUserDto, ChangePasswordDto } from "../interfaces/UserDto.js";

export class UserController {
    constructor (private userService: UserService){};

    async signup(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const dto: SignupDto = req.body;
            const token = await this.userService.signup(dto);
            res.status(201).json({ token });
        } catch (error){
            next(error);
        }
    };

    async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            
            const token = await this.userService.signin(email, password);
            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    };

    async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user.user_id;
            console.log(`Fetching user with ID: ${userId}`);
            
            const user = await this.userService.getMe(userId);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    };

    async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: UpdateUserDto = req.body;
            const userId = (req as any).user.user_id;
            const requesterRole = (req as any).user.role;
            const success = await this.userService.updateMe(userId, dto, requesterRole);
            res.status(200).json({ success });
        } catch (error) {
            next(error);
        }
    };

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user.user_id;
            const dto: ChangePasswordDto = req.body;
            const success = await this.userService.changePassword(userId, dto);

            if(!success) res.status(400).json({ success: success, message: "Password Change Failed"});

            res.status(200).json({ success: success, message: "Changed password Successfully"});
        } catch (error){
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.query.id);
            const requesterId = (req as any).user.user_id;
            const requesterRole = (req as any).user.role;
            const success = await this.userService.deleteUser(userId, requesterId, requesterRole);
            res.status(200).json({ success });
        } catch (error) {
            next(error);
        }
    };
}

