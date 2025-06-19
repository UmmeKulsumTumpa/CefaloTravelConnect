import type { Request, Response, NextFunction } from 'express';
import type { PostService } from '../services/Post.service.js';
import sendResponse from '../utils/sendResponse.js';
import { log } from 'console';

export class PostController {
	constructor(private postService: PostService) { }

	async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const dto = req.body;
			const user = (req as any).user;
			dto.user_id = user.user_id;
			const postId = await this.postService.createPost(dto);
			sendResponse(res, {
				statusCode: 201,
				success: true,
				message: 'Post created',
				data: { postId },
			});
		} catch (error) {
			next(error);
		}
	}

	async getAllPublicPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const filters = req.query;
			const posts = await this.postService.getAllPublicPosts(filters);
			sendResponse(res, {
				statusCode: 200,
				success: true,
				message: 'Public posts fetched',
				data: posts,
			});
		} catch (error) {
			next(error);
		}
	}

	async getPostsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.params.userId;
			const posts = await this.postService.getPostsByUser(userId);
			sendResponse(res, {
				statusCode: 200,
				success: true,
				message: 'User posts fetched',
				data: posts,
			});
		} catch (error) {
			next(error);
		}
	}

	async getPost(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const postId = req.params.postId;
			
			const post = await this.postService.getPost(postId);
			sendResponse(res, {
				statusCode: 200,
				success: true,
				message: 'Post fetched',
				data: post,
			});
		} catch (error) {
			next(error);
		}
	}

	async updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const postId = req.params.postId;
			const dto = req.body;
			const user = (req as any).user;
			const success = await this.postService.updatePost(postId, dto, user.user_id);
			sendResponse(res, {
				statusCode: 200,
				success: true,
				message: 'Post updated',
				data: { success },
			});
		} catch (error) {
			next(error);
		}
	}

	async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const postId = req.params.postId;
			const user = (req as any).user;
			const success = await this.postService.deletePost(postId, user.user_id);
			sendResponse(res, {
				statusCode: 200,
				success: true,
				message: 'Post deleted',
				data: { success },
			});
		} catch (error) {
			next(error);
		}
	}
}
