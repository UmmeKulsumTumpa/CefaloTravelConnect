import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/index.js";
import { SignupDto, UpdateUserDto, ChangePasswordDto } from "../dtos/index.js";
import {sendResponse} from '../utils/index.js';

export class UserController {
    constructor (private userService: UserService){};

    async signup(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const dto: SignupDto = req.body;
            const { accessToken, refreshToken } = await this.userService.signup(dto);
            sendResponse(res, {
                statusCode: 201,
                success: true,
                message: 'User created successfully',
                data: { accessToken, refreshToken }
            });
        } catch (error){
            next(error);
        }
    };

    async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this.userService.signin(email, password);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Login successful',
                data: { accessToken, refreshToken }
            });
        } catch (error) {
            next(error);
        }
    };

    async signout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'Refresh token required',
                    data: null as any
                });
                return;
            }
            await this.userService.signout(refreshToken);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Signed out successfully',
                data: null as any
            });
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'Refresh token required',
                    data: null as any
                });
                return;
            }
            const { accessToken, refreshToken: newRefreshToken } = await this.userService.refresh(refreshToken);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Token refreshed',
                data: { accessToken, refreshToken: newRefreshToken }
            });
        } catch (error) {
            next(error);
        }
    }

    // async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         const userId = (req as any).user.user_id;
    //         const user = await this.userService.getMe(userId);

    //         sendResponse(res, {
    //             statusCode: 200,
    //             success: true,
    //             message: 'User profile fetched',
    //             data: user
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // };

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: UpdateUserDto = req.body;
            const userId = Number(req.params.id);
            const requester = (req as any).user;
            const success = await this.userService.updateMe(userId, dto, requester);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'User updated',
                data: { success }
            });
        } catch (error) {
            next(error);
        }
    };

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.id);
            const dto: ChangePasswordDto = req.body;
            const success = await this.userService.changePassword(userId, dto);
            if(!success) {
                sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'Password Change Failed',
                    data: { success }
                });
                return;
            }
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Changed password successfully',
                data: { success }
            });
        } catch (error){
            next(error);
        }
    }

    async changeUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.id);
            const { role } = req.body;
            const requesterRole = (req as any).user.role;
            const success = await this.userService.changeUserRole(userId, role, requesterRole);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'User role updated',
                data: { success }
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.id);
            const requesterId = (req as any).user.user_id;
            const requesterRole = (req as any).user.role;
            const success = await this.userService.deleteUser(userId, requesterId, requesterRole);

            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'User deleted',
                data: { success }
            });
        } catch (error) {
            next(error);
        }
    };

    async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters: any = {
                id: req.query.id ? Number(req.query.id) : undefined,
                username: req.query.username as string | undefined,
                email: req.query.email as string | undefined,
                search: req.query.search as string | undefined,
            };
            const requester = (req as any).user;
            if (!requester || !requester.role) {
                sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: 'Unauthorized: User role is missing in token.',
                    data: null as any
                });
                return;
            }
            const users = await this.userService.getUsers(filters, requester);
            if (!users || users.length === 0) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'User not found',
                    data: null as any
                });
                return;
            }
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Users fetched',
                data: users
            });
        } catch (error) {
            next(error);
        }
    }
}
