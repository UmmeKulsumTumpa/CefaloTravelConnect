import { Request, Response, NextFunction } from 'express';
import db from '../../db/db.js';
import sendResponse from '../utils/sendResponse.js';

export function postAccessGuard(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId;
    if (!postId) {
        sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Post ID is required',
            data: null
        });
        return;
    }

    db('posts')
        .select('user_id', 'visibility')
        .where({ post_id: postId })
        .first()
        .then(post => {
            if (!post) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Post not found',
                    data: null
                });
                return;
            }

            if (post.visibility === 'Public') {
                next();
                return;
            }

            const user = (req as any).user;
            if (user && user.user_id === post.user_id) {
                next();
                return;
            }

            sendResponse(res, {
                statusCode: 403,
                success: false,
                message: 'Forbidden: You do not have access to this post',
                data: null
            });
            return;
        })
        .catch(() => {
            sendResponse(res, {
                statusCode: 500,
                success: false,
                message: 'Internal server error',
                data: null
            });
            return;
        });
}
