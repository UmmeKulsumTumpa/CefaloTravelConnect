import { AddPostServiceDto } from '../dtos/PostDto.js';
import { IPostRepository, PostService, PostServiceFilter, Post } from '../interfaces/IPostRepository.js';

export class PostServiceService {
    constructor(private postRepository: IPostRepository) {}

    private async checkPostOwnership(post_id: string, user_id: string): Promise<Post> {
        const post = await this.postRepository.getPostById(post_id);
        if (!post) throw new Error('Post not found');
        if (post.user_id !== user_id) throw new Error('Forbidden');
        return post;
    }

    async addServiceToPost(data: AddPostServiceDto, user_id: string): Promise<PostService> {
        await this.checkPostOwnership(data.post_id, user_id);
        return this.postRepository.addPostService(data);
    }

    async getServicesForPost(post_id: string, filters?: PostServiceFilter): Promise<PostService[]> {
        return this.postRepository.getPostServices(post_id, filters);
    }

    async removeServiceFromPost(post_service_id: string, post_id: string, user_id: string): Promise<number> {
        await this.checkPostOwnership(post_id, user_id);
        return this.postRepository.deletePostService(post_service_id);
    }
}
