import { Request, Response } from 'express';
import { PostImageService } from '../services/PostImage.service.js';
import sendResponse from '../utils/sendResponse.js';

export class PostImageController {
    constructor(private postImageService: PostImageService) {}

    async addImage(req: Request, res: Response) {
        const userId = (req as any).user?.user_id;
        const post_id = req.params.postId;
        const data = { ...req.body, post_id };
        try {
            const result = await this.postImageService.addImageToPost(data, userId);
            return sendResponse(res, {
                statusCode: 201,
                success: true,
                message: 'Image added to post',
                data: result
            });
        } catch (err: any) {
            if (err.message === 'Post not found') {
                return sendResponse(res, { statusCode: 404, success: false, message: err.message, data: null });
            }
            if (err.message === 'Forbidden') {
                return sendResponse(res, { statusCode: 403, success: false, message: err.message, data: null });
            }
            return sendResponse(res, { statusCode: 500, success: false, message: 'Internal server error', data: null });
        }
    }

    async getImages(req: Request, res: Response) {
        const post_id = req.params.postId;
        const result = await this.postImageService.getImagesForPost(post_id);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Images fetched for post',
            data: result
        });
    }

    async deleteImage(req: Request, res: Response) {
        const userId = (req as any).user?.user_id;
        const post_id = req.params.postId;
        const image_id = req.params.imageId;
        try {
            await this.postImageService.removeImageFromPost(image_id, post_id, userId);
            return sendResponse(res, {
                statusCode: 204,
                success: true,
                message: 'Image removed from post',
                data: null
            });
        } catch (err: any) {
            if (err.message === 'Post not found') {
                return sendResponse(res, { statusCode: 404, success: false, message: err.message, data: null });
            }
            if (err.message === 'Forbidden') {
                return sendResponse(res, { statusCode: 403, success: false, message: err.message, data: null });
            }
            return sendResponse(res, { statusCode: 500, success: false, message: 'Internal server error', data: null });
        }
    }
}
