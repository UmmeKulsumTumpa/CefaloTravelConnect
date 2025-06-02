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

export interface IUserRepository {
    create(user: {
        username: string;
        email: string;
        password_hash: string;
    }): Promise<number>;
    // findByEmail(email: string): Promise<User | undefined>;
    // findById(id: number): Promise<User | undefined>;
    findUsers(filters: { 
        id?: number; 
        username?: string; 
        email?: string; 
        search?: string 
    }): Promise<User[]>;
    // update(id: number, user: Partial<User>): Promise<boolean>;
    // updateLastLogin(id: number, lastLogin: Date): Promise<boolean>;
    // delete(id: number): Promise<boolean>;
}

// user and filter er separate 2 ta type create korte hbe------