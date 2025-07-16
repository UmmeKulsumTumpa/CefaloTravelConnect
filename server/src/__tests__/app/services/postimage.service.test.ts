import { PostImageService } from '../../../app/services/post.image.service';

describe('PostImageService', () => {
    let repo: any;
    let svc: PostImageService;

    beforeEach(() => {
        repo = {
            getPostById: jest.fn(),
            addImage: jest.fn(),
            getPostImages: jest.fn(),
            deleteImage: jest.fn(),
        };
        svc = new PostImageService(repo);
    });

    describe('addImageToPost', () => {
        it('calls checkPostOwnership and repository.addImage, returns result', async () => {
            repo.getPostById.mockResolvedValue({ post_id: '1', user_id: 'u' });
            repo.addImage.mockResolvedValue({ image_id: 'img1' });

            const result = await svc.addImageToPost({ post_id: '1' } as any, 'u');

            expect(result).toEqual({ image_id: 'img1' });
        });

        it('throws if post not found', async () => {
            repo.getPostById.mockResolvedValue(null);

            await expect(svc.addImageToPost({ post_id: '1' } as any, 'u')).rejects.toThrow('Post not found');
        });

        it('throws if forbidden', async () => {
            repo.getPostById.mockResolvedValue({ post_id: '1', user_id: 'other' });

            await expect(svc.addImageToPost({ post_id: '1' } as any, 'u')).rejects.toThrow('Forbidden');
        });
    });

    it('getImagesForPost calls repository.getPostImages and returns result', async () => {
        repo.getPostImages.mockResolvedValue([{ image_id: 'img1' }]);

        const result = await svc.getImagesForPost('1');

        expect(repo.getPostImages).toHaveBeenCalledWith('1');
        expect(result).toEqual([{ image_id: 'img1' }]);
    });

    describe('removeImageFromPost', () => {
        it('calls checkPostOwnership and repository.deleteImage, returns result', async () => {
            repo.getPostById.mockResolvedValue({ post_id: '1', user_id: 'u' });
            repo.deleteImage.mockResolvedValue(1);

            const result = await svc.removeImageFromPost('img1', '1', 'u');

            expect(result).toBe(1);
        });

        it('throws if post not found', async () => {
            repo.getPostById.mockResolvedValue(null);

            await expect(svc.removeImageFromPost('img1', '1', 'u')).rejects.toThrow('Post not found');
        });

        it('throws if forbidden', async () => {
            repo.getPostById.mockResolvedValue({ post_id: '1', user_id: 'other' });
            
            await expect(svc.removeImageFromPost('img1', '1', 'u')).rejects.toThrow('Forbidden');
        });
    });
});
