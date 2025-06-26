// tests/utils/errorHandler.test.ts

/**
 * What to test:
 * 
 */

import { AppError, errorHandler } from '../../src/app/utils/errorHandler';
import { Request, Response, NextFunction } from 'express';

function mockRes() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    return res as Response;
}

describe('AppError class', () => {
    it('should set message, statusCode and inherit stack trace', () => {
        const err = new AppError('Not found', 404);

        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(AppError);
        expect(err.message).toBe('Not found');
        expect(err.statusCode).toBe(404);
        expect(typeof err.stack).toBe('string');
    });

    it('should default statusCode to 500 if not provided', () => {
        const err = new AppError('Oops');
        expect(err.statusCode).toBe(500);
    });
});

describe('errorHandler middleware', () => {
    let req: Request;
    let res: Response;
    const next = jest.fn();

    beforeEach(() => {
        req = {} as Request;
        res = mockRes();
        jest.clearAllMocks();
    });

    it('responds with provided statusCode and errors', () => {
        const err = { message: 'Bad', statusCode: 400, errors: ['a', 'b'] };

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Bad',
            errors: ['a', 'b'],
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('defaults to 500 with no errors array', () => {
        const err = { message: 'Failure', statusCode: 422 };

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Failure',
            errors: undefined,
        });
    });

    it('defaults statusCode to 500 and message when none provided', () => {
        const err = {} as any;

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Internal Server Error',
            errors: undefined,
        });
    });
});
