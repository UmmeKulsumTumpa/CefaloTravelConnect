import { PostServiceController } from '../../../app/controllers/post.service.controller';
import { PostServiceService } from '../../../app/services/post.service.service';
import httpMocks from 'node-mocks-http';
import type { AddPostServiceDto } from '../../../app/dtos/postDto';
import type { PostService } from '../../../app/interfaces/post.interface';

describe('PostServiceController', () => {
    let postServiceService: jest.Mocked<PostServiceService>;
    let controller: PostServiceController;
    let req: any, res: any;

    beforeEach(() => {
        postServiceService = {
            addServiceToPost: jest.fn(),
            getServicesForPost: jest.fn(),
            removeServiceFromPost: jest.fn(),
        } as any;
        controller = new PostServiceController(postServiceService);
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    const mockPostService: PostService = {
        post_service_id: '1',
        post_id: '1',
        service_id: '1',
        cost: 100,
        rating: 4,
        visit_date: '2023-01-01',
        notes: 'Test notes',
        recommended: true,
        created_at: '2023-01-01T00:00:00.000Z'
    };

    describe('addService', () => {
        it('should add service successfully', async () => {
            postServiceService.addServiceToPost.mockResolvedValue(mockPostService);
            req.params.postId = '1';
            req.body = { service_id: '1' };
            (req as any).user = { user_id: 1 };

            await controller.addService(req, res);

            expect(res.statusCode).toBe(201);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Service added to post');
        });

        it('should handle post not found error', async () => {
            postServiceService.addServiceToPost.mockRejectedValue(new Error('Post not found'));
            req.params.postId = '1';
            req.body = { service_id: '1' };
            (req as any).user = { user_id: 1 };

            await controller.addService(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Post not found');
        });

        it('should handle forbidden error', async () => {
            postServiceService.addServiceToPost.mockRejectedValue(new Error('Forbidden'));
            req.params.postId = '1';
            req.body = { service_id: '1' };
            (req as any).user = { user_id: 1 };

            await controller.addService(req, res);

            expect(res.statusCode).toBe(403);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Forbidden');
        });

        it('should handle internal server error', async () => {
            postServiceService.addServiceToPost.mockRejectedValue(new Error('Database error'));
            req.params.postId = '1';
            req.body = { service_id: '1' };
            (req as any).user = { user_id: 1 };

            await controller.addService(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });

    describe('getServices', () => {
        it('should get services successfully', async () => {
            postServiceService.getServicesForPost.mockResolvedValue([mockPostService]);
            req.params.postId = '1';

            await controller.getServices(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Services fetched for post');
        });
    });

    describe('deleteService', () => {
        it('should delete service successfully', async () => {
            postServiceService.removeServiceFromPost.mockResolvedValue(1);
            req.params.postId = '1';
            req.params.postServiceId = '1';
            (req as any).user = { user_id: 1 };

            await controller.deleteService(req, res);

            expect(res.statusCode).toBe(204);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Service removed from post');
        });

        it('should handle post not found error', async () => {
            postServiceService.removeServiceFromPost.mockRejectedValue(new Error('Post not found'));
            req.params.postId = '1';
            req.params.postServiceId = '1';
            (req as any).user = { user_id: 1 };

            await controller.deleteService(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Post not found');
        });

        it('should handle forbidden error', async () => {
            postServiceService.removeServiceFromPost.mockRejectedValue(new Error('Forbidden'));
            req.params.postId = '1';
            req.params.postServiceId = '1';
            (req as any).user = { user_id: 1 };

            await controller.deleteService(req, res);

            expect(res.statusCode).toBe(403);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Forbidden');
        });

        it('should handle internal server error', async () => {
            postServiceService.removeServiceFromPost.mockRejectedValue(new Error('Database error'));
            req.params.postId = '1';
            req.params.postServiceId = '1';
            (req as any).user = { user_id: 1 };

            await controller.deleteService(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });
});
