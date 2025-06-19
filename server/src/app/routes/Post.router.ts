import express from 'express';
import db from '../../db.js';
import { PostRepository, PostServiceRepository, PostTransportRepository, ImageRepository } from '../repositories/Post.repository.js';
import { ServiceRepository } from '../repositories/Service.repository.js';
import { TransportRepository } from '../repositories/Transport.repository.js';
import { PostService } from '../services/Post.service.js';
import { PostController } from '../controllers/Post.controller.js';
import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
// import { requestValidationMiddleware } from '../middlewares/requestValidation.middleware.js';
// import { postSchema } from '../validations/Post.validation.js';

const router = express.Router();

const postRepository = new PostRepository(db);
const postServiceRepository = new PostServiceRepository(db);
const postTransportRepository = new PostTransportRepository(db);
const imageRepository = new ImageRepository(db);
const serviceRepository = new ServiceRepository(db);
const transportRepository = new TransportRepository(db);
const postService = new PostService(
	postRepository,
	postServiceRepository,
	postTransportRepository,
	imageRepository,
	serviceRepository,
	transportRepository
);
const postController = new PostController(postService);

router.post('/', authenticationMiddleware, asyncHandler(postController.createPost.bind(postController)));
router.get('/me', authenticationMiddleware, asyncHandler(postController.getPostsByUser.bind(postController)));
router.get('/:id', authenticationMiddleware, asyncHandler(postController.getPost.bind(postController)));
router.patch('/:id', authenticationMiddleware, asyncHandler(postController.updatePost.bind(postController)));
router.delete('/:id', authenticationMiddleware, asyncHandler(postController.deletePost.bind(postController)));

export const PostRouter = router;
