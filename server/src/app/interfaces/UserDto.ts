import { Role } from "../constants/User.constant.js";

export interface SignupDto {
    email: string;
    password: string;
    role?: Role;
}

export interface SigninDto {
    email: string;
    password: string;
}

export interface UpdateUserDto {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    age?: number;
    role?: Role;
    profile_picture?: string;
    bio?: string;
}
