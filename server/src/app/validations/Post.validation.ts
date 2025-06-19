import { z } from 'zod';

const uuidString = z.string().uuid();

export const postSchema = z.object({
	title: z.string().min(1),
	total_cost: z.number().optional(),
	total_duration: z.number().optional(),
	effort_level: z.enum(['Low', 'Medium', 'High']).optional(),
	destination_id: uuidString.optional(),
	categories: z.array(z.string()).optional(),
	visibility: z.enum(['Public', 'Private', 'Friends']).optional(),

	images: z.array(z.object({
		url: z.string().url(),
		caption: z.string().optional(),
	})).optional(),

	services: z.array(z.object({
		service_id: uuidString,
		cost: z.number().optional(),
		rating: z.number().optional(),
		visit_date: z.string().optional(),
		notes: z.string().optional(),
	})).optional(),
	
	transports: z.array(z.object({
		transport_id: uuidString,
		cost: z.number().optional(),
		rating: z.number().optional(),
		departure_time: z.string().optional(),
		arrival_time: z.string().optional(),
		notes: z.string().optional(),
	})).optional(),
});

// New: Partial schema for updates
export const postUpdateSchema = postSchema.partial();
