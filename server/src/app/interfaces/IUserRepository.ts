import type { Role } from '../constants/User.constant.js';

export interface User {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
    first_name?: string;
    last_name?: string;
    age?: number;
    role: Role;
    profile_picture?: string;
    bio?: string;
    last_login?: Date;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export type UserFilter = {
    id?: number;
    username?: string;
    email?: string;
    search?: string;
}

export interface IUserRepository {
    create(user: {
        email: string;
        password_hash: string;
    }): Promise<number>;
    // findByEmail(email: string): Promise<User | undefined>;
    findById(id: number): Promise<User | undefined>;
    findUsers(filters: UserFilter): Promise<User[]>;
    update(id: number, user: Partial<User>): Promise<boolean>;
    // updateLastLogin(id: number, lastLogin: Date): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    saveRefreshToken(userId: number, token: string, expiresAt: Date): Promise<void>;
    deleteRefreshToken(token: string): Promise<void>;
    findRefreshToken(token: string): Promise<{ id: number, user_id: number, token: string, expires_at: Date } | undefined>;
    deleteAllRefreshTokensForUser(userId: number): Promise<void>;
}
