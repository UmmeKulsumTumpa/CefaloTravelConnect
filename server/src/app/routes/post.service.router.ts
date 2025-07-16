import express from 'express';
import { PostServiceController } from '../controllers/index.js';
import { PostServiceService } from '../services/index.js';
import { PostRepository } from '../repositories/index.js';
import db from '../../db/db.js';
import { authenticationMiddleware, postAccessGuard  } from '../middlewares/index.js';
import { asyncHandler } from '../utils/index.js';

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
