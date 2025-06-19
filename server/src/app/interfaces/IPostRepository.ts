import type { PostDto, UpdatePostDto, ImageDto, PostServiceDto, PostTransportDto } from '../dtos/PostDto.js';

export interface IPostRepository {
	create(post: PostDto): Promise<number>;
	findById(post_id: number): Promise<any>;
	update(post_id: number, post: UpdatePostDto): Promise<boolean>;
	delete(post_id: number): Promise<boolean>;
	findAllByUser(user_id: number): Promise<any[]>;
}

export interface IImageRepository {
	create(post_id: number, dto: ImageDto): Promise<number>;
	findByPost(post_id: number): Promise<any[]>;
	deleteByPost(post_id: number): Promise<void>;
}

export interface IPostServiceRepository {
	create(post_id: number, dto: PostServiceDto): Promise<number>;
	findByPost(post_id: number): Promise<any[]>;
	deleteByPost(post_id: number): Promise<void>;
}

export interface IPostTransportRepository {
	create(post_id: number, dto: PostTransportDto): Promise<number>;
	findByPost(post_id: number): Promise<any[]>;
	deleteByPost(post_id: number): Promise<void>;
}
