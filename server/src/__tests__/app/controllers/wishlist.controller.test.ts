import { WishlistController } from '../../../app/controllers/wishlist.controller';
import { WishlistService } from '../../../app/services/wishlist.service';
import { WishlistValidation } from '../../../app/validations/wishlist.validation';
import httpMocks from 'node-mocks-http';

// Mock the validation module
jest.mock('../../../app/validations/wishlist.validation', () => ({
    WishlistValidation: {
        validateCreate: jest.fn(),
        validateUpdate: jest.fn(),
    }
}));

describe('WishlistController', () => {
    let wishlistService: jest.Mocked<WishlistService>;
    let controller: WishlistController;
    let req: any, res: any, next: jest.Mock;

    beforeEach(() => {
        wishlistService = {
            createWishlist: jest.fn(),
            getAll: jest.fn(),
            updateWishlist: jest.fn(),
            deleteWishlist: jest.fn(),
        } as any;
        controller = new WishlistController(wishlistService);
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();

        // Reset validation mocks
        (WishlistValidation.validateCreate as jest.Mock).mockReturnValue([]);
        (WishlistValidation.validateUpdate as jest.Mock).mockReturnValue([]);
    });

    const mockWishlist = {
        wishlist_id: '1',
        user_id: '1',
        place_id: '1',
        name: 'Test Wishlist',
        region: 'Test Region',
        theme: 'Test Theme',
        is_public: true,
        created_at: '2023-01-01T00:00:00.000Z'
    };

    describe('create', () => {
        it('should create wishlist successfully', async () => {
            wishlistService.createWishlist.mockResolvedValue(mockWishlist);
            (req as any).user = { user_id: 1 };
            req.body = {
                place_id: '1',
                name: 'Test Wishlist',
                is_public: true
            };

            await controller.create(req, res, next);

            expect(WishlistValidation.validateCreate).toHaveBeenCalledWith(req.body);
            expect(wishlistService.createWishlist).toHaveBeenCalledWith(1, req.body);
            expect(res.statusCode).toBe(201);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Wishlist created');
            expect(res._getJSONData().data).toEqual(mockWishlist);
        });

        it('should handle validation errors', async () => {
            (WishlistValidation.validateCreate as jest.Mock).mockReturnValue(['Place ID is required']);
            (req as any).user = { user_id: 1 };
            req.body = {};

            await controller.create(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Place ID is required');
        });

        it('should handle multiple validation errors', async () => {
            (WishlistValidation.validateCreate as jest.Mock).mockReturnValue(['Place ID is required', 'Invalid data']);
            (req as any).user = { user_id: 1 };
            req.body = {};

            await controller.create(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Place ID is required, Invalid data');
        });

        it('should handle unauthorized user', async () => {
            (req as any).user = null;
            req.body = {
                place_id: '1',
                is_public: true
            };

            await controller.create(req, res, next);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Unauthorized');
        });

        it('should handle user without user_id', async () => {
            (req as any).user = {};
            req.body = {
                place_id: '1',
                is_public: true
            };

            await controller.create(req, res, next);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Unauthorized');
        });

        it('should handle service error', async () => {
            wishlistService.createWishlist.mockRejectedValue(new Error('Service error'));
            (req as any).user = { user_id: 1 };
            req.body = {
                place_id: '1',
                is_public: true
            };

            await controller.create(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getAll', () => {
        it('should get all wishlists successfully', async () => {
            wishlistService.getAll.mockResolvedValue([mockWishlist]);
            req.query = { public: 'true', place_id: '1' };

            await controller.getAll(req, res, next);

            expect(wishlistService.getAll).toHaveBeenCalledWith({
                is_public: true,
                place_id: '1'
            }, false);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Wishlists fetched successfully');
            expect(res._getJSONData().data).toEqual([mockWishlist]);
        });

        it('should handle user_id filter with authentication', async () => {
            wishlistService.getAll.mockResolvedValue([mockWishlist]);
            (req as any).user = { user_id: '1' }; // Changed to string to match user_id query parameter
            req.query = { user_id: '1' };

            await controller.getAll(req, res, next);

            expect(wishlistService.getAll).toHaveBeenCalledWith({
                user_id: '1'
            }, true);
            expect(res.statusCode).toBe(200);
        });

        it('should handle user_id filter without authentication', async () => {
            wishlistService.getAll.mockResolvedValue([mockWishlist]);
            (req as any).user = null;
            req.query = { user_id: '1' };

            await controller.getAll(req, res, next);

            expect(wishlistService.getAll).toHaveBeenCalledWith({
                user_id: '1'
            }, false);
            expect(res.statusCode).toBe(200);
        });

        it('should handle different user_id filter', async () => {
            wishlistService.getAll.mockResolvedValue([mockWishlist]);
            (req as any).user = { user_id: 2 };
            req.query = { user_id: '1' };

            await controller.getAll(req, res, next);

            expect(wishlistService.getAll).toHaveBeenCalledWith({
                user_id: '1'
            }, false);
            expect(res.statusCode).toBe(200);
        });

        it('should handle wishlist_id filter', async () => {
            wishlistService.getAll.mockResolvedValue([mockWishlist]);
            req.query = { wishlist_id: '1' };

            await controller.getAll(req, res, next);

            expect(wishlistService.getAll).toHaveBeenCalledWith({
                wishlist_id: '1'
            }, false);
            expect(res.statusCode).toBe(200);
        });

        it('should handle empty query', async () => {
            wishlistService.getAll.mockResolvedValue([mockWishlist]);
            req.query = {};

            await controller.getAll(req, res, next);

            expect(wishlistService.getAll).toHaveBeenCalledWith({}, false);
            expect(res.statusCode).toBe(200);
        });

        it('should handle service error', async () => {
            wishlistService.getAll.mockRejectedValue(new Error('Service error'));
            req.query = {};

            await controller.getAll(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('update', () => {
        it('should update wishlist successfully', async () => {
            const updatedWishlist = { ...mockWishlist, name: 'Updated Wishlist' };
            wishlistService.updateWishlist.mockResolvedValue(updatedWishlist);
            req.params.id = '1';
            req.body = { name: 'Updated Wishlist' };

            await controller.update(req, res, next);

            expect(WishlistValidation.validateUpdate).toHaveBeenCalledWith(req.body);
            expect(wishlistService.updateWishlist).toHaveBeenCalledWith('1', req.body);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Wishlist updated');
            expect(res._getJSONData().data).toEqual(updatedWishlist);
        });

        it('should handle validation errors', async () => {
            (WishlistValidation.validateUpdate as jest.Mock).mockReturnValue(['Invalid data']);
            req.params.id = '1';
            req.body = {};

            await controller.update(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Invalid data');
        });

        it('should handle wishlist not found', async () => {
            wishlistService.updateWishlist.mockResolvedValue(undefined);
            req.params.id = '1';
            req.body = { name: 'Updated Wishlist' };

            await controller.update(req, res, next);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Wishlist not found');
        });

        it('should handle service error', async () => {
            wishlistService.updateWishlist.mockRejectedValue(new Error('Service error'));
            req.params.id = '1';
            req.body = { name: 'Updated Wishlist' };

            await controller.update(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('delete', () => {
        it('should delete wishlist successfully', async () => {
            wishlistService.deleteWishlist.mockResolvedValue(1);
            req.params.id = '1';

            await controller.delete(req, res, next);

            expect(wishlistService.deleteWishlist).toHaveBeenCalledWith('1');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Wishlist deleted');
        });

        it('should handle wishlist not found', async () => {
            wishlistService.deleteWishlist.mockResolvedValue(0);
            req.params.id = '1';

            await controller.delete(req, res, next);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Wishlist not found');
        });

        it('should handle service error', async () => {
            wishlistService.deleteWishlist.mockRejectedValue(new Error('Service error'));
            req.params.id = '1';

            await controller.delete(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
