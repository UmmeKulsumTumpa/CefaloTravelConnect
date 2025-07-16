import type { IUserRepository, User, UserFilter } from "../interfaces/index.js";
import type { SignupDto, UpdateUserDto, ChangePasswordDto } from "../dtos/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { ROLES } from "../constants/index.js";
import config from "../config/app.config.js";

export class UserService{

    constructor(private userRepository: IUserRepository){};

    async signup(dto: SignupDto): Promise<{ accessToken: string, refreshToken: string }> {
        const { email, password } = dto;

        const existingUser = await this.userRepository.findUsers({ email });
        if (existingUser.length > 0) {
            throw new Error("User with this email already exists");
        };

        const passwordHash = await bcrypt.hash(password, 10);

        const userId = await this.userRepository.create({
            email,
            password_hash: passwordHash,
        });

        
        const user = await this.userRepository.findById(userId);
        if (!user || !user.role) {
            throw new Error("User role is not set. Please contact admin.");
        }

        const accessToken = jwt.sign(
            { user_id: String(userId), email, role: user.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRATION } as jwt.SignOptions,
        );

        // Generate refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const refreshExpires = new Date(Date.now() + config.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
        await this.userRepository.saveRefreshToken(userId, refreshToken, refreshExpires);
        return { accessToken, refreshToken };
    }

    async signin(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
        const users = await this.userRepository.findUsers({ email });
        if (users.length === 0) {
            throw new Error("User not found with this email");
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error("User password for this email is incorrect");
        }

        if (!user.role) {
            throw new Error("User role is not set. Please contact admin.");
        }

        const accessToken = jwt.sign(
            { user_id: String(user.user_id), email: user.email, role: user.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRATION } as jwt.SignOptions,
        );

        // Generate refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const refreshExpires = new Date(Date.now() + config.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
        await this.userRepository.saveRefreshToken(user.user_id, refreshToken, refreshExpires);
        return { accessToken, refreshToken };
    }

    // async getMe(userId: number): Promise<User> {
    //     const user = await this.userRepository.findById(userId);
    //     if (!user) {
    //         throw new Error("User not found");
    //     }
    //     if (!user.is_active) {
    //         throw new Error("User is inactive");
    //     }
    //     return user;
    // }

    async updateMe(userId: number, dto: UpdateUserDto, requester: { user_id: number, role: string }): Promise<boolean> {

        console.log(userId, requester.user_id);
        
        
        if (!userId || typeof userId !== 'number') {
            throw new Error("Invalid user id");
        }
        if (!requester || !requester.role) {
            throw new Error("Unauthorized: Invalid requester info");
        }

        if (requester.role !== ROLES.ADMIN && Number(userId) !== Number(requester.user_id)) {
            throw new Error("Unauthorized: You can only update your own profile");
        }

        if (dto.role && requester.role !== ROLES.ADMIN) {
            throw new Error("Unauthorized: Only admin can change user roles");
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.is_active) {
            throw new Error("User is inactive");
        }

        return this.userRepository.update(userId, dto);
    }

    async changePassword(userId: number, dto: ChangePasswordDto): Promise<boolean> {
        const user = await this.userRepository.findById(userId);

        if(!user) return false;

        const hasMatched = await bcrypt.compare(dto.oldPassword, user.password_hash);

        if(!hasMatched) return false;

        const newHasPassword = await bcrypt.hash(dto.newPassword, 10);

        const updateResult =  this.userRepository.update(userId, {password_hash: newHasPassword});

        return updateResult;
    }

    async deleteUser(userId: number, requesterId: number, requesterRole: string): Promise<boolean> {
        if(requesterRole !== 'admin') {
            throw new Error("Unauthorized: Only admin can delete users");
        }

        if(userId === requesterId) {
            throw new Error("Unauthorized: You cannot delete your own account");
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        return this.userRepository.delete(userId);
    }

    async signout(refreshToken: string): Promise<void> {
        await this.userRepository.deleteRefreshToken(refreshToken);
    }

    async refresh(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
        const tokenRecord = await this.userRepository.findRefreshToken(refreshToken);
        if (!tokenRecord || tokenRecord.expires_at < new Date()) {
            throw new Error("Invalid or expired refresh token");
        }
        const user = await this.userRepository.findById(tokenRecord.user_id);
        if (!user) throw new Error("User not found");
        
        const accessToken = jwt.sign(
            { user_id: String(user.user_id), email: user.email, role: user.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRATION } as jwt.SignOptions,
        );
        
        await this.userRepository.deleteRefreshToken(refreshToken);
        
        const newRefreshToken = crypto.randomBytes(64).toString('hex');
        const refreshExpires = new Date(Date.now() + config.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
        await this.userRepository.saveRefreshToken(user.user_id, newRefreshToken, refreshExpires);
        return { accessToken, refreshToken: newRefreshToken };
    }

    async changeUserRole(userId: number, role: string, requesterRole: string): Promise<boolean> {
        const validRoles = Object.values(ROLES);
        if (!validRoles.includes(role as any)) {
            throw new Error('Invalid role');
        }
        if (requesterRole !== ROLES.ADMIN) {
            throw new Error('Unauthorized: Only admin can change user roles');
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return this.userRepository.update(userId, { role: role as typeof ROLES[keyof typeof ROLES] });
    }

    async getUsers(filters: UserFilter, requester: any): Promise<Partial<User>[]> {
        if (!requester) throw new Error('Unauthorized');
        if (!requester.role) throw new Error('Unauthorized: User role is missing in token.');
        const isAdmin = requester.role === ROLES.ADMIN;

        // console.log(`UserService.getUsers called with filters: ${JSON.stringify(filters)} and requester: ${JSON.stringify(requester)}`);
        
        
        if (!isAdmin) {
            if (filters.id && Number(filters.id) !== Number(requester.user_id)) {
                throw new Error('Forbidden: Cannot view other users');
            }
            if (!filters.id) {
                filters.id = requester.user_id;
            }
        }
        const users = await this.userRepository.findUsers(filters);
        
        return users.map(user => {
            if (isAdmin) return user;
            const { password_hash, email, ...publicProfile } = user;
            return publicProfile;
        });
    }
}
