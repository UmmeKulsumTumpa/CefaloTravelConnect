import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";

export const requestValidationMiddleware = (schema: ZodSchema<any>, property: 'body' | 'query' | 'params' = 'body'): RequestHandler => {
	return (req, res, next) => {
		const result = schema.safeParse(req[property]);
		if (!result.success) {
			res.status(400).json({
				success: false,
				message: "Validation error",
				errors: result.error.errors
			});
			return;
		}
		req[property] = result.data;
		next();
	};
};
