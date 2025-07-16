import express from 'express';
import { PostController } from '../controllers/index.js';
import { PostService } from '../services/index.js';
import { PostRepository } from '../repositories/index.js';
import db from '../../db/db.js';
import { asyncHandler } from '../utils/index.js';
import { authenticationMiddleware, optionalAuthentication } from '../middlewares/index.js';
import {PostServiceRouter, PostImageRouter} from './sub-index.js';

const router = express.Router();

const postRepository = new PostRepository(db);
const postService = new PostService(postRepository);
const postController = new PostController(postService);

router.post(
    '/',
    authenticationMiddleware,
    asyncHandler(postController.createPost.bind(postController))
);

router.get(
    '/',
    optionalAuthentication,
    asyncHandler(postController.getAllPosts.bind(postController))
);

// Q: can we use the postAccessGuard middleware here?
// will consider it later
router.get(
    '/:id',
    optionalAuthentication,
    asyncHandler(postController.getPostById.bind(postController))
);

router.patch(
    '/:id',
    authenticationMiddleware,
    asyncHandler(postController.updatePost.bind(postController))
);

router.delete(
    '/:id',
    authenticationMiddleware,
    asyncHandler(postController.deletePost.bind(postController))
);

router.post(
    '/:id/like',
    authenticationMiddleware,
    asyncHandler(postController.likePost.bind(postController))
);

router.use(
    '/:postId/services',
    optionalAuthentication, 
    PostServiceRouter
);

router.use(
    '/:postId/images', 
    optionalAuthentication,
    PostImageRouter
);

export default router;
