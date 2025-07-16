import type { Request, Response, NextFunction } from 'express';
import { WishlistService } from '../services/index.js';
import { WishlistValidation } from '../validations/index.js';
import {sendResponse} from '../utils/index.js';

export class WishlistController {
    constructor(private wishlistService: WishlistService) {}

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // console.log(req.body);
            
            const errors = WishlistValidation.validateCreate(req.body);
            if (errors.length) {
                sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: errors.join(', '),
                    data: null as any
                });
                return;
            }
            const user_id = (req as any).user?.user_id;
            if (!user_id) {
                sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: 'Unauthorized',
                    data: null as any
                });
                return;
            }
            const wishlist = await this.wishlistService.createWishlist(user_id, req.body);
            sendResponse(res, {
                statusCode: 201,
                success: true,
                message: 'Wishlist created',
                data: wishlist
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { public: isPublic, place_id, user_id, wishlist_id } = req.query;
            const filters: any = {};
            if (isPublic !== undefined) filters.is_public = isPublic === 'true';
            if (place_id) filters.place_id = place_id;
            if (wishlist_id) filters.wishlist_id = wishlist_id;

            // Auth logic for user_id filter
            let includePrivate = false;
            if (user_id) {
                filters.user_id = user_id;
                const reqUserId = (req as any).user?.user_id;
                if (reqUserId && reqUserId === user_id) {
                    includePrivate = true;
                }
            }
            const result = await this.wishlistService.getAll(filters, includePrivate);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Wishlists fetched successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = WishlistValidation.validateUpdate(req.body);
            if (errors.length) {
                sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: errors.join(', '),
                    data: null as any
                });
                return;
            }
            const wishlist = await this.wishlistService.updateWishlist(req.params.id, req.body);
            if (!wishlist) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Wishlist not found',
                    data: null as any
                });
                return;
            }
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Wishlist updated',
                data: wishlist
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deleted = await this.wishlistService.deleteWishlist(req.params.id);
            if (!deleted) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Wishlist not found',
                    data: null as any
                });
                return;
            }
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Wishlist deleted',
                data: null as any
            });
        } catch (error) {
            next(error);
        }
    }
}
