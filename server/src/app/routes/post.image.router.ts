import express from 'express';
import { PostImageController } from '../controllers/index.js';
import { PostImageService } from '../services/index.js';
import { PostRepository } from '../repositories/index.js';
import db from '../../db/db.js';
import { authenticationMiddleware, postAccessGuard  } from '../middlewares/index.js';
import { asyncHandler } from '../utils/index.js';

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
