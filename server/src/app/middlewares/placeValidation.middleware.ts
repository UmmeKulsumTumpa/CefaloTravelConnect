import { Request, Response, NextFunction } from 'express';
import { validatePlaceCreate, validatePlaceUpdate, validatePlaceQuery } from '../validations/Place.validation.js';

export function placeCreateValidator(req: Request, res: Response, next: NextFunction): void {
    const result = validatePlaceCreate(req.body);
    if (!result.valid) {
        res.status(400).json({ success: false, message: 'Validation error', errors: result.errors });
        return;
    }
    next();
}

export function placeUpdateValidator(req: Request, res: Response, next: NextFunction): void {
    const result = validatePlaceUpdate(req.body);
    if (!result.valid) {
        res.status(400).json({ success: false, message: 'Validation error', errors: result.errors });
        return;
    }
    next();
}

export function placeQueryValidator(req: Request, res: Response, next: NextFunction): void {
    const result = validatePlaceQuery(req.query);
    if (!result.valid) {
        res.status(400).json({ success: false, message: 'Validation error', errors: result.errors });
        return;
    }
    next();
}
