import { PostServiceService } from '../../../app/services/PostService.service';

describe('PostServiceService', () => {
    let repo: any;
    let svc: PostServiceService;

    beforeEach(() => {
        repo = {
            getPostById: jest.fn(),
            addPostService: jest.fn(),
            getPostServices: jest.fn(),
            deletePostService: jest.fn(),
        };
        svc = new PostServiceService(repo);
    });

    describe('addServiceToPost', () => {
        it('calls checkPostOwnership and repository.addPostService, returns result', async () => {
            repo.getPostById.mockResolvedValue({ post_id: '1', user_id: 'u' });
            repo.addPostService.mockResolvedValue({ post_service_id: 'ps1' });

            const result = await svc.addServiceToPost({ post_id: '1' } as any, 'u');

            expect(result).toEqual({ post_service_id: 'ps1' });
        });

        it('throws if post not found', async () => {
            repo.getPostById.mockResolvedValue(null);

            await expect(svc.addServiceToPost({ post_id: '1' } as any, 'u')).rejects.toThrow('Post not found');
        });

        it('throws if forbidden', async () => {
            repo.getPostById.mockResolvedValue({ post_id: '1', user_id: 'other' });

            await expect(svc.addServiceToPost({ post_id: '1' } as any, 'u')).rejects.toThrow('Forbidden');
        });
    });

    it('getServicesForPost calls repository.getPostServices and returns result', async () => {
        repo.getPostServices.mockResolvedValue([{ post_service_id: 'ps1' }]);

        const result = await svc.getServicesForPost('1');

        expect(repo.getPostServices).toHaveBeenCalledWith('1', undefined);
        expect(result).toEqual([{ post_service_id: 'ps1' }]);
    });

    describe('removeServiceFromPost', () => {
        it('calls checkPostOwnership and repository.deletePostService, returns result', async () => {
            repo.getPostById.mockResolvedValue({ post_id: '1', user_id: 'u' });
            repo.deletePostService.mockResolvedValue(1);

            const result = await svc.removeServiceFromPost('ps1', '1', 'u');

            expect(result).toBe(1);
        });

        it('throws if post not found', async () => {
            repo.getPostById.mockResolvedValue(null);

            await expect(svc.removeServiceFromPost('ps1', '1', 'u')).rejects.toThrow('Post not found');
        });

        it('throws if forbidden', async () => {
            repo.getPostById.mockResolvedValue({ post_id: '1', user_id: 'other' });
            
            await expect(svc.removeServiceFromPost('ps1', '1', 'u')).rejects.toThrow('Forbidden');
        });
    });
});
