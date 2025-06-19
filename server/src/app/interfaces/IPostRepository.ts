import type { PostDto, UpdatePostDto, ImageDto, PostServiceDto, PostTransportDto } from '../dtos/PostDto.js';

export interface IPostRepository {
	create(post: PostDto): Promise<string>;
	findById(post_id: string): Promise<any>;
	update(post_id: string, post: UpdatePostDto): Promise<boolean>;
	delete(post_id: string): Promise<boolean>;
	findAllPublic(filters: any): Promise<any>;
	findAllByUser(user_id: number): Promise<any[]>;
}

export interface IImageRepository {
	create(post_id: string, dto: ImageDto): Promise<string>;
	findByPost(post_id: string): Promise<any[]>;
	deleteByPost(post_id: string): Promise<void>;
}

export interface IPostServiceRepository {
	create(post_id: string, dto: PostServiceDto): Promise<string>;
	findByPost(post_id: string): Promise<any[]>;
	deleteByPost(post_id: string): Promise<void>;
}

export interface IPostTransportRepository {
	create(post_id: string, dto: PostTransportDto): Promise<string>;
	findByPost(post_id: string): Promise<any[]>;
	deleteByPost(post_id: string): Promise<void>;
}
