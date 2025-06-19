import type { Knex } from 'knex';
import type { PostDto, UpdatePostDto, ImageDto, PostServiceDto, PostTransportDto } from '../dtos/PostDto.js';
import type { IPostRepository, IImageRepository, IPostServiceRepository, IPostTransportRepository } from '../interfaces/IPostRepository.js';

export class PostRepository implements IPostRepository {
	constructor(private knex: Knex) { }

	async create(post: PostDto): Promise<number> {
		const [id] = await this.knex('posts').insert({
			user_id: post.user_id,
			title: post.title,
			total_cost: post.total_cost,
			total_duration: post.total_duration,
			effort_level: post.effort_level,
			destination_id: post.destination_id,
			categories: post.categories ? post.categories.join(',') : null,
			visibility: post.visibility,
			created_at: this.knex.fn.now(),
		}).returning('post_id');
		return id.post_id || id;
	}

	async findById(post_id: number): Promise<any> {
		return this.knex('posts').where({ post_id }).first();
	}

	async update(post_id: number, post: UpdatePostDto): Promise<boolean> {
		const result = await this.knex('posts').where({ post_id }).update({
			...post,
			updated_at: this.knex.fn.now(),
		});
		return result > 0;
	}

	async delete(post_id: number): Promise<boolean> {
		const result = await this.knex('posts').where({ post_id }).del();
		return result > 0;
	}

	async findAllByUser(user_id: number): Promise<any[]> {
		return this.knex('posts').where({ user_id }).orderBy('created_at', 'desc');
	}
}

export class ImageRepository implements IImageRepository {
	constructor(private knex: Knex) { }

	async create(post_id: number, dto: ImageDto): Promise<number> {
		const [id] = await this.knex('images').insert({
			post_id,
			url: dto.url,
			caption: dto.caption,
			created_at: this.knex.fn.now(),
		}).returning('image_id');
		return id.image_id || id;
	}

	async findByPost(post_id: number): Promise<any[]> {
		return this.knex('images').where({ post_id });
	}

	async deleteByPost(post_id: number): Promise<void> {
		await this.knex('images').where({ post_id }).del();
	}
}

export class PostServiceRepository implements IPostServiceRepository {
	constructor(private knex: Knex) { }

	async create(post_id: number, dto: PostServiceDto): Promise<number> {
		const [id] = await this.knex('post_services').insert({
			post_id,
			service_id: dto.service_id,
			cost: dto.cost,
			rating: dto.rating,
			visit_date: dto.visit_date,
			notes: dto.notes,
			created_at: this.knex.fn.now(),
		}).returning('post_service_id');
		return id.post_service_id || id;
	}

	async findByPost(post_id: number): Promise<any[]> {
		return this.knex('post_services').where({ post_id });
	}

	async deleteByPost(post_id: number): Promise<void> {
		await this.knex('post_services').where({ post_id }).del();
	}
}

export class PostTransportRepository implements IPostTransportRepository {
	constructor(private knex: Knex) { }

	async create(post_id: number, dto: PostTransportDto): Promise<number> {
		const [id] = await this.knex('post_transports').insert({
			post_id,
			transport_id: dto.transport_id,
			cost: dto.cost,
			rating: dto.rating,
			departure_time: dto.departure_time,
			arrival_time: dto.arrival_time,
			notes: dto.notes,
			created_at: this.knex.fn.now(),
		}).returning('post_transport_id');
		return id.post_transport_id || id;
	}

	async findByPost(post_id: number): Promise<any[]> {
		return this.knex('post_transports').where({ post_id });
	}

	async deleteByPost(post_id: number): Promise<void> {
		await this.knex('post_transports').where({ post_id }).del();
	}
}
