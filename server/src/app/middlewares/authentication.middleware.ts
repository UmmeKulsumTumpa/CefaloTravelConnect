import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/app.config.js';

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Forbidden' });
    }
};