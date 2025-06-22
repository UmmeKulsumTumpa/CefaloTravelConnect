import { Request, Response } from 'express';
import { PostService } from '../services/Post.service.js';
import { validateCreatePost, validateUpdatePost } from '../validations/Post.validation.js';
import sendResponse from '../utils/sendResponse.js';
import { POST_VISIBILITY } from '../constants/Post.constant.js';

export class PostController {
    constructor(private postService: PostService) {}

    async createPost(req: Request, res: Response) {
        const errors = validateCreatePost(req.body);
        if (errors.length) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: 'Validation error',
                data: errors
            });
        }
        
        const userId = (req as any).user?.user_id;
        if (!userId) {
            return sendResponse(res, {
                statusCode: 401,
                success: false,
                message: 'Unauthorized',
                data: null
            });
        }
        const post = await this.postService.createPost({ ...req.body, user_id: userId });
        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Post created successfully',
            data: post
        });
    }

    async updatePost(req: Request, res: Response) {
        const errors = validateUpdatePost(req.body);
        if (errors.length) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: 'Validation error',
                data: errors
            });
        }
        const userId = (req as any).user?.user_id;
        const post = await this.postService.getPostById(req.params.id);
        if (!post) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: 'Post not found',
                data: null
            });
        }
        if (post.user_id !== userId) {
            return sendResponse(res, {
                statusCode: 403,
                success: false,
                message: 'Forbidden',
                data: null
            });
        }
        const updated = await this.postService.updatePost(req.params.id, req.body);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Post updated successfully',
            data: updated
        });
    }

    async getPostById(req: Request, res: Response) {
        const post = await this.postService.getPostById(req.params.id);
        if (!post) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: 'Post not found',
                data: null
            });
        }
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Post fetched successfully',
            data: post
        });
    }

    async getAllPosts(req: Request, res: Response) {
        const { user_id, category, title, visibility } = req.query;
        const filters: any = {};
        if (user_id) filters.user_id = user_id;
        if (category) filters.category = category;
        if (title) filters.title = title;
        if (visibility && POST_VISIBILITY.includes(visibility as any)) filters.visibility = visibility;
        
        // Auth logic for user_id filter
        let includePrivate = false;
        const reqUserId = (req as any).user?.user_id;
        if (user_id && reqUserId && reqUserId === user_id) {
            includePrivate = true;
        }
        if (reqUserId) filters.authUserId = reqUserId;

        // console.log(includePrivate);
        
        const posts = await this.postService.getAllPosts({ ...filters, includePrivate });
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Posts fetched successfully',
            data: posts
        });
    }

    async deletePost(req: Request, res: Response) {
        const userId = (req as any).user?.user_id;
        const post = await this.postService.getPostById(req.params.id);
        if (!post) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: 'Post not found',
                data: null
            });
        }
        if (post.user_id !== userId) {
            return sendResponse(res, {
                statusCode: 403,
                success: false,
                message: 'Forbidden',
                data: null
            });
        }
        await this.postService.deletePost(req.params.id);
        return sendResponse(res, {
            statusCode: 204,
            success: true,
            message: 'Post deleted successfully',
            data: null
        });
    }

    async likePost(req: Request, res: Response) {
        const postId = req.params.id;
        const post = await this.postService.getPostById(postId);
        if (!post) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: 'Post not found',
                data: null
            });
        }
        // Q: should we check if the user has already liked the post?
        // will handle duplicated liked by the same user, later
        // now any authenticated user can like a post multiple times
        const liked = await this.postService.likePost(postId);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Post liked successfully',
            data: liked
        });
    }
}
