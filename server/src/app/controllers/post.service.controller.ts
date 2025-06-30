import { Request, Response } from 'express';
import { PostServiceService } from '../services/post.service.service.js';
import sendResponse from '../utils/sendResponse.js';

export class PostServiceController {
    constructor(private postServiceService: PostServiceService) {}

    async addService(req: Request, res: Response) {
        const userId = (req as any).user?.user_id;
        const post_id = req.params.postId;
        const data = { ...req.body, post_id };
        try {
            const result = await this.postServiceService.addServiceToPost(data, userId);
            return sendResponse(res, {
                statusCode: 201,
                success: true,
                message: 'Service added to post',
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

    async getServices(req: Request, res: Response) {
        const post_id = req.params.postId;
        const result = await this.postServiceService.getServicesForPost(post_id);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Services fetched for post',
            data: result
        });
    }

    async deleteService(req: Request, res: Response) {
        const userId = (req as any).user?.user_id;
        const post_id = req.params.postId;
        const post_service_id = req.params.postServiceId;
        try {
            await this.postServiceService.removeServiceFromPost(post_service_id, post_id, userId);
            return sendResponse(res, {
                statusCode: 204,
                success: true,
                message: 'Service removed from post',
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
