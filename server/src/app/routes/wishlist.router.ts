import express from 'express';
import { WishlistController } from '../controllers/index.js';
import { WishlistService } from '../services/index.js';
import { WishlistRepository } from '../repositories/index.js';
import db from '../../db/db.js';
import { authenticationMiddleware } from '../middlewares/index.js';
import { optionalAuthentication } from '../middlewares/index.js';
import { asyncHandler } from '../utils/index.js';

const router = express.Router();

const wishlistRepository = new WishlistRepository(db);
const wishlistService = new WishlistService(wishlistRepository);
const wishlistController = new WishlistController(wishlistService);

router.post(
    '/',
    authenticationMiddleware,
    asyncHandler(wishlistController.create.bind(wishlistController))
);

router.get(
    '/',
    optionalAuthentication,
    asyncHandler(wishlistController.getAll.bind(wishlistController))
);

router.patch(
    '/:id',
    authenticationMiddleware,
    asyncHandler(wishlistController.update.bind(wishlistController))
);

router.delete(
    '/:id',
    authenticationMiddleware,
    asyncHandler(wishlistController.delete.bind(wishlistController))
);

export default router;
