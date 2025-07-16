import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/app.config.js';

export const optionalAuthentication = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        // No token, proceed unauthenticated
        return next();
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET as string);
        (req as any).user = decoded;
    } catch (error) {
    }
    next();
};
