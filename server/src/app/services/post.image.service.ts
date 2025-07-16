import { AddImageDto } from '../dtos/index.js';
import { IPostRepository, Image, Post } from '../interfaces/index.js';

export class PostImageService {
    constructor(private postRepository: IPostRepository) {}

    private async checkPostOwnership(post_id: string, user_id: string): Promise<Post> {
        const post = await this.postRepository.getPostById(post_id);
        if (!post) throw new Error('Post not found');
        if (post.user_id !== user_id) throw new Error('Forbidden');
        return post;
    }

    async addImageToPost(data: AddImageDto, user_id: string): Promise<Image> {
        await this.checkPostOwnership(data.post_id, user_id);
        return this.postRepository.addImage(data);
    }

    async getImagesForPost(post_id: string): Promise<Image[]> {
        return this.postRepository.getPostImages(post_id);
    }

    async removeImageFromPost(image_id: string, post_id: string, user_id: string): Promise<number> {
        await this.checkPostOwnership(post_id, user_id);
        return this.postRepository.deleteImage(image_id);
    }
}
