import { PostService } from '../../../app/services/Post.service';

describe('PostService', () => {
    let repo: any;
    let svc: PostService;

    beforeEach(() => {
        repo = {
            createPost: jest.fn(),
            updatePost: jest.fn(),
            getPostById: jest.fn(),
            getAllPosts: jest.fn(),
            deletePost: jest.fn(),
            likePost: jest.fn(),
        };
        svc = new PostService(repo);
    });

    it('createPost calls repository.createPost and returns result', async () => {
        repo.createPost.mockResolvedValue({ id: '1' });

        const result = await svc.createPost({} as any);

        expect(repo.createPost).toHaveBeenCalled();
        expect(result).toEqual({ id: '1' });
    });

    it('updatePost calls repository.updatePost and returns result', async () => {
        repo.updatePost.mockResolvedValue({ id: '1' });

        const result = await svc.updatePost('1', {} as any);

        expect(repo.updatePost).toHaveBeenCalledWith('1', {});
        expect(result).toEqual({ id: '1' });
    });

    it('getPostById calls repository.getPostById and returns result', async () => {
        repo.getPostById.mockResolvedValue({ id: '1' });

        const result = await svc.getPostById('1');

        expect(repo.getPostById).toHaveBeenCalledWith('1');
        expect(result).toEqual({ id: '1' });
    });

    it('getPostById returns undefined if not found', async () => {
        repo.getPostById.mockResolvedValue(undefined);

        const result = await svc.getPostById('notfound');

        expect(result).toBeUndefined();
    });

    it('getAllPosts calls repository.getAllPosts with filters and returns result', async () => {
        repo.getAllPosts.mockResolvedValue([{ id: '1' }]);

        const result = await svc.getAllPosts({ foo: 'bar' } as any);

        expect(repo.getAllPosts).toHaveBeenCalledWith({ foo: 'bar' });
        expect(result).toEqual([{ id: '1' }]);
    });

    it('deletePost calls repository.deletePost and returns result', async () => {
        repo.deletePost.mockResolvedValue(1);

        const result = await svc.deletePost('1');

        expect(repo.deletePost).toHaveBeenCalledWith('1');
        expect(result).toBe(1);
    });

    it('likePost calls repository.likePost and returns result', async () => {
        repo.likePost.mockResolvedValue({ id: '1', likes: 1 });

        const result = await svc.likePost('1');
        
        expect(repo.likePost).toHaveBeenCalledWith('1');
        expect(result).toEqual({ id: '1', likes: 1 });
    });
});
