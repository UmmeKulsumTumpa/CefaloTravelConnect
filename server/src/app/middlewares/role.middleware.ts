import { Request, Response, NextFunction, RequestHandler } from "express";

export const roleMiddleware = (roles: string[] = []): RequestHandler => {
	return (req, res, next) => {
		const user = (req as any).user;
		if (!user || (roles.length && !roles.includes(user.role))) {
			res.status(403).json({ success: false, message: "Forbidden: Insufficient role" });
			return;
		}
		next();
	};
};
