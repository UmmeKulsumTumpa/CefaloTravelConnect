import express from 'express';
import { PostServiceController } from '../controllers/PostService.controller.js';
import { PostServiceService } from '../services/PostService.service.js';
import { PostRepository } from '../repositories/Post.repository.js';
import db from '../../db/db.js';
import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { postAccessGuard } from '../middlewares/postAccessGuard.middleware.js';

const router = express.Router({ mergeParams: true });

const postRepository = new PostRepository(db);
const postServiceService = new PostServiceService(postRepository);
const postServiceController = new PostServiceController(postServiceService);

router.post(
    '/',
    authenticationMiddleware,
    asyncHandler(postServiceController.addService.bind(postServiceController))
);

router.get(
    '/',
    postAccessGuard,
    asyncHandler(postServiceController.getServices.bind(postServiceController))
);

router.delete(
    '/:postServiceId',
    authenticationMiddleware,
    asyncHandler(postServiceController.deleteService.bind(postServiceController))
);

export default router;
