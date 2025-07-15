import express from 'express';
import { PostImageController } from '../controllers/post.image.controller.js';
import { PostImageService } from '../services/post.image.service.js';
import { PostRepository } from '../repositories/post.repository.js';
import db from '../../db/db.js';
import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { postAccessGuard } from '../middlewares/postAccessGuard.middleware.js';

const router = express.Router({ mergeParams: true });

const postRepository = new PostRepository(db);
const postImageService = new PostImageService(postRepository);
const postImageController = new PostImageController(postImageService);

router.post(
    '/',
    authenticationMiddleware,
    asyncHandler(postImageController.addImage.bind(postImageController))
);

router.get(
    '/',
    postAccessGuard,
    asyncHandler(postImageController.getImages.bind(postImageController))
);

router.delete(
    '/:imageId',
    authenticationMiddleware,
    asyncHandler(postImageController.deleteImage.bind(postImageController))
);

export default router;
