import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import envConfig from '../config/env.config.js';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    // console.log(`Token: ${token}`);
    

    try {
        const decoded = jwt.verify(token, envConfig.JWT_SECRET as string);
        // console.log(`decoded: ${decoded}`);
        
        (req as any).user = decoded; // Attach user to req (consider typing this properly)
        next();
    } catch (error) {
        res.status(403).json({ message: 'Forbidden' });
    }
};