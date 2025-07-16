import { CreatePostDto, UpdatePostDto } from '../dtos/index.js';
import { IPostRepository, Post, PostFilter } from '../interfaces/index.js';

export class PostService {
    constructor(private postRepository: IPostRepository) {}

    async createPost(data: CreatePostDto): Promise<Post> {
        return this.postRepository.createPost(data);
    }

    async updatePost(post_id: string, data: UpdatePostDto): Promise<Post> {
        return this.postRepository.updatePost(post_id, data);
    }

    async getPostById(post_id: string): Promise<Post | undefined> {
        return this.postRepository.getPostById(post_id);
    }

    async getAllPosts(filters: PostFilter): Promise<Post[]> {
        return this.postRepository.getAllPosts(filters);
    }

    async deletePost(post_id: string): Promise<number> {
        return this.postRepository.deletePost(post_id);
    }

    async likePost(post_id: string): Promise<Post> {
        return this.postRepository.likePost(post_id);
    }
}
