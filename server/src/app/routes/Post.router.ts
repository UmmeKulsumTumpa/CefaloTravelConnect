import express from 'express';
import { PostController } from '../controllers/Post.controller.js';
import { PostService } from '../services/Post.service.js';
import { PostRepository } from '../repositories/Post.repository.js';
import db from '../../db/db.js';
import { optionalAuthentication } from '../middlewares/optionalAuthentication.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';

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

export default router;
