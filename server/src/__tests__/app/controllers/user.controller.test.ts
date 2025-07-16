import { UserController } from '../../../app/controllers/user.controller';
import type { SignupDto } from '../../../app/dtos/userDto';
import { UserService } from '../../../app/services/user.service';
import httpMocks from 'node-mocks-http';

describe('UserController', () => {
    let userService: jest.Mocked<UserService>;
    let controller: UserController;
    let req: any, res: any, next: any;

    beforeEach(() => {
        userService = {
            signup: jest.fn(),
            signin: jest.fn(),
            signout: jest.fn(),
        } as any;
        controller = new UserController(userService);
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('should signup user successfully', async () => {
        const signupDto: SignupDto = {
            email: 'test@example.com',
            password: 'pass'
        };
        const authToken = {
            accessToken: 'token',
            refreshToken: 'refresh'
        };
        userService.signup.mockResolvedValue(authToken);
        req.body = signupDto;
        await controller.signup(req, res, next);
        expect(res._getJSONData().success).toBe(true);
        expect(res.statusCode).toBe(201);
    });

    it('should handle signup error', async () => {
        userService.signup.mockRejectedValue(new Error('fail'));
        await controller.signup(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should signin user successfully', async () => {
        const authToken = {
            accessToken: 'token',
            refreshToken: 'refresh'
        };
        req.body = { email: 'test@example.com', password: 'pass' };
        userService.signin.mockResolvedValue(authToken);
        await controller.signin(req, res, next);
        expect(res._getJSONData().success).toBe(true);
        expect(res.statusCode).toBe(200);
    });

    it('should handle signin error', async () => {
        userService.signin.mockRejectedValue(new Error('fail'));
        await controller.signin(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should signout user successfully', async () => {
        userService.signout.mockResolvedValue(undefined);
        req.body = { refreshToken: 'refresh' };
        await controller.signout(req, res, next);
        expect(res._getJSONData().success).toBe(true);
        expect(res.statusCode).toBe(200);
    });

    it('should handle signout error', async () => {
        userService.signout.mockRejectedValue(new Error('fail'));
        req.body = { refreshToken: 'refresh' };
        await controller.signout(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should handle missing refreshToken in signout', async () => {
        req.body = {};
        await controller.signout(req, res, next);
        expect(res._getJSONData().success).toBe(false);
        expect(res.statusCode).toBe(400);
    });
});
