import type { PostDto, UpdatePostDto, PostServiceDto, PostTransportDto, ImageDto } from '../dtos/PostDto.js';
import type { IPostRepository, IImageRepository, IPostServiceRepository, IPostTransportRepository } from '../interfaces/IPostRepository.js';
import type { IServiceRepository } from '../interfaces/IServiceRepository.js';
import type { ITransportRepository } from '../interfaces/ITransportRepository.js';
import { DUMMY_DESTINATION, DUMMY_IMAGE_URLS } from '../config/dummyData.config.js';

export class PostService {
	constructor(
		private postRepository: IPostRepository,
		private postServiceRepository: IPostServiceRepository,
		private postTransportRepository: IPostTransportRepository,
		private imageRepository: IImageRepository,
		private serviceRepository: IServiceRepository,
		private transportRepository: ITransportRepository,
	) { }

	async createPost(dto: PostDto): Promise<string> {
		// const destination = await this.destinationRepository.findOrCreate(dto.destination_name);
		// dto.destination_id = destination.destination_id;

		// Using dummy destination and images for now
		dto.destination_id = DUMMY_DESTINATION.destination_id;
		dto.images = DUMMY_IMAGE_URLS.map((url: string) => ({ url }));

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

	async getAllPublicPosts(filters: any): Promise<any[]> {
		return this.postRepository.findAllPublic(filters);
	}

	async getPost(post_id: string): Promise<any> {
		const post = await this.postRepository.findById(post_id);
		if (!post) throw new Error('Post not found');

		post.images = await this.imageRepository.findByPost(post_id);
		post.services = await this.postServiceRepository.findByPost(post_id);
		post.transports = await this.postTransportRepository.findByPost(post_id);

		return post;
	}

	async updatePost(post_id: string, dto: UpdatePostDto, user_id: number): Promise<boolean> {
		const post = await this.postRepository.findById(post_id);

		if (!post) throw new Error('Post not found');

		if (post.user_id !== user_id) throw new Error('Forbidden: Not the owner');

		return this.postRepository.update(post_id, dto);
	}

	async deletePost(post_id: string, user_id: number): Promise<boolean> {
		const post = await this.postRepository.findById(post_id);

		if (!post) throw new Error('Post not found');
		if (post.user_id !== user_id) throw new Error('Forbidden: Not the owner');

		await this.imageRepository.deleteByPost(post_id);
		await this.postServiceRepository.deleteByPost(post_id);
		await this.postTransportRepository.deleteByPost(post_id);
		return this.postRepository.delete(post_id);
	}

	async getPostsByUser(user_id: string | number): Promise<any[]> {
		const id = typeof user_id === 'string' ? parseInt(user_id, 10) : user_id;
		const posts = await this.postRepository.findAllByUser(id);

		for (const post of posts) {
			post.images = await this.imageRepository.findByPost(post.post_id);
			post.services = await this.postServiceRepository.findByPost(post.post_id);
			post.transports = await this.postTransportRepository.findByPost(post.post_id);
		}

		return posts;
	}
}
