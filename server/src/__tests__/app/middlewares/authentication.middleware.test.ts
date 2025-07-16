/**
 * What to test:
 * -  When there's no Authorization header → should respond with 401 and not call next()
 * -  When the token is invalid → jwt.verify throws, so respond with 403 and not call next()
 * -  When the token is valid → jwt.verify returns a payload, so attach req.user and call next()
 */

import jwt from 'jsonwebtoken';
import { authenticationMiddleware } from '../../../app/middlewares/authentication.middleware';

function mockReq(authHeader?: string) {
    return { headers: { authorization: authHeader } } as any;
}

function mockRes() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    return res as any;
}

describe('authenticationMiddleware', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('responds 401 Unauthorized when token is missing', () => {
        const req = mockReq(); // no header
        const res = mockRes();
        const next = jest.fn();

        authenticationMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });

    it('responds 403 Forbidden when token is invalid', () => {
        const req = mockReq('Bearer invalid.token');
        const res = mockRes();
        const next = jest.fn();
        jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('invalid token'); });

        authenticationMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
        expect(next).not.toHaveBeenCalled();
    });

    it('attaches user and calls next() on valid token', () => {
        const decoded = { id: '123', role: 'user' };
        const req = mockReq('Bearer valid.token');
        const res = mockRes();
        const next = jest.fn();
        jest.spyOn(jwt, 'verify').mockReturnValue(decoded as any);

        authenticationMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('valid.token', expect.any(String));
        expect((req as any).user).toBe(decoded);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
