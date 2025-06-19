import type { PostDto, UpdatePostDto, PostServiceDto, PostTransportDto, ImageDto } from '../dtos/PostDto.js';
import type { IPostRepository, IImageRepository, IPostServiceRepository, IPostTransportRepository } from '../interfaces/IPostRepository.js';
import type { IServiceRepository } from '../interfaces/IServiceRepository.js';
import type { ITransportRepository } from '../interfaces/ITransportRepository.js';

export class PostService {
	constructor(
		private postRepository: IPostRepository,
		private postServiceRepository: IPostServiceRepository,
		private postTransportRepository: IPostTransportRepository,
		private imageRepository: IImageRepository,
		private serviceRepository: IServiceRepository,
		private transportRepository: ITransportRepository,
	) { }

	async createPost(dto: PostDto): Promise<number> {
		
		const postId = await this.postRepository.create(dto);
		
		if (dto.images) {
			for (const img of dto.images) {
				await this.imageRepository.create(postId, img);
			}
		}
		
		if (dto.post_services) {
			for (const s of dto.post_services) {
				await this.postServiceRepository.create(postId, s);
			}
		}
		
		if (dto.post_transports) {
			for (const t of dto.post_transports) {
				await this.postTransportRepository.create(postId, t);
			}
		}
		return postId;
	}

	async getPost(post_id: number): Promise<any> {
		const post = await this.postRepository.findById(post_id);
		if (!post) throw new Error('Post not found');
		post.images = await this.imageRepository.findByPost(post_id);
		post.services = await this.postServiceRepository.findByPost(post_id);
		post.transports = await this.postTransportRepository.findByPost(post_id);
		return post;
	}

	async updatePost(post_id: number, dto: UpdatePostDto): Promise<boolean> {
		return this.postRepository.update(post_id, dto);
	}

	async deletePost(post_id: number): Promise<boolean> {
		await this.imageRepository.deleteByPost(post_id);
		await this.postServiceRepository.deleteByPost(post_id);
		await this.postTransportRepository.deleteByPost(post_id);
		return this.postRepository.delete(post_id);
	}

	async getPostsByUser(user_id: number): Promise<any[]> {
		const posts = await this.postRepository.findAllByUser(user_id);
		for (const post of posts) {
			post.images = await this.imageRepository.findByPost(post.post_id);
			post.services = await this.postServiceRepository.findByPost(post.post_id);
			post.transports = await this.postTransportRepository.findByPost(post.post_id);
		}
		return posts;
	}
}
