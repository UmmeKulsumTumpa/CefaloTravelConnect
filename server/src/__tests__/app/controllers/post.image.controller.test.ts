import { PostImageController } from '../../../app/controllers/post.image.controller';
import { PostImageService } from '../../../app/services/post.image.service';
import httpMocks from 'node-mocks-http';
import type { AddImageDto } from '../../../app/dtos/postDto';
import type { Image } from '../../../app/interfaces/post.interface';

describe('PostImageController', () => {
    let postImageService: jest.Mocked<PostImageService>;
    let controller: PostImageController;
    let req: any, res: any;

    beforeEach(() => {
        postImageService = {
            addImageToPost: jest.fn(),
            getImagesForPost: jest.fn(),
            removeImageFromPost: jest.fn(),
        } as any;
        controller = new PostImageController(postImageService);
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    const mockPostImage: Image = {
        image_id: '1',
        post_id: '1',
        url: 'https://example.com/image.jpg',
        caption: 'Test Image',
        created_at: '2023-01-01T00:00:00.000Z'
    };

    describe('addImage', () => {
        it('should add image successfully', async () => {
            postImageService.addImageToPost.mockResolvedValue(mockPostImage);
            req.params.postId = '1';
            req.body = { image_url: 'https://example.com/image.jpg' };
            (req as any).user = { user_id: 1 };

            await controller.addImage(req, res);

            expect(res.statusCode).toBe(201);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Image added to post');
        });

        it('should handle post not found error', async () => {
            postImageService.addImageToPost.mockRejectedValue(new Error('Post not found'));
            req.params.postId = '1';
            req.body = { image_url: 'https://example.com/image.jpg' };
            (req as any).user = { user_id: 1 };

            await controller.addImage(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Post not found');
        });

        it('should handle forbidden error', async () => {
            postImageService.addImageToPost.mockRejectedValue(new Error('Forbidden'));
            req.params.postId = '1';
            req.body = { image_url: 'https://example.com/image.jpg' };
            (req as any).user = { user_id: 1 };

            await controller.addImage(req, res);

            expect(res.statusCode).toBe(403);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Forbidden');
        });

        it('should handle internal server error', async () => {
            postImageService.addImageToPost.mockRejectedValue(new Error('Database error'));
            req.params.postId = '1';
            req.body = { image_url: 'https://example.com/image.jpg' };
            (req as any).user = { user_id: 1 };

            await controller.addImage(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });

    describe('getImages', () => {
        it('should get images successfully', async () => {
            postImageService.getImagesForPost.mockResolvedValue([mockPostImage]);
            req.params.postId = '1';

            await controller.getImages(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Images fetched for post');
        });
    });

    describe('deleteImage', () => {
        it('should delete image successfully', async () => {
            postImageService.removeImageFromPost.mockResolvedValue(1);
            req.params.postId = '1';
            req.params.imageId = '1';
            (req as any).user = { user_id: 1 };

            await controller.deleteImage(req, res);

            expect(res.statusCode).toBe(204);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Image removed from post');
        });

        it('should handle post not found error', async () => {
            postImageService.removeImageFromPost.mockRejectedValue(new Error('Post not found'));
            req.params.postId = '1';
            req.params.imageId = '1';
            (req as any).user = { user_id: 1 };

            await controller.deleteImage(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Post not found');
        });

        it('should handle forbidden error', async () => {
            postImageService.removeImageFromPost.mockRejectedValue(new Error('Forbidden'));
            req.params.postId = '1';
            req.params.imageId = '1';
            (req as any).user = { user_id: 1 };

            await controller.deleteImage(req, res);

            expect(res.statusCode).toBe(403);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Forbidden');
        });

        it('should handle internal server error', async () => {
            postImageService.removeImageFromPost.mockRejectedValue(new Error('Database error'));
            req.params.postId = '1';
            req.params.imageId = '1';
            (req as any).user = { user_id: 1 };

            await controller.deleteImage(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });
});
