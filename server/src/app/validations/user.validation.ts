import { z } from 'zod';

export const signupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	role: z.string().optional(),
});

export const signinSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const updateUserSchema = z.object({
	username: z.string().optional(),
	email: z.string().email().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	age: z.number().int().optional(),
	role: z.string().optional(),
	profile_picture: z.string().optional(),
	bio: z.string().optional(),
});

export const changePasswordSchema = z.object({
	oldPassword: z.string().min(6),
	newPassword: z.string().min(6),
});
